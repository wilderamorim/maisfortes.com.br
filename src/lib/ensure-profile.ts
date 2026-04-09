import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Ensures the user has a row in public.users.
 * Handles cases where the trigger didn't fire (e.g., email confirmation disabled).
 */
export async function ensureProfile(supabase: SupabaseClient, user: User) {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .single();

  if (existing) return;

  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "";

  await supabase.from("users").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      name,
    },
    { onConflict: "id" }
  );
}
