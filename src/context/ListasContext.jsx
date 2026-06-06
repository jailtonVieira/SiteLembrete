import { createContext, useState, useContext, useEffect } from 'react';

const ListasContext = createContext();

const LISTAS_SEED = [
  { id: '1', nome: 'Trabalho', cor: '#6c63ff', icone: 'briefcase' },
  { id: '2', nome: 'Pessoal',  cor: '#ff6584', icone: 'user' },
  { id: '3', nome: 'Estudos',  cor: '#f59e0b', icone: 'book' },
  { id: '4', nome: 'Saúde',    cor: '#22c55e', icone: 'heart' },
];

function carregarLS(chave, fallback) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function ListasProvider({ children }) {
  const [listas, setListas] = useState(() => carregarLS('listas_v1', LISTAS_SEED));

  useEffect(() => { localStorage.setItem('listas_v1', JSON.stringify(listas)); }, [listas]);

  const adicionar = (l) => setListas(p => [...p, { ...l, id: Date.now().toString() }]);
  const editar    = (id, d) => setListas(p => p.map(l => l.id === id ? { ...l, ...d } : l));
  const excluir   = (id) => setListas(p => p.filter(l => l.id !== id));

  return (
    <ListasContext.Provider value={{ listas, adicionar, editar, excluir }}>
      {children}
    </ListasContext.Provider>
  );
}

export function useListas() { return useContext(ListasContext); }
