// Hook de notificações — Noteup
let _swReg = null;
let _verificadorInterval = null;

export async function registrarSW() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    _swReg = await navigator.serviceWorker.register('/sw.js');

    // Aguarda o SW ficar ativo
    await navigator.serviceWorker.ready;

    // Inicia verificador a cada 30 segundos enquanto o site está aberto
    // Isso garante que notificações disparem mesmo sem fechar a aba
    if (!_verificadorInterval) {
      _verificadorInterval = setInterval(() => {
        enviarMensagemSW({ tipo: 'VERIFICAR' });
      }, 30_000);
    }

    return _swReg;
  } catch (e) {
    console.warn('SW não registrado:', e);
    return null;
  }
}

async function enviarMensagemSW(msg) {
  try {
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage(msg);
  } catch (e) {
    console.warn('Erro ao enviar msg ao SW:', e);
  }
}

export async function pedirPermissao() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function calcularTimestamp(data, hora, antecipacao) {
  if (!data || !hora) return null;

  const [ano, mes, dia] = data.split('-').map(Number);
  const [h, m]          = hora.split(':').map(Number);
  const dataHora        = new Date(ano, mes - 1, dia, h, m, 0);

  const minutos = {
    '15 min antes': 15,
    '30 min antes': 30,
    '1 hora antes': 60,
    'No horário':    0,
  }[antecipacao] ?? 15;

  return dataHora.getTime() - minutos * 60 * 1000;
}

export async function agendarNotificacao(lembrete) {
  if (!('serviceWorker' in navigator)) return;

  const permitido = await pedirPermissao();
  if (!permitido) return;

  const timestamp = calcularTimestamp(lembrete.data, lembrete.hora, lembrete.antecipacao);
  if (!timestamp || timestamp <= Date.now()) return;

  const anteLabel = lembrete.antecipacao === 'No horário'
    ? 'Agora é a hora!'
    : `Lembrete em ${lembrete.antecipacao}`;

  await enviarMensagemSW({
    tipo:      'AGENDAR',
    id:        lembrete.id,
    titulo:    `🔔 ${lembrete.titulo}`,
    corpo:     `${anteLabel} — ${lembrete.data?.split('-').reverse().join('/')} às ${lembrete.hora}`,
    timestamp,
  });
}

export async function cancelarNotificacao(id) {
  if (!('serviceWorker' in navigator)) return;
  await enviarMensagemSW({ tipo: 'CANCELAR', id });
}
