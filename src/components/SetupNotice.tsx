import Link from "next/link";

export default function SetupNotice() {
  return (
    <main className="wrap py-20">
      <div className="box max-w-2xl mx-auto">
        <span className="tag mb-6">ANJALEE · PORTFOLIO</span>
        <h1 className="font-display text-4xl mb-5">Ready to connect.</h1>
        <p className="mb-6">The portfolio needs its Supabase project before content and the admin dashboard can load.</p>
        <ol className="list-decimal pl-6 space-y-3 text-sm">
          <li>Create a Supabase project, then run <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code> in its SQL Editor.</li>
          <li>Create your admin user and add its ID to <code>portfolio_admins</code> using the deployment guide.</li>
          <li>Add the project URL and public key to <code>.env.local</code>, then restart the server.</li>
        </ol>
        <p className="mt-6 text-sm">Full instructions: <code>docs/DEPLOYMENT.md</code></p>
        <Link href="https://supabase.com/dashboard" className="btn primary mt-6" target="_blank" rel="noopener noreferrer">OPEN SUPABASE ↗</Link>
      </div>
    </main>
  );
}
