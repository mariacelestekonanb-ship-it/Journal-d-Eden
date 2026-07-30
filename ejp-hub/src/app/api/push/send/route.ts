import { NextResponse, type NextRequest } from "next/server";
import webpush from "web-push";

import { createAdminClient } from "@/shared/lib/supabase/admin";

/**
 * Appelée par un Database Webhook Supabase (table `notifications`, événement
 * INSERT — voir NOTIFICATIONS.md#push pour la configuration côté Supabase).
 * Chaque notification déjà créée en base (par les triggers de
 * `20260806090001_notification_triggers.sql`) déclenche l'envoi d'une
 * notification Web Push à tous les appareils abonnés de son destinataire.
 *
 * Protégée par un secret partagé (`PUSH_WEBHOOK_SECRET`) plutôt que par
 * l'authentification Supabase habituelle : l'appelant est Supabase lui-même,
 * pas un utilisateur connecté.
 */

interface NotificationRecord {
  id: string;
  user_id: string;
  title: string;
  message: string;
  action_url: string | null;
  priority: string;
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");
  if (!process.env.PUSH_WEBHOOK_SECRET || secret !== process.env.PUSH_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json({ error: "Clés VAPID non configurées." }, { status: 500 });
  }

  const body = (await request.json()) as { record?: NotificationRecord };
  const record = body.record;
  if (!record?.user_id) {
    return NextResponse.json({ error: "Notification invalide." }, { status: 400 });
  }

  webpush.setVapidDetails(
    process.env.PUSH_VAPID_SUBJECT || "mailto:notifications@example.com",
    vapidPublicKey,
    vapidPrivateKey,
  );

  const supabase = createAdminClient();
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", record.user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const payload = JSON.stringify({
    title: record.title,
    message: record.message,
    actionUrl: record.action_url,
  });

  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: { p256dh: subscription.p256dh, auth: subscription.auth },
        },
        payload,
      ),
    ),
  );

  const expiredIds = subscriptions
    .filter((_, index) => {
      const result = results[index];
      return (
        result?.status === "rejected" &&
        typeof result.reason === "object" &&
        result.reason !== null &&
        "statusCode" in result.reason &&
        (result.reason.statusCode === 404 || result.reason.statusCode === 410)
      );
    })
    .map((subscription) => subscription.id);

  if (expiredIds.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", expiredIds);
  }

  const sent = results.filter((result) => result.status === "fulfilled").length;
  return NextResponse.json({ sent, expired: expiredIds.length });
}
