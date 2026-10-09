"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(_prevState: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  const { data: isAdmin, error: accessError } = await supabase.rpc("is_portfolio_admin");
  if (accessError || !isAdmin) {
    await supabase.auth.signOut();
    return { error: "This account has not been granted portfolio admin access." };
  }
  redirect("/admin");
}
