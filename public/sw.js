// Service Worker — Noteup
// Usa periodSync + armazenamento para disparar notificações mesmo com aba fechada

const DB_NAME = 'noteup-notifs';
const STORE = 'agendados';

// ─── IndexedDB helpers ───────────────────────────────────────────
function abrirDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

async function salvarNotif(notif) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(notif);
    tx.oncomplete = resolve;
    tx.onerror    = e => reject(e.target.error);
  });
}

async function removerNotif(id) {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror    = e => reject(e.target.error);
  });
}

async function listarNotifs() {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

// ─── Verificar e disparar notificações pendentes ─────────────────
async function verificarEDisparar() {
  const agora = Date.now();
  const pendentes = await listarNotifs();

  for (const notif of pendentes) {
    if (notif.timestamp <= agora) {
      await self.registration.showNotification(notif.titulo, {
        body:              notif.corpo,
        icon:              '/favicon.ico',
        badge:             '/favicon.ico',
        tag:               notif.id,
        requireInteraction: true,
        data:              { id: notif.id },
      });
      await removerNotif(notif.id);
    }
  }
}

// ─── Eventos do SW ───────────────────────────────────────────────
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()));

// Recebe mensagens do app
self.addEventListener('message', async (event) => {
  const { tipo, id, titulo, corpo, timestamp } = event.data;

  if (tipo === 'AGENDAR') {
    await salvarNotif({ id, titulo, corpo, timestamp });
    // Agenda verificação local para quando a aba ainda está aberta
    const delay = timestamp - Date.now();
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      setTimeout(verificarEDisparar, delay + 500);
    }
  }

  if (tipo === 'CANCELAR') {
    await removerNotif(id);
    const ns = await self.registration.getNotifications({ tag: id });
    ns.forEach(n => n.close());
  }

  if (tipo === 'VERIFICAR') {
    await verificarEDisparar();
  }
});

// Dispara quando o browser "acorda" o SW (push vazio ou sync)
self.addEventListener('push', () => verificarEDisparar());
self.addEventListener('sync', () => verificarEDisparar());

// Clique na notificação — abre o lembrete
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const id  = event.notification.data?.id;
  const url = id ? `/lembrete/${id}` : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const c of clients) {
        if ('focus' in c) { c.focus(); c.navigate(url); return; }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
