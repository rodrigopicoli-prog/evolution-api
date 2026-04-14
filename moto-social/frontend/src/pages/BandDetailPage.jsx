import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

export function BandDetailPage() {
  const { id } = useParams();
  const [band, setBand] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/bands/${id}`).then(setBand).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!band) return <p>Carregando...</p>;

  return (
    <section>
      <h2>{band.stage_name}</h2>
      <p>{band.description}</p>
      <p>{band.city}/{band.state}</p>
      <p>Instagram: {band.instagram || 'Não informado'}</p>
      <p>Status: {band.status}</p>
    </section>
  );
}
