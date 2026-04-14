import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <section>
      <h2>Meu Perfil</h2>
      <p>Nome: {user?.name}</p>
      <p>E-mail: {user?.email}</p>
      <p>Perfil: {user?.profileType || user?.profile_type}</p>
      <p>Cidade: {user?.city || '-'}</p>
      <p>Estado: {user?.state || '-'}</p>
    </section>
  );
}
