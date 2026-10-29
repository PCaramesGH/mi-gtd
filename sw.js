
self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: 'Mi GTD',
      body: event.data ? event.data.text() : 'Tienes un recordatorio.'
    };
  }

  const title = data.title || 'Mi GTD · Recordatorio';

  const options = {
    body: data.body || 'Tienes una tarea pendiente.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    data: {
      url: data.url || './',
      taskId: data.taskId || null
    },
    tag: data.taskId || 'mi-gtd-recordatorio',
    renotify: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || './',
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin)) {
          return client.navigate(targetUrl).then(() => client.focus());
        }
      }

      return clients.openWindow(targetUrl);
    })
  );
});
