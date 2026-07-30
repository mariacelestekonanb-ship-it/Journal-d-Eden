// Service Worker — reçoit les notifications Web Push et gère le clic dessus.
// Fichier volontairement en JS brut (pas de build) : servi tel quel depuis /public,
// chargé à la racine du domaine pour couvrir toute l'application (scope "/").

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "EJP Hub", message: event.data.text() };
  }

  const title = payload.title || "EJP Hub";
  const options = {
    body: payload.message || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { actionUrl: payload.actionUrl || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const actionUrl = event.notification.data?.actionUrl || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(actionUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(actionUrl);
    }),
  );
});
