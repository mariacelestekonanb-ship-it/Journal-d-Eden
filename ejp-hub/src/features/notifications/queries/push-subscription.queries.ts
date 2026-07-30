import { createClient } from "@/shared/lib/supabase/client";

/**
 * Requêtes Supabase brutes des abonnements Web Push — client navigateur,
 * soumises à la RLS (chacun ne gère que ses propres abonnements).
 */
export async function savePushSubscriptionQuery(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" },
  );
  if (error) throw new Error(error.message);
}

export async function deletePushSubscriptionQuery(endpoint: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) throw new Error(error.message);
}
