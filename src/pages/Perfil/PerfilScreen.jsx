import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { IconUser, IconMail, IconLock, IconLogOut, IconCamera } from '../../components/Icons';

export default function PerfilScreen() {
  const navigate = useNavigate();
  const { usuario, logout, atualizarNome, atualizarFoto, alterarSenha } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [salvo, setSalvo] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(usuario?.foto || null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const inputFotoRef = useRef(null);

  const iniciais = nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  function salvar() {
    if (!nome.trim()) return;
    setErroSenha('');

    // Tenta alterar senha se preencheu os campos
    if (senhaAtual || novaSenha) {
      if (!senhaAtual) { setErroSenha('Informe a senha atual'); return; }
      if (!novaSenha)  { setErroSenha('Informe a nova senha'); return; }
      if (novaSenha.length < 6) { setErroSenha('Nova senha deve ter pelo menos 6 caracteres'); return; }
      try {
        alterarSenha(senhaAtual, novaSenha);
        setSenhaAtual('');
        setNovaSenha('');
      } catch (e) {
        setErroSenha(e.message);
        return;
      }
    }

    atualizarNome(nome.trim());
    if (fotoPreview !== usuario?.foto) atualizarFoto(fotoPreview);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  function sair() { logout(); navigate('/login'); }

  function onFotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setFotoPreview(base64);
      atualizarFoto(base64); // persiste imediatamente no localStorage
    };
    reader.readAsDataURL(file);
  }

  function removerFoto() {
    setFotoPreview(null);
    atualizarFoto(null);
    if (inputFotoRef.current) inputFotoRef.current.value = '';
  }

  const inputIcon = (icon, type, val, onChange, readOnly, placeholder) => (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', display: 'flex' }}>{icon}</span>
      <input
        className="form-input" type={type} value={val}
        onChange={onChange} readOnly={readOnly} placeholder={placeholder}
        style={{ paddingLeft: 38, opacity: readOnly ? 0.6 : 1 }}
      />
    </div>
  );

  return (
    <Layout titulo="Perfil">
      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

        {/* CARD — FOTO E IDENTIDADE */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          {/* Avatar com botão de câmera */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt="Foto de perfil"
                style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)' }}
              />
            ) : (
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: '#fff',
                border: '3px solid var(--border)',
              }}>{iniciais}</div>
            )}

            {/* Botão câmera */}
            <button
              onClick={() => inputFotoRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--accent)', border: '2px solid var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'filter 0.15s',
              }}
              title="Alterar foto"
            >
              <IconCamera size={13} color="#fff" />
            </button>

            {/* Input oculto */}
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onFotoChange}
            />
          </div>

          {/* Nome e email */}
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
              {usuario?.nome}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{usuario?.email}</div>
          </div>

          {/* Ações da foto */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
              onClick={() => inputFotoRef.current?.click()}
            >
              <IconCamera size={13} />
              {fotoPreview ? 'Trocar foto' : 'Adicionar foto'}
            </button>
            {fotoPreview && (
              <button className="btn-excluir btn-sm" style={{ fontSize: 11, padding: '5px 10px' }} onClick={removerFoto}>
                Remover
              </button>
            )}
          </div>

          <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>
            Foto salva localmente no dispositivo.
          </div>
        </div>

        {/* CARD — DADOS */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Nome</label>
            {inputIcon(<IconUser size={16} />, 'text', nome, e => setNome(e.target.value), false, 'Seu nome')}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            {inputIcon(<IconMail size={16} />, 'email', usuario?.email || '', () => {}, true)}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Senha atual</label>
            {inputIcon(<IconLock size={16} />, 'password', senhaAtual, e => setSenhaAtual(e.target.value), false, '••••••••')}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Nova senha</label>
            {inputIcon(<IconLock size={16} />, 'password', novaSenha, e => setNovaSenha(e.target.value), false, '••••••••')}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={salvar}>
              Salvar alterações
            </button>
            <button className="btn btn-danger" onClick={sair} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconLogOut size={14} /> Sair
            </button>
          </div>

          {salvo && <div className="form-success">✅ Perfil atualizado!</div>}
          {erroSenha && <div className="form-error">{erroSenha}</div>}
        </div>

      </div>
    </Layout>
  );
}
