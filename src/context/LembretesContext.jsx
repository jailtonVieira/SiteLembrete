import { createContext, useState, useContext, useEffect } from 'react';
import { registrarSW, agendarNotificacao, cancelarNotificacao } from '../hooks/useNotificacoes';

const LembretesContext = createContext();

const hoje = new Date().toISOString().split('T')[0];
const amanha = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const seed = [
  { id: '1', titulo: 'Reunião com grupo', notas: 'Discutir divisão de tarefas', data: hoje, hora: '10:00', prioridade: 'Alta', lista: 'Trabalho', url: '', antecipacao: '15 min antes', repeticao: 'Nunca', concluido: false },
  { id: '2', titulo: 'Ligar para família', notas: '', data: hoje, hora: '20:00', prioridade: 'Baixa', lista: 'Pessoal', url: '', antecipacao: '15 min antes', repeticao: 'Nunca', concluido: false },
  { id: '3', titulo: 'Entregar projeto da faculdade', notas: 'Prazo final!', data: '2026-06-08', hora: '23:59', prioridade: 'Alta', lista: 'Estudos', url: '', antecipacao: '1 hora antes', repeticao: 'Nunca', concluido: false },
  { id: '4', titulo: 'Academia', notas: '', data: amanha, hora: '07:00', prioridade: 'Baixa', lista: 'Saúde', url: '', antecipacao: '30 min antes', repeticao: 'Diário', concluido: false },
  { id: '5', titulo: 'Reunião com equipe', notas: '', data: hoje, hora: '09:00', prioridade: 'Alta', lista: 'Trabalho', url: '', antecipacao: '15 min antes', repeticao: 'Nunca', concluido: true },
  { id: '6', titulo: 'Estudar React Hooks', notas: 'useEffect e useCallback', data: hoje, hora: '14:00', prioridade: 'Média', lista: 'Estudos', url: '', antecipacao: '15 min antes', repeticao: 'Nunca', concluido: true },
];

const PRIORIDADE_ORDEM = { Alta: 0, Média: 1, Baixa: 2 };

function proximaData(dataStr, repeticao) {
  const data = new Date(dataStr + 'T00:00:00');
  switch (repeticao) {
    case 'Diário':  data.setDate(data.getDate() + 1); break;
    case 'Semanal': data.setDate(data.getDate() + 7); break;
    case 'Mensal':  data.setMonth(data.getMonth() + 1); break;
    default: return null;
  }
  return data.toISOString().split('T')[0];
}

function carregarLS(chave, fallback) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function ordenarLembretes(lista, criterio) {
  const copia = [...lista];
  switch (criterio) {
    case 'data':
      return copia.sort((a, b) => {
        const d = (a.data || '').localeCompare(b.data || '');
        return d !== 0 ? d : (a.hora || '').localeCompare(b.hora || '');
      });
    case 'prioridade':
      return copia.sort((a, b) =>
        (PRIORIDADE_ORDEM[a.prioridade] ?? 3) - (PRIORIDADE_ORDEM[b.prioridade] ?? 3)
      );
    default:
      return copia;
  }
}

export function LembretesProvider({ children }) {
  const [lembretes, setLembretes] = useState(() => carregarLS('lembretes_v1', seed));
  const [lixeira,   setLixeira]   = useState(() => carregarLS('lixeira_v1', [
    { id: 'l1', titulo: 'Comprar mantimentos', prioridade: 'Média', lista: 'Pessoal', excluidoEm: '2026-05-29' },
    { id: 'l2', titulo: 'Revisão do TCC',      prioridade: 'Alta',  lista: 'Estudos', excluidoEm: '2026-05-26' },
  ]));
  const [ordenacao, setOrdenacao] = useState(() => carregarLS('ordenacao_v1', 'criacao'));

  useEffect(() => { localStorage.setItem('lembretes_v1', JSON.stringify(lembretes)); }, [lembretes]);
  useEffect(() => { localStorage.setItem('lixeira_v1',   JSON.stringify(lixeira)); },   [lixeira]);
  useEffect(() => { localStorage.setItem('ordenacao_v1', JSON.stringify(ordenacao)); }, [ordenacao]);
  useEffect(() => { registrarSW(); }, []);

  function adicionar(l) {
    const novo = { ...l, id: Date.now().toString(), concluido: false };
    setLembretes(p => [novo, ...p]);
    agendarNotificacao(novo);
  }

  function editar(id, d) {
    setLembretes(p => p.map(l => {
      if (l.id !== id) return l;
      const atualizado = { ...l, ...d };
      cancelarNotificacao(id);
      agendarNotificacao(atualizado);
      return atualizado;
    }));
  }

  function concluir(id) {
    setLembretes(p => p.map(l => {
      if (l.id !== id) return l;
      const concluido = !l.concluido;
      if (concluido && l.repeticao && l.repeticao !== 'Nunca') {
        const novaData = proximaData(l.data, l.repeticao);
        if (novaData) {
          const novoId = Date.now().toString() + '_rep';
          const proximo = { ...l, id: novoId, data: novaData, concluido: false };
          setTimeout(() => {
            setLembretes(prev => {
              if (prev.find(x => x.id === novoId)) return prev;
              agendarNotificacao(proximo);
              return [proximo, ...prev];
            });
          }, 0);
        }
      }
      return { ...l, concluido };
    }));
  }

  function concluirTodos() {
    setLembretes(p => p.map(l => ({ ...l, concluido: true })));
  }

  function excluir(id) {
    const item = lembretes.find(l => l.id === id);
    if (!item) return;
    cancelarNotificacao(id);
    setLixeira(p => [{ ...item, excluidoEm: hoje }, ...p]);
    setLembretes(p => p.filter(l => l.id !== id));
  }

  function restaurar(id) {
    const item = lixeira.find(l => l.id === id);
    if (!item) return;
    const { excluidoEm, ...resto } = item;
    const restaurado = { ...resto, concluido: false };
    setLembretes(p => [restaurado, ...p]);
    setLixeira(p => p.filter(l => l.id !== id));
    agendarNotificacao(restaurado);
  }

  function excluirDefinitivo(id) { setLixeira(p => p.filter(l => l.id !== id)); }

  function esvaziar() { setLixeira([]); }

  const lembretesHoje     = lembretes.filter(l => l.data === hoje && !l.concluido);
  const programados       = lembretes.filter(l => l.data > hoje   && !l.concluido);
  const concluidos        = lembretes.filter(l => l.concluido);
  const lembretesOrdenados = ordenarLembretes(lembretes, ordenacao);

  return (
    <LembretesContext.Provider value={{
      lembretes, lembretesOrdenados, lixeira,
      ordenacao, setOrdenacao,
      adicionar, editar, concluir, concluirTodos, excluir,
      restaurar, excluirDefinitivo, esvaziar,
      lembretesHoje, programados, concluidos,
    }}>
      {children}
    </LembretesContext.Provider>
  );
}

export function useLembretes() { return useContext(LembretesContext); }
