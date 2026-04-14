import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';

export function NewEventPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    city: '',
    state: '',
    placeName: '',
    coverUrl: '',
    category: '',
  });

  async function onSubmit(event) {
    event.preventDefault();
    try {
      await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          startDate: new Date(form.startDate).toISOString(),
          endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        }),
      });
      navigate('/meus-eventos');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h2>Novo evento</h2>
      <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <textarea placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
      <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
      <input placeholder="Estado" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} required />
      <input placeholder="Local" value={form.placeName} onChange={(e) => setForm({ ...form, placeName: e.target.value })} required />
      <input placeholder="URL da capa" value={form.coverUrl} onChange={(e) => setForm({ ...form, coverUrl: e.target.value })} />
      <input placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      {error && <p>{error}</p>}
      <button type="submit">Publicar (pendente)</button>
    </form>
  );
}
