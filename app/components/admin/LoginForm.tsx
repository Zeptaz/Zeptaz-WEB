'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError('Supabase is not configured - set the env vars in .env.local first.');
      return;
    }
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(data.get('email')),
      password: String(data.get('password')),
    });
    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm border border-border bg-bg-subtle/70 p-7">
      <div className="mono-meta text-crimson">Admin access</div>
      <h1 className="heading-md mt-2 text-text-primary">Sign in to continue.</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mono-meta mb-2 block text-text-muted">Email</label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="w-full border border-border-strong bg-bg-primary px-3.5 py-3 text-sm text-text-primary placeholder:text-text-faint focus:border-crimson focus:outline-none"
            placeholder="you@zeptaz.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="mono-meta mb-2 block text-text-muted">Password</label>
          <input
            id="password" name="password" type="password" required autoComplete="current-password"
            className="w-full border border-border-strong bg-bg-primary px-3.5 py-3 text-sm text-text-primary placeholder:text-text-faint focus:border-crimson focus:outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full disabled:cursor-wait disabled:opacity-70">
        {loading ? <>Signing in <LoaderCircle className="h-4 w-4 animate-spin" /></> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
      </button>

      {error && (
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-crimson" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
