import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import ConfirmModal from '../../components/ConfirmModal';
import { useLembretes } from '../../context/LembretesContext';
import { useListas } from '../../context/ListasContext';
import { IconEdit, IconTrash, IconCalendar, IconClock, IconCheck } from '../../components/Icons';
import { ListaIcone } from '../../components/Icons';

const bdgClass = { Alta: 'badge badge-alta', Média: 'badge badge-media', Baixa: 'badge badge-baixa' };
const prioridades = ['Alta', 'Média', 'Baixa'];

export default function DetalhesLembreteScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lembretes, editar, excluir, concluir } = useLembretes();
  const { listas } = useListas();

  const lembrete = lembretes.find(l => l.id === id);

  // form sincronizado com o lembrete do contexto
  const [form, setForm] = useState(lembrete || {});
  const [editando, setEditando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  // Sempre que o lembrete mudar no contexto, atualiza o form
  useEffect(() => {
    if (lembrete) setForm(lembrete);
  }, [lembrete]);

  // Rota não encontrada — tela amigável
  if (!lembrete) {
    return (
      <Layout titulo="Lembrete não encontrado">
        <div className="card" style={{ maxWidth: 420, textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>
            <IconTrash size={40} color="var(--text3)" />
          </div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            Lembrete não encontrado
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>
            Ele pode ter sido excluído ou movido para a lixeira.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Voltar para o início
          </button>
        </div>
      </Layout>
    );
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const hoje = new Date().toISOString().split('T')[0];
  const dataLabel = lembrete.data === hoje ? 'Hoje' : lembrete.data?.split('-').reverse().join('/');
  const listaAtual = listas.find(l => l.nome === lembrete.lista);

  function salvar() {
    if (!form.titulo?.trim()) return;
    editar(id, form);
    setEditando(false);
  }

  function confirmarExclusao() {
    excluir(id);
    navigate('/');
  }

  return (
    <Layout titulo="Detalhes">
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 20,
        alignItems: 'start',
      }}>

        {/* CARD PRINCIPAL — visualização ou edição */}
        <div className="card">
          {!editando ? (
            <>
              {/* Badges */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className={bdgClass[lembrete.prioridade] || 'badge'}>{lembrete.prioridade}</span>
                {listaAtual && (
                  <span className="badge badge-lista" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ListaIcone id={listaAtual.icone} size={11} color="var(--accent)" />
                    {listaAtual.nome}
                  </span>
                )}
                {lembrete.concluido && (
                  <span className="badge" style={{ background: 'var(--ok-soft)', color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IconCheck size={9} color="var(--ok)" /> Concluído
                  </span>
                )}
              </div>

              {/* Título */}
              <h2 style={{
                fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700,
                color: 'var(--text)', marginBottom: 10, lineHeight: 1.3,
                textDecoration: lembrete.concluido ? 'line-through' : 'none',
              }}>
                {lembrete.titulo}
              </h2>

              {/* Notas */}
              {lembrete.notas && (
                <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {lembrete.notas}
                </p>
              )}

              {/* Data e hora */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <IconCalendar size={13} /> {dataLabel}
                </span>
                {lembrete.hora && (
                  <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconClock size={13} /> {lembrete.hora}
                  </span>
                )}
              </div>

              {/* URL */}
              {lembrete.url && (
                <a
                  href={lembrete.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, display: 'block', marginBottom: 20, wordBreak: 'break-all' }}
                >
                  🔗 {lembrete.url}
                </a>
              )}

              {/* Ações */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                <button
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => setEditando(true)}
                >
                  <IconEdit size={14} /> Editar
                </button>
                <button
                  className="btn"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: lembrete.concluido ? 'var(--surface2)' : 'var(--ok-soft)',
                    color: lembrete.concluido ? 'var(--text2)' : 'var(--ok)',
                    border: `1.5px solid ${lembrete.concluido ? 'var(--border)' : 'var(--ok)'}`,
                  }}
                  onClick={() => concluir(id)}
                >
                  <IconCheck size={12} color={lembrete.concluido ? 'var(--text2)' : 'var(--ok)'} />
                  {lembrete.concluido ? 'Desfazer' : 'Concluir'}
                </button>
                <button
                  className="btn-excluir"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 13, fontWeight: 700 }}
                  onClick={() => setConfirmando(true)}
                >
                  <IconTrash size={14} /> Excluir
                </button>
                <button className="btn btn-ghost" onClick={() => navigate(-1)}>Voltar</button>
              </div>
            </>
          ) : (
            /* MODO EDIÇÃO */
            <>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
                Editando lembrete
              </div>

              <div className="form-group">
                <label className="form-label">Título</label>
                <input className="form-input" value={form.titulo || ''} onChange={e => set('titulo', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Notas</label>
                <textarea className="form-input" rows={3} value={form.notas || ''} onChange={e => set('notas', e.target.value)} />
              </div>

              <div className="form-row form-group">
                <div>
                  <label className="form-label">Data</label>
                  <input className="form-input" type="date" value={form.data || ''} onChange={e => set('data', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Hora</label>
                  <input className="form-input" type="time" value={form.hora || ''} onChange={e => set('hora', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Prioridade</label>
                <div className="pill-group">
                  {prioridades.map(p => (
                    <button
                      key={p}
                      className={`pill-btn ${form.prioridade === p ? 'active' : ''}`}
                      onClick={() => set('prioridade', p)}
                    >{p}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Lista</label>
                <select className="form-input" value={form.lista || ''} onChange={e => set('lista', e.target.value)}>
                  {listas.map(l => <option key={l.id} value={l.nome}>{l.nome}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notificação</label>
                <select className="form-input" value={form.antecipacao || '15 min antes'} onChange={e => set('antecipacao', e.target.value)}>
                  <option>15 min antes</option>
                  <option>30 min antes</option>
                  <option>1 hora antes</option>
                  <option>No horário</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Repetição</label>
                <select className="form-input" value={form.repeticao || 'Nunca'} onChange={e => set('repeticao', e.target.value)}>
                  <option>Nunca</option>
                  <option>Diário</option>
                  <option>Semanal</option>
                  <option>Mensal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">URL (opcional)</label>
                <input className="form-input" value={form.url || ''} onChange={e => set('url', e.target.value)} placeholder="https://..." />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={salvar}>Salvar alterações</button>
                <button className="btn btn-ghost" onClick={() => { setForm(lembrete); setEditando(false); }}>Cancelar</button>
              </div>
            </>
          )}
        </div>

        {/* CARD LATERAL — resumo */}
        {!editando && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 13, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Resumo
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Prioridade</div>
                <span className={bdgClass[lembrete.prioridade] || 'badge'}>{lembrete.prioridade}</span>
              </div>

              {listaAtual && (
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Lista</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: listaAtual.cor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ListaIcone id={listaAtual.icone} size={15} color={listaAtual.cor} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{listaAtual.nome}</span>
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Data</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <IconCalendar size={13} /> {dataLabel}
                </span>
              </div>

              {lembrete.hora && (
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Hora</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconClock size={13} /> {lembrete.hora}
                  </span>
                </div>
              )}

              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Status</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: lembrete.concluido ? 'var(--ok)' : 'var(--warn)' }}>
                  {lembrete.concluido ? '✓ Concluído' : '⏳ Pendente'}
                </span>
              </div>

              {lembrete.repeticao && lembrete.repeticao !== 'Nunca' && (
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Repetição</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    🔁 {lembrete.repeticao}
                  </span>
                </div>
              )}

              {lembrete.antecipacao && (
                <div>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text3)', fontWeight: 700, marginBottom: 4 }}>Notificação</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    🔔 {lembrete.antecipacao}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirmando && (
        <ConfirmModal
          titulo="Excluir lembrete?"
          mensagem={`"${lembrete.titulo}" será movido para a lixeira. Você pode restaurá-lo depois.`}
          onConfirm={confirmarExclusao}
          onCancel={() => setConfirmando(false)}
        />
      )}
    </Layout>
  );
}
