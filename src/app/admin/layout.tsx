import SetupNotice from "@/components/SetupNotice";
import { getSupabaseConfig } from "@/lib/supabase/config";
import Link from "next/link";
import { signOutAction } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!getSupabaseConfig()) return <SetupNotice />;
  return (
    <div className="min-h-dvh bg-neutral-100 text-neutral-900">
      <header className="bg-white border-b-2 border-neutral-900 px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
        <div className="font-bold">Admin</div>
        <nav className="flex flex-wrap gap-5 text-sm">
          <Link href="/admin">Profile</Link>
          <Link href="/admin/sections">Sections</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/" target="_blank" className="text-neutral-500">View site ↗</Link>
        </nav>
        <form action={signOutAction}>
          <button className="text-sm font-semibold">Sign out</button>
        </form>
      </header>
      <main className="max-w-3xl mx-auto p-6">{children}</main>
    </div>
  );
}
