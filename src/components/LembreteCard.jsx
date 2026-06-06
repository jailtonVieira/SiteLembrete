import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLembretes } from '../context/LembretesContext';
import { IconCalendar, IconClock, IconTrash, IconCheck, IconAlertDot } from './Icons';
import ConfirmModal from './ConfirmModal';

const badgeClass = { Alta: 'badge badge-alta', Média: 'badge badge-media', Baixa: 'badge badge-baixa' };

export default function LembreteCard({ lembrete }) {
  const navigate = useNavigate();
  const { concluir, excluir } = useLembretes();
  const [confirmando, setConfirmando] = useState(false);
  const [animando, setAnimando] = useState(false);

  const hoje = new Date().toISOString().split('T')[0];
  const dataLabel = lembrete.data === hoje ? 'Hoje' : lembrete.data?.split('-').reverse().join('/');
  const atrasado = lembrete.data < hoje && !lembrete.concluido;

  function handleConcluir(e) {
    e.stopPropagation();
    if (!lembrete.concluido) {
      setAnimando(true);
      setTimeout(() => {
        concluir(lembrete.id);
        setAnimando(false);
      }, 420);
    } else {
      concluir(lembrete.id);
    }
  }

  return (
    <>
      <div
        className={`lem-card ${lembrete.concluido ? 'done' : ''} ${animando ? 'concluindo' : ''}`}
        style={{ borderColor: atrasado ? 'var(--danger)' : undefined }}
        onClick={() => navigate(`/lembrete/${lembrete.id}`)}
      >
        <div
          className={`check ${lembrete.concluido ? 'on' : ''} ${animando ? 'check-pop' : ''}`}
          onClick={handleConcluir}
        >
          {(lembrete.concluido || animando) && <IconCheck size={9} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={`lem-title ${animando ? 'title-riscando' : ''}`}>{lembrete.titulo}</div>
          <div className="lem-meta">
            <span className="meta-item"><IconCalendar size={12} /> {dataLabel}</span>
            {lembrete.hora && <span className="meta-item"><IconClock size={12} /> {lembrete.hora}</span>}
            <span className={badgeClass[lembrete.prioridade] || 'badge'}>{lembrete.prioridade}</span>
            {lembrete.lista && <span className="badge badge-lista">{lembrete.lista}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {atrasado && <IconAlertDot />}
          <button
            className="btn-excluir"
            onClick={e => { e.stopPropagation(); setConfirmando(true); }}
            title="Mover para lixeira"
          >
            <IconTrash size={14} />
          </button>
        </div>
      </div>

      {confirmando && (
        <ConfirmModal
          titulo="Excluir lembrete?"
          mensagem={`"${lembrete.titulo}" será movido para a lixeira. Você pode restaurá-lo depois.`}
          onConfirm={() => { excluir(lembrete.id); setConfirmando(false); }}
          onCancel={() => setConfirmando(false)}
        />
      )}
    </>
  );
}
