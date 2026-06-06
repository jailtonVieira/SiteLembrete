import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import LembreteCard from '../../components/LembreteCard';
import ConfirmModal from '../../components/ConfirmModal';
import { useLembretes } from '../../context/LembretesContext';
import { IconCheck, IconTrash } from '../../components/Icons';

function IconDots({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="5"  cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  );
}

function IconCircleCheck({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { lembretes, lembretesHoje, programados, concluidos, concluir, excluir, lembretesOrdenados } = useLembretes();
  const hoje = new Date().toISOString().split('T')[0];

  const todosHoje      = lembretesOrdenados.filter(l => l.data === hoje);
  const programadosOrd = lembretesOrdenados.filter(l => l.data > hoje && !l.concluido);
  const concluidosOrd  = lembretesOrdenados.filter(l => l.concluido);

  // Estado de seleção múltipla
  const [modoSelecao, setModoSelecao]   = useState(false);
  const [selecionados, setSelecionados] = useState([]);
  const [menuAberto, setMenuAberto]     = useState(false);
  const [confirmando, setConfirmando]   = useState(null); // 'concluir' | 'excluir'
  const menuRef = useRef(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAberto(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function entrarModoSelecao() {
    setModoSelecao(true);
    setSelecionados([]);
    setMenuAberto(false);
  }

  function sairModoSelecao() {
    setModoSelecao(false);
    setSelecionados([]);
  }

  function toggleSelecao(id) {
    setSelecionados(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  function selecionarTodos() {
    const todos = lembretesOrdenados.map(l => l.id);
    setSelecionados(p => p.length === todos.length ? [] : todos);
  }

  function confirmarConcluir() {
    selecionados.forEach(id => concluir(id));
    sairModoSelecao();
    setConfirmando(null);
  }

  function confirmarExcluir() {
    selecionados.forEach(id => excluir(id));
    sairModoSelecao();
    setConfirmando(null);
  }

  const todosSelecionados = selecionados.length === lembretesOrdenados.length && lembretesOrdenados.length > 0;

  function renderCard(l) {
    if (modoSelecao) {
      const sel = selecionados.includes(l.id);
      const atrasado = l.data < hoje && !l.concluido;
      const dataLabel = l.data === hoje ? 'Hoje' : l.data?.split('-').reverse().join('/');
      return (
        <div
          key={l.id}
          className={`lem-card ${l.concluido ? 'done' : ''}`}
          style={{
            borderColor: sel ? 'var(--accent)' : atrasado ? 'var(--danger)' : undefined,
            background: sel ? 'var(--accent-soft)' : undefined,
            cursor: 'pointer',
          }}
          onClick={() => toggleSelecao(l.id)}
        >
          {/* Checkbox de seleção */}
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
            border: `2px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
            background: sel ? 'var(--accent)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
            {sel && <IconCheck size={10} color="#fff" />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="lem-title">{l.titulo}</div>
            <div className="lem-meta">
              <span className="meta-item">📅 {dataLabel}</span>
              {l.hora && <span className="meta-item">🕐 {l.hora}</span>}
              <span className={`badge badge-${l.prioridade === 'Alta' ? 'alta' : l.prioridade === 'Média' ? 'media' : 'baixa'}`}>{l.prioridade}</span>
              {l.lista && <span className="badge badge-lista">{l.lista}</span>}
            </div>
          </div>
        </div>
      );
    }
    return <LembreteCard key={l.id} lembrete={l} />;
  }

  return (
    <Layout titulo="Início">

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card c1">
          <div className="dot" style={{ background: 'var(--accent)' }} />
          <div className="num">{lembretesHoje.length}</div>
          <div className="lbl">Hoje</div>
        </div>
        <div className="stat-card c2">
          <div className="dot" style={{ background: 'var(--warn)' }} />
          <div className="num">{programados.length}</div>
          <div className="lbl">Programados</div>
        </div>
        <div className="stat-card c3">
          <div className="dot" style={{ background: 'var(--ok)' }} />
          <div className="num">{concluidos.length}</div>
          <div className="lbl">Concluídos</div>
        </div>
        <div className="stat-card c4">
          <div className="dot" style={{ background: 'var(--text3)' }} />
          <div className="num">{lembretes.length}</div>
          <div className="lbl">Todos</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 12, gap: 8 }}>
        {modoSelecao ? (
          <>
            <button
              onClick={selecionarTodos}
              style={{
                fontSize: 12, fontWeight: 700, color: 'var(--accent)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              {todosSelecionados ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
            <button
              onClick={sairModoSelecao}
              style={{
                fontSize: 12, fontWeight: 700, color: 'var(--text2)',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          /* Botão "..." */
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuAberto(p => !p)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--surface)', border: '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text2)',
                boxShadow: 'var(--shadow)', transition: 'all 0.15s',
              }}
              title="Opções"
            >
              <IconDots size={17} color="var(--text2)" />
            </button>

            {/* Dropdown menu */}
            {menuAberto && (
              <div style={{
                position: 'absolute', right: 0, top: 44,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, boxShadow: 'var(--shadow-md)',
                minWidth: 210, zIndex: 100, overflow: 'hidden',
              }}>
                <button
                  onClick={entrarModoSelecao}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 16px', background: 'transparent', border: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--text)',
                    transition: 'background 0.15s', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <IconCircleCheck size={17} color="var(--accent)" />
                  Selecionar lembretes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lembretes */}
      <div className="sec-div">Hoje</div>
      {todosHoje.length === 0
        ? <div className="empty-state"><div className="emoji">🎉</div><p>Nenhum lembrete para hoje!</p></div>
        : todosHoje.map(l => renderCard(l))
      }

      {programadosOrd.length > 0 && (
        <>
          <div className="sec-div" style={{ marginTop: 20 }}>Programados</div>
          {programadosOrd.map(l => renderCard(l))}
        </>
      )}

      {concluidosOrd.length > 0 && (
        <>
          <div className="sec-div" style={{ marginTop: 20 }}>Concluídos</div>
          {concluidosOrd.map(l => renderCard(l))}
        </>
      )}

      {/* Barra inferior de ações — aparece no modo seleção */}
      {modoSelecao && (
        <div style={{
          position: 'fixed', bottom: window.innerWidth <= 768 ? 64 : 0, left: window.innerWidth <= 768 ? 0 : 210, right: 0,
          background: 'var(--surface)', borderTop: '1px solid var(--border)',
          padding: '12px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', zIndex: 150,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.12)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)' }}>
            {selecionados.length} selecionado(s)
          </span>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--ok-soft)', color: 'var(--ok)',
                border: '1.5px solid var(--ok)', opacity: selecionados.length === 0 ? 0.4 : 1,
                cursor: selecionados.length === 0 ? 'not-allowed' : 'pointer',
              }}
              disabled={selecionados.length === 0}
              onClick={() => setConfirmando('concluir')}
            >
              <IconCircleCheck size={15} color="var(--ok)" />
              Concluir
            </button>
            <button
              className="btn-excluir"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', fontSize: 13, fontWeight: 700,
                opacity: selecionados.length === 0 ? 0.4 : 1,
                cursor: selecionados.length === 0 ? 'not-allowed' : 'pointer',
              }}
              disabled={selecionados.length === 0}
              onClick={() => setConfirmando('excluir')}
            >
              <IconTrash size={14} /> Lixeira
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmar concluir */}
      {confirmando === 'concluir' && (
        <ConfirmModal
          tipo="concluir"
          titulo="Concluir selecionados?"
          mensagem={`${selecionados.length} lembrete(s) serão marcados como concluídos.`}
          onConfirm={confirmarConcluir}
          onCancel={() => setConfirmando(null)}
        />
      )}

      {/* Modal confirmar excluir */}
      {confirmando === 'excluir' && (
        <ConfirmModal
          tipo="excluir"
          titulo="Mover para lixeira?"
          mensagem={`${selecionados.length} lembrete(s) serão movidos para a lixeira.`}
          onConfirm={confirmarExcluir}
          onCancel={() => setConfirmando(null)}
        />
      )}
    </Layout>
  );
}
