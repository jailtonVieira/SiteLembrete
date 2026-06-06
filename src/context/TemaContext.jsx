import { createContext, useState, useContext, useEffect } from 'react';

const TemaContext = createContext();

export function TemaProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      const salvo = localStorage.getItem('tema_v1');
      if (salvo !== null) return JSON.parse(salvo);
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('tema_v1', JSON.stringify(dark));
  }, [dark]);

  return (
    <TemaContext.Provider value={{ dark, toggle: () => setDark(p => !p) }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() { return useContext(TemaContext); }
