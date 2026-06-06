import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTema } from '../../context/TemaContext';
import { IconBell, IconMail, IconLock, IconMoon, IconSun } from '../../components/Icons';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { dark, toggle } = useTema();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setErro('');
    setLoading(true);
    try { await login(email, senha); navigate('/'); }
    catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="auth-page">
      {/* Toggle tema */}
      <div style={{ position: 'fixed', top: 18, right: 22, display: 'flex', alignItems: 'center', gap: 7 }}>
        <button
          onClick={toggle}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 12px', cursor: 'pointer', color: 'var(--text2)', fontSize: 12, fontWeight: 600 }}
        >
          {dark ? <IconMoon size={13} /> : <IconSun size={13} />}
          {dark ? 'Dark' : 'Light'}
        </button>
      </div>

      <div className="auth-box">
        {/* Ícone centralizado */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, background: 'var(--accent-soft)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBell size={28} color="var(--accent)" />
          </div>
        </div>

        {/* Título centralizado */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="auth-title">Note<span style={{ color: 'var(--accent)' }}>up</span></div>
          <div className="auth-sub">Faça login para continuar</div>
        </div>

        {erro && <div className="form-error">{erro}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', display: 'flex' }}>
              <IconMail size={16} />
            </span>
            <input
              className="form-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && entrar()}
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Senha</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', display: 'flex' }}>
              <IconLock size={16} />
            </span>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && entrar()}
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={entrar} disabled={loading} style={{ opacity: loading ? 0.7 : 1, marginTop: 4 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="auth-or">ou</div>
        <button className="btn btn-ghost btn-full" onClick={() => navigate('/cadastro')}>
          Criar conta gratuita
        </button>
      </div>
    </div>
  );
}
