export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("YOUR-PROJECT") || key === "your-anon-public-key") return null;
  try {
    if (!["https:", "http:"].includes(new URL(url).protocol)) return null;
  } catch { return null; }
  return { url, key };
}

export function requireSupabaseConfig() {
  const config = getSupabaseConfig();
  if (!config) throw new Error("Supabase is not configured. Add your project URL and public key to .env.local, then restart the server.");
  return config;
}
