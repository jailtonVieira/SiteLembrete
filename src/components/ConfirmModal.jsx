import { IconTrash, IconCheck } from './Icons';

export default function ConfirmModal({ titulo, mensagem, onConfirm, onCancel, tipo = 'excluir' }) {
  const isExcluir = tipo !== 'concluir';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: isExcluir ? 'var(--danger-soft)' : 'var(--ok-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          {isExcluir
            ? <IconTrash size={22} color="var(--danger)" />
            : <IconCheck size={22} color="var(--ok)" />
          }
        </div>

        <div className="modal-title" style={{ marginBottom: 6 }}>{titulo}</div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
          {mensagem}
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onCancel}>
            Cancelar
          </button>
          <button
            className="btn"
            style={{
              flex: 1, justifyContent: 'center',
              background: isExcluir ? 'var(--danger)' : 'var(--ok)',
              color: '#fff',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onClick={onConfirm}
          >
            {isExcluir
              ? <><IconTrash size={14} color="#fff" /> Excluir</>
              : <><IconCheck size={14} color="#fff" /> Confirmar</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
