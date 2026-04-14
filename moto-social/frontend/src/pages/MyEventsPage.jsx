import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export function MyEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiFetch('/events/mine').then(setEvents).catch(console.error);
  }, []);

  return (
    <section>
      <h2>Meus eventos</h2>
      <div className="list">
        {events.map((event) => (
          <article key={event.id} className="card">
            <h3>{event.title}</h3>
            <p>Status: {event.status}</p>
            <Link to={`/eventos/${event.id}`}>Abrir</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
