"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="wrap py-20"><div className="box max-w-xl mx-auto">
    <h1 className="font-display text-3xl mb-4">Content is temporarily unavailable.</h1>
    <p className="mb-6">Please try again shortly. If you manage this portfolio, check the Supabase connection and database setup.</p>
    <button className="btn primary" onClick={reset}>TRY AGAIN</button>
  </div></main>;
}
