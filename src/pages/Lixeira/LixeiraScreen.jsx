import { useState } from 'react';
import Layout from '../../components/Layout';
import ConfirmModal from '../../components/ConfirmModal';
import { useLembretes } from '../../context/LembretesContext';
import { IconTrash } from '../../components/Icons';

function IconRestore({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
    </svg>
  );
}

export default function LixeiraScreen() {
  const { lixeira, restaurar, excluirDefinitivo, esvaziar } = useLembretes();
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [confirmandoEsvaziar, setConfirmandoEsvaziar] = useState(false);

  const itemConfirmando = lixeira.find(l => l.id === confirmandoId);

  return (
    <Layout titulo="Lixeira">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>
          {lixeira.length} {lixeira.length === 1 ? 'item' : 'itens'} na lixeira
        </span>
        {lixeira.length > 0 && (
          <button
            className="btn btn-danger btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            onClick={() => setConfirmandoEsvaziar(true)}
          >
            <IconTrash size={13} /> Esvaziar lixeira
          </button>
        )}
      </div>

      {lixeira.length === 0 ? (
        <div className="empty-state">
          <div style={{ marginBottom: 10, opacity: 0.4 }}>
            <IconTrash size={40} color="var(--text3)" />
          </div>
          <p>Lixeira vazia!</p>
        </div>
      ) : (
        lixeira.map(l => (
          <div key={l.id} className="lx-card">
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'var(--danger-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <IconTrash size={17} color="var(--danger)" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="lx-title">{l.titulo}</div>
              <div className="lx-sub">
                Excluído em {l.excluidoEm}
                {l.prioridade && <> · <span style={{ color: 'var(--text2)' }}>{l.prioridade}</span></>}
                {l.lista && <> · <span style={{ color: 'var(--accent)' }}>{l.lista}</span></>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button
                className="btn btn-success btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={() => restaurar(l.id)}
              >
                <IconRestore size={12} /> Restaurar
              </button>
              <button
                className="btn-excluir"
                style={{ padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}
                onClick={() => setConfirmandoId(l.id)}
              >
                <IconTrash size={13} /> Excluir
              </button>
            </div>
          </div>
        ))
      )}

      {/* Confirmação excluir item */}
      {confirmandoId && itemConfirmando && (
        <ConfirmModal
          titulo="Excluir permanentemente?"
          mensagem={`"${itemConfirmando.titulo}" será excluído para sempre. Esta ação não pode ser desfeita.`}
          onConfirm={() => { excluirDefinitivo(confirmandoId); setConfirmandoId(null); }}
          onCancel={() => setConfirmandoId(null)}
        />
      )}

      {/* Confirmação esvaziar */}
      {confirmandoEsvaziar && (
        <ConfirmModal
          titulo="Esvaziar lixeira?"
          mensagem={`Todos os ${lixeira.length} itens serão excluídos permanentemente. Esta ação não pode ser desfeita.`}
          onConfirm={() => { esvaziar(); setConfirmandoEsvaziar(false); }}
          onCancel={() => setConfirmandoEsvaziar(false)}
        />
      )}
    </Layout>
  );
}
