import { useNavigate } from 'react-router-dom';
import { useTema } from '../../context/TemaContext';

export default function NotFoundScreen() {
  const navigate = useNavigate();
  const { dark } = useTema();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Ilustração animada */}
      <div className="nf-illustration">
        <div className="nf-circle">
          <span className="nf-emoji">🔍</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 380 }}>
        <div style={{
          fontFamily: 'var(--font-head)',
          fontSize: 96,
          fontWeight: 800,
          color: 'var(--accent)',
          lineHeight: 1,
          letterSpacing: '-4px',
          opacity: 0.15,
          userSelect: 'none',
        }}>
          404
        </div>

        <div style={{
          fontFamily: 'var(--font-head)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text)',
          marginTop: -16,
          marginBottom: 8,
        }}>
          Página não encontrada
        </div>

        <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
          Parece que essa página sumiu da lista de lembretes.
          Talvez esteja na lixeira? 😄
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            style={{ minWidth: 140 }}
          >
            Ir para o Início
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
            style={{ minWidth: 140 }}
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
