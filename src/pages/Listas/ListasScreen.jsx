import { useState } from 'react';
import Layout from '../../components/Layout';
import LembreteCard from '../../components/LembreteCard';
import { useListas } from '../../context/ListasContext';
import { useLembretes } from '../../context/LembretesContext';
import { IconPlus, IconTrash, IconChevronLeft, LISTA_ICONES, ListaIcone } from '../../components/Icons';

export default function ListasScreen() {
  const { listas, adicionar, excluir } = useListas();
  const { lembretes } = useLembretes();
  const [modal, setModal]       = useState(false);
  const [nova, setNova]         = useState({ nome: '', cor: '#6c63ff', icone: 'briefcase' });
  const [categoriaSel, setCategoriaSel] = useState(null);

  const getLembretesDaLista = (nome) => lembretes.filter(l => l.lista === nome);
  const count = (nome) => getLembretesDaLista(nome).length;

  function criar() {
    if (!nova.nome.trim()) return;
    adicionar(nova);
    setNova({ nome: '', cor: '#6c63ff', icone: 'briefcase' });
    setModal(false);
  }

  // ── Tela de detalhe da categoria ───────────────────────────────────────────
  if (categoriaSel) {
    const lista = listas.find(l => l.id === categoriaSel);
    if (!lista) { setCategoriaSel(null); return null; }
    const itens = getLembretesDaLista(lista.nome);
    const pendentes  = itens.filter(l => !l.concluido);
    const concluidos = itens.filter(l =>  l.concluido);

    return (
      <Layout titulo={lista.nome}>
        <button
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}
          onClick={() => setCategoriaSel(null)}
        >
          <IconChevronLeft size={15} /> Voltar para Listas
        </button>

        {/* Cabeçalho da categoria */}
        <div className="cat-header" style={{ borderColor: lista.cor }}>
          <div className="lista-icon" style={{ background: lista.cor + '20', width: 44, height: 44 }}>
            <ListaIcone id={lista.icone} size={22} color={lista.cor} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{lista.nome}</div>
            <div style={{ color: 'var(--text3)', fontSize: 13 }}>{itens.length} lembrete{itens.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {itens.length === 0 && (
          <div className="empty-state">
            <div className="emoji">📭</div>
            <p>Nenhum lembrete nesta lista</p>
          </div>
        )}

        {pendentes.length > 0 && (
          <>
            <div className="sec-div">Pendentes</div>
            {pendentes.map(l => <LembreteCard key={l.id} lembrete={l} />)}
          </>
        )}

        {concluidos.length > 0 && (
          <>
            <div className="sec-div" style={{ marginTop: 16 }}>Concluídos</div>
            {concluidos.map(l => <LembreteCard key={l.id} lembrete={l} />)}
          </>
        )}
      </Layout>
    );
  }

  // ── Grid de listas ──────────────────────────────────────────────────────────
  return (
    <Layout titulo="Listas">
      <div className="lista-grid">
        {listas.map(l => {
          const total      = count(l.nome);
          const pendentes  = lembretes.filter(x => x.lista === l.nome && !x.concluido).length;
          const concluidos = total - pendentes;

          return (
            <div
              key={l.id}
              className="lista-card lista-card-clicavel"
              onClick={() => setCategoriaSel(l.id)}
              style={{ borderLeft: `3px solid ${l.cor}` }}
            >
              <div className="lista-icon" style={{ background: l.cor + '20' }}>
                <ListaIcone id={l.icone} size={20} color={l.cor} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="lista-name">{l.nome}</div>
                <div className="lista-count">
                  {pendentes > 0 && <span style={{ color: l.cor }}>{pendentes} pendente{pendentes !== 1 ? 's' : ''}</span>}
                  {pendentes > 0 && concluidos > 0 && <span style={{ color: 'var(--text3)' }}> · </span>}
                  {concluidos > 0 && <span style={{ color: 'var(--ok)' }}>{concluidos} concluído{concluidos !== 1 ? 's' : ''}</span>}
                  {total === 0 && <span style={{ color: 'var(--text3)' }}>Sem lembretes</span>}
                </div>
              </div>

              {/* Barra de progresso */}
              {total > 0 && (
                <div className="lista-progress-bar">
                  <div
                    className="lista-progress-fill"
                    style={{ width: `${Math.round((concluidos / total) * 100)}%`, background: l.cor }}
                  />
                </div>
              )}

              <button
                className="btn-excluir"
                onClick={e => { e.stopPropagation(); excluir(l.id); }}
                title="Excluir lista"
              >
                <IconTrash size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="btn btn-ghost"
        style={{ marginTop: 12, width: '100%', borderStyle: 'dashed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        onClick={() => setModal(true)}
      >
        <IconPlus size={15} /> Nova lista
      </button>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nova lista</div>

            <div className="form-group">
              <label className="form-label">Nome</label>
              <input className="form-input" placeholder="Nome da lista..." value={nova.nome} onChange={e => setNova(p => ({ ...p, nome: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Ícone</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
                {LISTA_ICONES.map(({ id, label, Comp }) => (
                  <button
                    key={id}
                    title={label}
                    onClick={() => setNova(p => ({ ...p, icone: id }))}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 40, height: 40, borderRadius: 10,
                      border: `2px solid ${nova.icone === id ? nova.cor : 'var(--border)'}`,
                      background: nova.icone === id ? nova.cor + '18' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Comp size={18} color={nova.icone === id ? nova.cor : 'var(--text3)'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cor</label>
              <input
                type="color" value={nova.cor}
                onChange={e => setNova(p => ({ ...p, cor: e.target.value }))}
                style={{ height: 40, width: '100%', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={criar}>Criar</button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
