// ─────────────────────────────────────────────────────────────
// Layout.jsx — Estrutura principal do app
// Envolve todas as telas autenticadas com:
//   • Sidebar recolhível (desktop)
//   • Bottom navigation (mobile/tablet)
//   • Cabeçalho da página
//
// Responsividade:
//   • > 768px → sidebar lateral fixa
//   • ≤ 768px → sidebar some, aparece barra de nav inferior
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTema } from '../context/TemaContext';
import { useLembretes } from '../context/LembretesContext';
import {
  IconHome, IconList, IconSearch, IconTrash,
  IconPlus, IconUser, IconMoon, IconSun,
  IconChevronLeft, IconChevronRight, IconLogOut
} from './Icons';

// Itens de navegação principal
const NAV = [
  { path: '/',        label: 'Início',  Icon: IconHome },
  { path: '/listas',  label: 'Listas',  Icon: IconList },
  { path: '/busca',   label: 'Buscar',  Icon: IconSearch },
  { path: '/lixeira', label: 'Lixeira', Icon: IconTrash },
];

export default function Layout({ children, titulo }) {
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const { usuario, logout } = useAuth();
  const { dark, toggle }    = useTema();
  const { lixeira }         = useLembretes();

  // Estado de abertura da sidebar (só afeta desktop)
  const [aberta, setAberta] = useState(true);

  // Detecta se a tela é mobile (≤ 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Atualiza isMobile ao redimensionar a janela
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle); // Cleanup
  }, []);

  // Iniciais do usuário para o avatar (ex: "João Oliveira" → "JO")
  const iniciais = (usuario?.nome || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Largura da sidebar — 220px aberta, 64px recolhida, 0 no mobile
  const larguraSidebar = isMobile ? 0 : aberta ? 220 : 64;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ══════════════════════════════════════════════
          SIDEBAR — só visível em desktop (> 768px)
          ══════════════════════════════════════════════ */}
      {!isMobile && (
        <aside style={{
          width: larguraSidebar,
          flexShrink: 0,
          background: 'var(--sidebar-bg)',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          transition: 'width 0.25s ease',
          zIndex: 200,
        }}>

          {/* Cabeçalho da sidebar: logo + botão recolher */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: aberta ? 'space-between' : 'center',
            padding: aberta ? '1.1rem 1rem 1rem 1.25rem' : '1.1rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            {aberta && (
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 17, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  Note<span style={{ color: 'var(--sidebar-accent)' }}>up</span>
                </div>
              </div>
            )}
            {/* Botão de recolher/expandir sidebar */}
            <button
              onClick={() => setAberta(p => !p)}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none',
                borderRadius: 8, width: 28, height: 28, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
              }}
              title={aberta ? 'Fechar sidebar' : 'Abrir sidebar'}
            >
              {aberta ? <IconChevronLeft size={15} /> : <IconChevronRight size={15} />}
            </button>
          </div>

          {/* Itens de navegação */}
          <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto', overflowX: 'hidden' }}>
            {aberta && (
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,0.3)', padding: '6px 1.25rem 4px', fontWeight: 700 }}>
                Menu
              </div>
            )}

            {NAV.map(({ path, label, Icon }) => {
              const ativo     = pathname === path;
              const isLixeira = path === '/lixeira';
              return (
                <div
                  key={path}
                  onClick={() => navigate(path)}
                  title={!aberta ? label : ''}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: aberta ? 10 : 0,
                    justifyContent: aberta ? 'flex-start' : 'center',
                    padding: aberta ? '9px 1.25rem' : '11px 0',
                    fontSize: 13, fontWeight: 600,
                    color: ativo ? '#fff' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${ativo ? 'var(--sidebar-accent)' : 'transparent'}`,
                    background: ativo ? 'rgba(108,99,255,0.12)' : 'transparent',
                    transition: 'all 0.15s', whiteSpace: 'nowrap', position: 'relative',
                  }}
                >
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <Icon size={17} color={ativo ? 'var(--sidebar-accent)' : 'currentColor'} />
                  </span>
                  {aberta && (
                    <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {label}
                      {/* Badge de contagem na lixeira */}
                      {isLixeira && lixeira.length > 0 && (
                        <span style={{ background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 20, padding: '1px 6px', marginLeft: 6 }}>
                          {lixeira.length}
                        </span>
                      )}
                    </span>
                  )}
                  {/* Ponto vermelho quando sidebar recolhida e há itens na lixeira */}
                  {!aberta && isLixeira && lixeira.length > 0 && (
                    <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)' }} />
                  )}
                </div>
              );
            })}

            {/* Item: Criar lembrete */}
            <div
              onClick={() => navigate('/criar')}
              title={!aberta ? 'Criar lembrete' : ''}
              style={{
                display: 'flex', alignItems: 'center',
                gap: aberta ? 10 : 0,
                justifyContent: aberta ? 'flex-start' : 'center',
                padding: aberta ? '9px 1.25rem' : '11px 0',
                fontSize: 13, fontWeight: 600,
                color: pathname === '/criar' ? '#fff' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                borderLeft: `3px solid ${pathname === '/criar' ? 'var(--sidebar-accent)' : 'transparent'}`,
                background: pathname === '/criar' ? 'rgba(108,99,255,0.12)' : 'transparent',
                transition: 'all 0.15s', marginTop: 2, whiteSpace: 'nowrap',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <IconPlus size={17} color={pathname === '/criar' ? 'var(--sidebar-accent)' : 'currentColor'} />
              </span>
              {aberta && 'Criar lembrete'}
            </div>

            {aberta
              ? <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,0.3)', padding: '14px 1.25rem 4px', fontWeight: 700 }}>Conta</div>
              : <div style={{ height: 10 }} />
            }

            {/* Item: Perfil */}
            <div
              onClick={() => navigate('/perfil')}
              title={!aberta ? 'Perfil' : ''}
              style={{
                display: 'flex', alignItems: 'center',
                gap: aberta ? 10 : 0,
                justifyContent: aberta ? 'flex-start' : 'center',
                padding: aberta ? '9px 1.25rem' : '11px 0',
                fontSize: 13, fontWeight: 600,
                color: pathname === '/perfil' ? '#fff' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
                borderLeft: `3px solid ${pathname === '/perfil' ? 'var(--sidebar-accent)' : 'transparent'}`,
                background: pathname === '/perfil' ? 'rgba(108,99,255,0.12)' : 'transparent',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <IconUser size={17} color={pathname === '/perfil' ? 'var(--sidebar-accent)' : 'currentColor'} />
              </span>
              {aberta && 'Perfil'}
            </div>
          </nav>

          {/* Rodapé: toggle de tema + usuário */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: aberta ? '0.75rem 1rem' : '0.75rem 0',
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 8,
            alignItems: aberta ? 'stretch' : 'center',
          }}>
            {/* Toggle dark/light */}
            <div
              onClick={toggle}
              title={dark ? 'Mudar para Light' : 'Mudar para Dark'}
              style={{ display: 'flex', alignItems: 'center', gap: aberta ? 8 : 0, justifyContent: aberta ? 'flex-start' : 'center', cursor: 'pointer', padding: '6px 4px', borderRadius: 8 }}
            >
              <div style={{ width: 30, height: 17, borderRadius: 20, flexShrink: 0, background: dark ? 'rgba(124,116,255,0.4)' : 'rgba(255,255,255,0.15)', border: `1px solid ${dark ? 'rgba(124,116,255,0.5)' : 'rgba(255,255,255,0.2)'}`, position: 'relative' }}>
                <div style={{ width: 11, height: 11, borderRadius: '50%', background: dark ? 'var(--sidebar-accent)' : 'rgba(255,255,255,0.5)', position: 'absolute', top: 2, left: dark ? 16 : 2, transition: 'left 0.25s' }} />
              </div>
              {aberta && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {dark ? <IconMoon size={13} /> : <IconSun size={13} />}
                  {dark ? 'Dark' : 'Light'}
                </span>
              )}
            </div>

            {/* Card do usuário */}
            {aberta ? (
              <div
                onClick={() => navigate('/perfil')}
                style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}
              >
                {usuario?.foto
                  ? <img src={usuario.foto} alt="Foto" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, objectFit: 'cover', border: '2px solid var(--sidebar-accent)' }} />
                  : <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{iniciais}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#fff', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usuario?.nome || 'Usuário'}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Conta pessoal</div>
                </div>
                <IconLogOut size={14} color="rgba(255,255,255,0.3)" />
              </div>
            ) : (
              usuario?.foto
                ? <img src={usuario.foto} alt="Foto" onClick={() => navigate('/perfil')} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid var(--sidebar-accent)' }} />
                : <div onClick={() => navigate('/perfil')} style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>{iniciais}</div>
            )}
          </div>
        </aside>
      )}

      {/* ══════════════════════════════════════════════
          CONTEÚDO PRINCIPAL
          marginLeft acompanha a largura da sidebar
          No mobile: marginLeft = 0, paddingBottom para
          não ficar atrás da bottom nav
          ══════════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        marginLeft: larguraSidebar,
        display: 'flex', flexDirection: 'column',
        minWidth: 0,
        transition: 'margin-left 0.25s ease',
        paddingBottom: isMobile ? 72 : 0, // Espaço para a bottom nav no mobile
      }}>
        {/* Topbar mobile: logo + botão perfil */}
        {isMobile && (
          <div style={{
            background: 'var(--sidebar-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            position: 'sticky', top: 0, zIndex: 100,
          }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Note<span style={{ color: 'var(--sidebar-accent)' }}>up</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Toggle tema no mobile */}
              <button
                onClick={toggle}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 20, padding: '5px 10px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {dark ? <IconMoon size={13} /> : <IconSun size={13} />}
              </button>
              {/* Avatar do usuário */}
              {usuario?.foto
                ? <img src={usuario.foto} alt="Foto" onClick={() => navigate('/perfil')} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer', border: '2px solid var(--sidebar-accent)' }} />
                : <div onClick={() => navigate('/perfil')} style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', cursor: 'pointer' }}>{iniciais}</div>
              }
            </div>
          </div>
        )}

        {/* Cabeçalho da página com título e botão "Novo lembrete" */}
        <div className="page-header">
          <h1 className="page-title">{titulo}</h1>
          <button className="btn btn-primary" onClick={() => navigate('/criar')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <IconPlus size={15} color="#fff" />
            {/* No mobile oculta o texto, só mostra o ícone + */}
            <span className="btn-novo-label">Novo lembrete</span>
          </button>
        </div>

        {/* Conteúdo da tela atual */}
        <div className="page-body">{children}</div>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM NAVIGATION — só no mobile (≤ 768px)
          Barra fixa na parte inferior com ícones de nav
          ══════════════════════════════════════════════ */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--sidebar-bg)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'stretch',
          height: 64, zIndex: 300,
          paddingBottom: 'env(safe-area-inset-bottom)', // Suporte ao notch do iPhone
        }}>
          {/* Itens da bottom nav */}
          {NAV.map(({ path, label, Icon }) => {
            const ativo     = pathname === path;
            const isLixeira = path === '/lixeira';
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 3, border: 'none', background: 'transparent',
                  cursor: 'pointer', position: 'relative',
                  color: ativo ? 'var(--sidebar-accent)' : 'rgba(255,255,255,0.4)',
                }}
              >
                {/* Badge da lixeira na bottom nav */}
                {isLixeira && lixeira.length > 0 && (
                  <span style={{
                    position: 'absolute', top: 8, right: '28%',
                    background: 'var(--danger)', color: '#fff',
                    fontSize: 8, fontWeight: 800,
                    borderRadius: 20, padding: '1px 4px', minWidth: 14, textAlign: 'center',
                  }}>
                    {lixeira.length}
                  </span>
                )}
                <Icon size={20} color={ativo ? 'var(--sidebar-accent)' : 'rgba(255,255,255,0.4)'} />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
                {/* Indicador de ativo (ponto) */}
                {ativo && <span style={{ position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: '50%', background: 'var(--sidebar-accent)' }} />}
              </button>
            );
          })}

          {/* Botão central de criar lembrete em destaque */}
          <button
            onClick={() => navigate('/criar')}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, border: 'none', background: 'transparent', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(108,99,255,0.5)',
            }}>
              <IconPlus size={20} color="#fff" />
            </div>
          </button>
        </nav>
      )}
    </div>
  );
}
