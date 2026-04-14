import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="brand">Moto Social</Link>
        <nav>
          <NavLink to="/eventos">Eventos</NavLink>
          <NavLink to="/bandas">Bandas</NavLink>
          {user && <NavLink to="/novo-evento">Novo Evento</NavLink>}
          {user && <NavLink to="/perfil">Perfil</NavLink>}
          {user && <NavLink to="/meus-eventos">Meus Eventos</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div>
          {user ? <button onClick={logout}>Sair</button> : <Link to="/login">Entrar</Link>}
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
