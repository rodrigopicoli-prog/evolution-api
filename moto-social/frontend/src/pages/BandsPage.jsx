import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';

export function BandsPage() {
  const [bands, setBands] = useState([]);

  useEffect(() => {
    apiFetch('/bands').then(setBands).catch(console.error);
  }, []);

  return (
    <section>
      <h2>Bandas</h2>
      <div className="list">
        {bands.map((band) => (
          <article key={band.id} className="card">
            <h3>{band.stage_name}</h3>
            <p>{band.city}/{band.state}</p>
            <Link to={`/bandas/${band.id}`}>Perfil</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
