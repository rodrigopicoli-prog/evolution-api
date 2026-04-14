import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section>
      <h1>Plataforma para motociclistas, eventos e bandas</h1>
      <p>Descubra encontros, salve favoritos e conecte-se com bandas da cena biker.</p>
      <div className="grid-two">
        <Link className="card" to="/eventos">Ver eventos</Link>
        <Link className="card" to="/bandas">Ver bandas</Link>
      </div>
    </section>
  );
}
