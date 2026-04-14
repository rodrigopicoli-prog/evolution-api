import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiFetch('/events').then(setEvents).catch(console.error);
  }, []);

  return (
    <section>
      <h2>Eventos</h2>
      <div className="list">
        {events.map((event) => (
          <article key={event.id} className="card">
            <h3>{event.title}</h3>
            <p>{event.city}/{event.state}</p>
            <p>Status: {event.status}</p>
            <Link to={`/eventos/${event.id}`}>Detalhes</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
