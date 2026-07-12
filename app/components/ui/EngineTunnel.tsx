'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * Camera fly-through "tunnel" for The Engine section.
 *
 * The 11 modules are placed as glowing ring-nodes along a curve receding into
 * depth, threaded by a bloom-lit tube with ASCII glyph "packets" flowing
 * forward (the site's signature ASCII language, carried into the 3D scene).
 * The camera visits each module in turn (auto-advance) with a filmic blink on
 * loop restart. Only a window of the path ahead of the camera is revealed -
 * the route "builds" as you travel and distant nodes stay hidden.
 * It's auto-driven (time-based) - no scroll-scrub, no pin - and fits inside
 * its column. `onFocus` reports the focused module to the DOM panel; clicking
 * a ring focuses it (reciprocal of the DOM rail).
 */

const CRIMSON = '#DC143C';
const TUBE = '#FFFFFF';
const PACKET = '#FF5675';
const SEG = 7; // z spacing between modules
const CAM_DIST = 9; // camera distance in front of the focused node
const ADVANCE = 2.7; // seconds per module (keep in sync with Engine.tsx progress cue)
const INTRO = 1.8; // seconds for the fly-in
const PARALLAX = 1.5;
const AHEAD = 0.16; // how much of the path (0..1) is revealed past the focused node
const PACKETS = 14;
const GLYPHS = '#=/%<>*+;{}';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

interface Mod {
  id: string;
  name: string;
}
interface Props {
  modules: Mod[];
  started: { value: boolean };
  focus: number;
  onFocus: (i: number) => void;
  paused?: boolean;
  reduced?: boolean;
}

/** White mono glyphs on transparent canvases - tinted by the sprite material. */
function makeGlyphTextures(): THREE.CanvasTexture[] {
  return GLYPHS.split('').map((ch) => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.font = '700 46px "Geist Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(ch, 32, 34);
    return new THREE.CanvasTexture(c);
  });
}

