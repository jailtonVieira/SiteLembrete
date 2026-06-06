import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

function carregarLS(chave, fallback) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => carregarLS('usuario_v1', null));

  useEffect(() => {
    if (usuario) localStorage.setItem('usuario_v1', JSON.stringify(usuario));
    else localStorage.removeItem('usuario_v1');
  }, [usuario]);

  async function login(email, senha) {
    if (!email || !senha) throw new Error('Preencha email e senha');
    // Simula autenticação local — substitua por API quando tiver back end
    const usuarios = carregarLS('usuarios_cadastrados', []);
    const encontrado = usuarios.find(u => u.email === email);
    if (!encontrado) throw new Error('Email não cadastrado');
    const senhaCorreta = encontrado.senha === senha;
    if (!senhaCorreta) throw new Error('Senha incorreta');
    setUsuario({ id: encontrado.id, email: encontrado.email, nome: encontrado.nome, foto: encontrado.foto || null });
  }

  async function cadastrar(nome, email, senha) {
    if (!nome || !email || !senha) throw new Error('Preencha todos os campos');
    const usuarios = carregarLS('usuarios_cadastrados', []);
    if (usuarios.find(u => u.email === email)) throw new Error('Email já cadastrado');
    const novoUsuario = { id: Date.now().toString(), nome, email, senha, foto: null };
    localStorage.setItem('usuarios_cadastrados', JSON.stringify([...usuarios, novoUsuario]));
    setUsuario({ id: novoUsuario.id, email, nome, foto: null });
  }

  function atualizarNome(nome) {
    setUsuario(p => {
      const atualizado = { ...p, nome };
      const usuarios = carregarLS('usuarios_cadastrados', []);
      const atualizados = usuarios.map(u => u.id === p.id ? { ...u, nome } : u);
      localStorage.setItem('usuarios_cadastrados', JSON.stringify(atualizados));
      return atualizado;
    });
  }

  function atualizarFoto(foto) {
    setUsuario(p => {
      const atualizado = { ...p, foto };
      // Persiste a foto no cadastro do usuário
      const usuarios = carregarLS('usuarios_cadastrados', []);
      const atualizados = usuarios.map(u => u.id === p.id ? { ...u, foto } : u);
      localStorage.setItem('usuarios_cadastrados', JSON.stringify(atualizados));
      return atualizado;
    });
  }

  function alterarSenha(senhaAtual, novaSenha) {
    const usuarios = carregarLS('usuarios_cadastrados', []);
    const encontrado = usuarios.find(u => u.id === usuario?.id);
    if (!encontrado) throw new Error('Usuário não encontrado');
    if (encontrado.senha !== senhaAtual) throw new Error('Senha atual incorreta');
    const atualizados = usuarios.map(u => u.id === usuario.id ? { ...u, senha: novaSenha } : u);
    localStorage.setItem('usuarios_cadastrados', JSON.stringify(atualizados));
  }

  function logout() {
    setUsuario(null);
    // Limpa dados da sessão mas mantém cadastros
    localStorage.removeItem('usuario_v1');
    localStorage.removeItem('lembretes_v1');
    localStorage.removeItem('lixeira_v1');
    localStorage.removeItem('listas_v1');
    localStorage.removeItem('ordenacao_v1');
  }

  return (
    <AuthContext.Provider value={{ usuario, login, cadastrar, logout, atualizarNome, atualizarFoto, alterarSenha }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
