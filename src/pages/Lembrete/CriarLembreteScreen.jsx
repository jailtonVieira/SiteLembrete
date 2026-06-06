import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useLembretes } from '../../context/LembretesContext';
import { useListas } from '../../context/ListasContext';
import { ListaIcone } from '../../components/Icons';

const prioridades = [
  { label: 'Alta',  cor: 'var(--danger)' },
  { label: 'Média', cor: 'var(--warn)' },
  { label: 'Baixa', cor: 'var(--ok)' },
];

export default function CriarLembreteScreen() {
  const navigate = useNavigate();
  const { adicionar } = useLembretes();
  const { listas } = useListas();
  const hoje = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    titulo: '', notas: '', data: hoje, hora: '',
    prioridade: 'Média', lista: listas[0]?.nome || '',
    url: '', antecipacao: '15 min antes', repeticao: 'Nunca',
  });
  const [erro, setErro] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function salvar() {
    if (!form.titulo.trim()) { setErro('O título é obrigatório'); return; }
    adicionar(form);
    navigate('/');
  }

  const listaAtual = listas.find(l => l.nome === form.lista);

  return (
    <Layout titulo="Novo lembrete">
      {/* Ocupa toda a largura disponível, duas colunas em telas grandes */}
      <div style={{ width: '100%' }}>
        {erro && <div className="form-error">⚠️ {erro}</div>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
          width: '100%',
        }}>
          {/* COLUNA ESQUERDA */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Título *</label>
              <input
                className="form-input"
                placeholder="Ex: Reunião com o grupo..."
                value={form.titulo}
                onChange={e => set('titulo', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notas</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Detalhes adicionais..."
                value={form.notas}
                onChange={e => set('notas', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Data</label>
                <input className="form-input" type="date" value={form.data} onChange={e => set('data', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Hora</label>
                <input className="form-input" type="time" value={form.hora} onChange={e => set('hora', e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">URL (opcional)</label>
              <input
                className="form-input"
                placeholder="https://..."
                value={form.url}
                onChange={e => set('url', e.target.value)}
              />
            </div>
          </div>

          {/* COLUNA DIREITA */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Prioridade</label>
              <div className="pill-group">
                {prioridades.map(p => (
                  <button
                    key={p.label}
                    className={`pill-btn ${form.prioridade === p.label ? 'active' : ''}`}
                    style={form.prioridade === p.label ? { borderColor: p.cor, color: p.cor, background: p.cor + '15' } : {}}
                    onClick={() => set('prioridade', p.label)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Lista</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 7 }}>
                {listas.map(l => (
                  <button
                    key={l.id}
                    onClick={() => set('lista', l.nome)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 10,
                      border: `1.5px solid ${form.lista === l.nome ? l.cor : 'var(--border)'}`,
                      background: form.lista === l.nome ? l.cor + '15' : 'var(--surface2)',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <ListaIcone id={l.icone} size={15} color={form.lista === l.nome ? l.cor : 'var(--text3)'} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: form.lista === l.nome ? l.cor : 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.nome}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notificação</label>
              <select className="form-input" value={form.antecipacao} onChange={e => set('antecipacao', e.target.value)}>
                <option>15 min antes</option>
                <option>30 min antes</option>
                <option>1 hora antes</option>
                <option>No horário</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Repetição</label>
              <select className="form-input" value={form.repeticao} onChange={e => set('repeticao', e.target.value)}>
                <option>Nunca</option>
                <option>Diário</option>
                <option>Semanal</option>
                <option>Mensal</option>
              </select>
              {form.repeticao !== 'Nunca' && (
                <span style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4, display: 'block', fontWeight: 600 }}>
                  🔁 Um novo lembrete será criado automaticamente após você concluir este.
                </span>
              )}
            </div>

            {/* Preview */}
            {form.titulo && (
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: 'var(--accent-soft)',
                border: '1.5px solid var(--accent)',
              }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>Preview</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{form.titulo}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {form.data && <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600 }}>📅 {form.data.split('-').reverse().join('/')}</span>}
                  {form.hora && <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600 }}>🕐 {form.hora}</span>}
                  {listaAtual && (
                    <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 20, background: listaAtual.cor + '20', color: listaAtual.cor, fontWeight: 700 }}>
                      {listaAtual.nome}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={salvar}>
                Salvar lembrete
              </button>
              <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