function Tunnel({ modules, started, focus, onFocus, paused = false, reduced = false }: Props) {
  const N = modules.length;
  const gl = useThree((s) => s.gl);

  // Module anchor points receding into −Z with a gentle wander.
  const nodes = useMemo(
    () =>
      modules.map(
        (_, i) => new THREE.Vector3(Math.sin(i * 0.9) * 3.2, Math.cos(i * 0.7) * 1.9, -i * SEG),
      ),
    [modules],
  );
  const curve = useMemo(() => new THREE.CatmullRomCurve3(nodes, false, 'catmullrom', 0.4), [nodes]);

  const coreGeo = useMemo(() => new THREE.TubeGeometry(curve, 700, 0.16, 10, false), [curve]);
  const haloGeo = useMemo(() => new THREE.TubeGeometry(curve, 700, 0.5, 10, false), [curve]);
  // Dashed outer "dial" ring shared by all nodes.
  const dialGeo = useMemo(() => {
    const pts = new THREE.EllipseCurve(0, 0, 1.24, 1.24, 0, Math.PI * 2, false, 0).getPoints(72);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);
  useEffect(
    () => () => {
      coreGeo.dispose();
      haloGeo.dispose();
      dialGeo.dispose();
    },
    [coreGeo, haloGeo, dialGeo],
  );

  // ASCII glyph packets flowing along the tube.
  const glyphTexs = useMemo(() => makeGlyphTextures(), []);
  useEffect(() => () => glyphTexs.forEach((t) => t.dispose()), [glyphTexs]);
  const packets = useMemo(
    () =>
      Array.from({ length: PACKETS }, (_, i) => ({
        base: i / PACKETS,
        speed: 0.035 + Math.random() * 0.03,
        size: 0.4 + Math.random() * 0.35,
        tex: (Math.random() * GLYPHS.length) | 0,
      })),
    [],
  );
  const packetRefs = useRef<(THREE.Sprite | null)[]>([]);

  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const coreMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const labelRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const parallax = useRef({ x: 0, y: 0 }); // damped pointer
  const intro = useRef(0);
  const focusF = useRef(0); // smoothed float focus
  const target = useRef(0); // integer target
  const acc = useRef(0); // auto-advance accumulator
  const dim = useRef(1); // global brightness (the loop-restart "blink")
  const wrapPhase = useRef<'run' | 'out' | 'in'>('run');
  const ringOps = useRef(new Float32Array(N)); // smoothed per-ring opacity
  const flash = useRef(new Float32Array(N)); // packet pass-through flash
  const [labelIdx, setLabelIdx] = useState(0);

  // Click-to-jump from the DOM rail (or from a ring click).
  useEffect(() => {
    target.current = focus;
    acc.current = 0;
  }, [focus]);

  // Pausing resets the interval so the DOM progress cue and the tunnel agree
  // on a full ADVANCE window after resume.
  useEffect(() => {
    if (paused) acc.current = 0;
  }, [paused]);

  // Pointer parallax (damped in the frame loop).
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  // Reset the cursor if we unmount mid-hover.
  useEffect(() => () => { gl.domElement.style.cursor = ''; }, [gl]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;

    // Intro fly-in once the section is in view.
    if (reduced) intro.current = 1;
    else if (started.value) intro.current = Math.min(intro.current + d / INTRO, 1);
    const it = easeOutCubic(intro.current);

    // Loop-restart blink: dim out, snap back to the start, dim in.
    if (wrapPhase.current === 'out') {
      dim.current = Math.max(dim.current - d * 4, 0);
      if (dim.current === 0) {
        focusF.current = target.current;
        wrapPhase.current = 'in';
      }
    } else if (wrapPhase.current === 'in') {
      dim.current = Math.min(dim.current + d * 2.5, 1);
      if (dim.current === 1) wrapPhase.current = 'run';
    }

    // Auto-advance focus through the modules.
    if (!reduced && intro.current >= 1 && !paused && wrapPhase.current === 'run') {
      acc.current += d;
      if (acc.current >= ADVANCE) {
        acc.current = 0;
        const next = (target.current + 1) % N;
        if (next < target.current) wrapPhase.current = 'out'; // blink instead of a hard cut
        target.current = next;
        onFocus(next);
      }
    }

    // Ease the float focus toward the integer target (frozen during the blink-out).
    if (wrapPhase.current !== 'out') {
      focusF.current += (target.current - focusF.current) * Math.min(d * 2.4, 1);
    }

    // Reveal window: only the path up to just past the focused node is drawn -
    // scaled by the intro so the tube still grows in from nothing.
    const u = THREE.MathUtils.clamp(focusF.current / (N - 1), 0, 1);
    // Reduced motion renders one static frame - show the whole path there.
    const span = reduced ? 1 : Math.max(0.02, it * THREE.MathUtils.clamp(u + AHEAD, AHEAD, 1));
    const cCount = coreGeo.index ? coreGeo.index.count : 0;
    const hCount = haloGeo.index ? haloGeo.index.count : 0;
    coreGeo.setDrawRange(0, Math.floor((cCount * span) / 3) * 3);
    haloGeo.setDrawRange(0, Math.floor((hCount * span) / 3) * 3);
    if (coreMatRef.current) coreMatRef.current.opacity = 0.95 * dim.current;
    if (haloMatRef.current) haloMatRef.current.opacity = 0.18 * dim.current;

    // Camera: damped parallax, dolly to the focused node, slight banking.
    parallax.current.x += (pointer.current.x - parallax.current.x) * Math.min(d * 3, 1);
    parallax.current.y += (pointer.current.y - parallax.current.y) * Math.min(d * 3, 1);
    const p = curve.getPointAt(u);
    const ahead = curve.getPointAt(Math.min(u + 0.08, 1));
    const back = (1 - it) * 46; // start far away
    const px = reduced ? 0 : parallax.current.x * PARALLAX;
    const py = reduced ? 0 : -parallax.current.y * PARALLAX;
    state.camera.position.set(p.x + px, p.y + py, p.z + CAM_DIST + back);
    state.camera.lookAt(ahead.x, ahead.y, ahead.z);
    const tangent = curve.getTangentAt(u);
    state.camera.rotateZ(tangent.x * 0.18); // bank into the curve

    // Ring nodes: appear inside the reveal window, focused one larger/brighter,
    // depth-faded so distant nodes dissolve instead of cluttering the frame.
    const focusInt = Math.round(focusF.current);
    for (let i = 0; i < N; i++) {
      const g = groupRefs.current[i];
      if (!g) continue;
      const inWindow = i / (N - 1) <= span + 0.001;
      const isFocus = focusInt === i;
      const s = inWindow ? (isFocus ? 1.6 : 1.0) : 0.0001;
      const sc = g.scale.x + (s - g.scale.x) * Math.min(d * 6, 1);
      g.scale.setScalar(sc);

      const dist = g.position.distanceTo(state.camera.position);
      const depthFade = THREE.MathUtils.clamp(1 - (dist - CAM_DIST - 4) / 24, 0.2, 1);
      const targetOp = inWindow ? (isFocus ? 1 : 0.5 * depthFade) : 0;
      ringOps.current[i] += (targetOp - ringOps.current[i]) * Math.min(d * 5, 1);
      flash.current[i] = Math.max(flash.current[i] - d * 2.5, 0);
      const op = ringOps.current[i];
      const fl = flash.current[i];

      const [ring, dial, core] = g.children as [THREE.Mesh, THREE.LineLoop, THREE.Mesh];
      ring.rotation.z += d * (isFocus ? 0.5 : 0.12);
      dial.rotation.z -= d * (isFocus ? 0.3 : 0.08);
      (ring.material as THREE.MeshBasicMaterial).opacity = Math.min(op + fl * 0.5, 1) * dim.current;
      (dial.material as THREE.LineDashedMaterial).opacity = op * 0.55 * dim.current;
      (core.material as THREE.MeshBasicMaterial).opacity = (isFocus ? 1 : 0.7) * op * dim.current;
      core.scale.setScalar(isFocus ? 1 + Math.sin(t * 5) * 0.12 + fl * 0.2 : 0.8);
    }

    // Floating label follows the focused node.
    if (labelRef.current) labelRef.current.position.set(p.x, p.y + 1.6, p.z);
    if (focusInt !== labelIdx) setLabelIdx(focusInt);

    // ASCII packets flow forward along the revealed window; passing a node
    // flashes its ring so the system reads as live traffic, not a loop.
    const showPackets = intro.current > 0.15;
    for (let i = 0; i < PACKETS; i++) {
      const sp = packetRefs.current[i];
      if (!sp) continue;
      sp.visible = showPackets;
      if (!showPackets) continue;
      const pk = packets[i];
      const phase = reduced
        ? Math.min(pk.base * span, 0.999)
        : Math.min((pk.base + t * pk.speed) % span, 0.999);
      const v = curve.getPointAt(phase);
      sp.position.copy(v);
      (sp.material as THREE.SpriteMaterial).opacity = 0.9 * dim.current;
      // near a node? flash it (strongest on the focused ring)
      const near = Math.round(phase * (N - 1));
      if (Math.abs(phase * (N - 1) - near) < 0.06) {
        flash.current[near] = Math.max(flash.current[near], near === focusInt ? 1 : 0.45);
      }
    }
  });

  const safeLabel = modules[Math.min(Math.max(labelIdx, 0), N - 1)];

  return (
    <>
      <mesh geometry={haloGeo}>
        <meshBasicMaterial
          ref={haloMatRef}
          color={TUBE}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh geometry={coreGeo}>
        <meshBasicMaterial ref={coreMatRef} color={TUBE} toneMapped={false} transparent opacity={0.95} depthWrite={false} />
      </mesh>

      {nodes.map((n, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el;
          }}
          position={n}
        >
          {/* main ring */}
          <mesh>
            <torusGeometry args={[0.9, 0.055, 10, 48]} />
            <meshBasicMaterial color={CRIMSON} toneMapped={false} transparent depthWrite={false} />
          </mesh>
          {/* dashed outer dial (counter-rotating) */}
          <lineLoop
            geometry={dialGeo}
            onUpdate={(l: THREE.LineLoop) => l.computeLineDistances()}
          >
            <lineDashedMaterial
              color={CRIMSON}
              dashSize={0.16}
              gapSize={0.11}
              toneMapped={false}
              transparent
              depthWrite={false}
            />
          </lineLoop>
          {/* bright core kernel (blooms) */}
          <mesh>
            <octahedronGeometry args={[0.13, 0]} />
            <meshBasicMaterial color={TUBE} toneMapped={false} transparent depthWrite={false} />
          </mesh>
          {/* invisible hit area - click a ring to focus it */}
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              onFocus(i);
            }}
            onPointerOver={() => { gl.domElement.style.cursor = 'pointer'; }}
            onPointerOut={() => { gl.domElement.style.cursor = ''; }}
          >
            <circleGeometry args={[1.25, 24]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {packets.map((pk, i) => (
        <sprite
          key={i}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
          scale={[pk.size, pk.size, 1]}
          visible={false}
        >
          <spriteMaterial
            map={glyphTexs[pk.tex]}
            color={PACKET}
            toneMapped={false}
            transparent
            opacity={0.9}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}

      <group ref={labelRef}>
        <Html center distanceFactor={14} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          {/* keyed so each module change re-runs the crossfade instead of popping */}
          <div key={labelIdx} className="animate-engine-fade whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em] text-text-primary">
            <span className="text-crimson">{String(labelIdx + 1).padStart(2, '0')}</span>{' '}
            {safeLabel?.name}
          </div>
        </Html>
      </group>

      <EffectComposer>
        <Bloom intensity={1.15} luminanceThreshold={0.12} luminanceSmoothing={0.3} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export default function EngineTunnel(props: Props) {
  // Pause the whole render loop while the tunnel is scrolled offscreen
  // (mirrors AsciiWall's IntersectionObserver pattern).
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!props.modules || props.modules.length < 2) return null;
  return (
    <div ref={wrap} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={props.reduced || !visible ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 50, position: [0, 0, 14], near: 0.1, far: 400 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Tunnel {...props} />
      </Canvas>
    </div>
  );
}
