import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconUser, IconMail, IconLock } from '../../components/Icons';

export default function CadastroScreen() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function registrar() {
    setErro('');
    if (!form.nome || !form.email || !form.senha) { setErro('Preencha todos os campos'); return; }
    if (form.senha !== form.confirmar) { setErro('As senhas não coincidem'); return; }
    if (form.senha.length < 6) { setErro('Senha deve ter pelo menos 6 caracteres'); return; }
    setLoading(true);
    try { await cadastrar(form.nome, form.email, form.senha); navigate('/'); }
    catch (e) { setErro(e.message); }
    finally { setLoading(false); }
  }

  const inputIcon = (icon, placeholder, type, val, onChange) => (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', display: 'flex' }}>{icon}</span>
      <input className="form-input" type={type} placeholder={placeholder} value={val} onChange={onChange} style={{ paddingLeft: 38 }} />
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, background: 'var(--accent-soft)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconUser size={28} color="var(--accent)" />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="auth-title">Criar conta</div>
          <div className="auth-sub">Comece a organizar seus lembretes</div>
        </div>

        {erro && <div className="form-error">{erro}</div>}

        <div className="form-group">
          <label className="form-label">Nome completo</label>
          {inputIcon(<IconUser size={16} />, 'Seu nome', 'text', form.nome, e => set('nome', e.target.value))}
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          {inputIcon(<IconMail size={16} />, 'seu@email.com', 'email', form.email, e => set('email', e.target.value))}
        </div>
        <div className="form-group">
          <label className="form-label">Senha</label>
          {inputIcon(<IconLock size={16} />, 'Mínimo 6 caracteres', 'password', form.senha, e => set('senha', e.target.value))}
        </div>
        <div className="form-group">
          <label className="form-label">Confirmar senha</label>
          {inputIcon(<IconLock size={16} />, '••••••••', 'password', form.confirmar, e => set('confirmar', e.target.value))}
        </div>

        <button className="btn btn-primary btn-full" onClick={registrar} disabled={loading} style={{ opacity: loading ? 0.7 : 1, marginTop: 4 }}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <div className="auth-or">ou</div>
        <button className="btn btn-ghost btn-full" onClick={() => navigate('/login')}>Já tenho conta</button>
      </div>
    </div>
  );
}
