import { useState } from 'react';
import Layout from '../../components/Layout';
import LembreteCard from '../../components/LembreteCard';
import { useLembretes } from '../../context/LembretesContext';
import { IconSearch } from '../../components/Icons';

const FILTROS = ['Todos', 'Alta', 'Média', 'Baixa'];

export default function BuscaScreen() {
  const { lembretes } = useLembretes();
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const res = lembretes.filter(l => {
    const ok = query.length < 2 || l.titulo.toLowerCase().includes(query.toLowerCase()) || (l.notas || '').toLowerCase().includes(query.toLowerCase());
    const pOk = filtro === 'Todos' || l.prioridade === filtro;
    return ok && pOk;
  });

  return (
    <Layout titulo="Buscar">
      <div className="search-box">
        <IconSearch size={17} color="var(--text3)" />
        <input
          placeholder="Buscar lembretes... (mín. 2 caracteres)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      <div className="tab-bar">
        {FILTROS.map(f => (
          <button key={f} className={`tab-item ${filtro === f ? 'active' : ''}`} onClick={() => setFiltro(f)}>{f}</button>
        ))}
      </div>

      <div className="sec-div">{res.length} resultado(s)</div>

      {res.length === 0
        ? <div className="empty-state"><div className="emoji" style={{ fontSize: 36, marginBottom: 10 }}><IconSearch size={36} color="var(--text3)" /></div><p>Nenhum resultado encontrado</p></div>
        : res.map(l => <LembreteCard key={l.id} lembrete={l} />)
      }
    </Layout>
  );
}
