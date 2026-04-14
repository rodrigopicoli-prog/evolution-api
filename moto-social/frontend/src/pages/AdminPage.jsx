import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export function AdminPage() {
  const [events, setEvents] = useState([]);
  const [bands, setBands] = useState([]);

  async function load() {
    const [eventsData, bandsData] = await Promise.all([apiFetch('/events'), apiFetch('/bands')]);
    setEvents(eventsData);
    setBands(bandsData);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function updateEventStatus(id, status) {
    await apiFetch(`/events/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    await load();
  }

  async function updateBandStatus(id, status) {
    await apiFetch(`/bands/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    await load();
  }

  return (
    <section>
      <h2>Painel Admin</h2>
      <h3>Eventos pendentes</h3>
      {events.filter((item) => item.status !== 'approved').map((event) => (
        <div key={event.id} className="card row">
          <span>{event.title} ({event.status})</span>
          <div>
            <button onClick={() => updateEventStatus(event.id, 'approved')}>Aprovar</button>
            <button onClick={() => updateEventStatus(event.id, 'hidden')}>Ocultar</button>
          </div>
        </div>
      ))}

      <h3>Bandas pendentes</h3>
      {bands.filter((item) => item.status !== 'approved').map((band) => (
        <div key={band.id} className="card row">
          <span>{band.stage_name} ({band.status})</span>
          <div>
            <button onClick={() => updateBandStatus(band.id, 'approved')}>Aprovar</button>
            <button onClick={() => updateBandStatus(band.id, 'hidden')}>Ocultar</button>
          </div>
        </div>
      ))}
    </section>
  );
}
