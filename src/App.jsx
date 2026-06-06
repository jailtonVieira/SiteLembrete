import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TemaProvider } from './context/TemaContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LembretesProvider } from './context/LembretesContext';
import { ListasProvider } from './context/ListasContext';

import LoginScreen from './pages/Auth/LoginScreen';
import CadastroScreen from './pages/Auth/CadastroScreen';
import HomeScreen from './pages/Home/HomeScreen';
import CriarLembreteScreen from './pages/Lembrete/CriarLembreteScreen';
import DetalhesLembreteScreen from './pages/Lembrete/DetalhesLembreteScreen';
import ListasScreen from './pages/Listas/ListasScreen';
import BuscaScreen from './pages/Busca/BuscaScreen';
import LixeiraScreen from './pages/Lixeira/LixeiraScreen';
import PerfilScreen from './pages/Perfil/PerfilScreen';
import NotFoundScreen from './pages/NotFound/NotFoundScreen';

function Rotas() {
  const { usuario } = useAuth();
  if (!usuario) return (
    <Routes>
      <Route path="/login"    element={<LoginScreen />} />
      <Route path="/cadastro" element={<CadastroScreen />} />
      <Route path="*"         element={<Navigate to="/login" replace />} />
    </Routes>
  );
  return (
    <Routes>
      <Route path="/"             element={<HomeScreen />} />
      <Route path="/criar"        element={<CriarLembreteScreen />} />
      <Route path="/lembrete/:id" element={<DetalhesLembreteScreen />} />
      <Route path="/listas"       element={<ListasScreen />} />
      <Route path="/busca"        element={<BuscaScreen />} />
      <Route path="/lixeira"      element={<LixeiraScreen />} />
      <Route path="/perfil"       element={<PerfilScreen />} />
      <Route path="*"             element={<NotFoundScreen />} />
    </Routes>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <ListasProvider>
          <LembretesProvider>
            <BrowserRouter>
              <Rotas />
            </BrowserRouter>
          </LembretesProvider>
        </ListasProvider>
      </AuthProvider>
    </TemaProvider>
  );
}
