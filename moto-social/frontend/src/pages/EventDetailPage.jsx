import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

export function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/events/${id}`).then(setEvent).catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!event) return <p>Carregando...</p>;

  return (
    <section>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>{event.place_name} - {event.city}/{event.state}</p>
      <p>Categoria: {event.category || 'Geral'}</p>
      <p>Status: {event.status}</p>
    </section>
  );
}
