import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--cyan-100)' }}>404</h1>
      <p className="mb-8" style={{ color: 'var(--cyan-300)' }}>Signal lost.</p>
      <Link
        to="/"
        className="px-6 py-3 border rounded font-mono uppercase text-sm tracking-widest"
        style={{ borderColor: 'var(--cyan-400)', color: 'var(--cyan-100)' }}
      >
        Return to base
      </Link>
    </main>
  );
}
