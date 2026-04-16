import { Shell } from '@/components/shell';

export default function DashboardPage() {
  return (
    <Shell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-4">
        {['Total de contas', 'Não lidos', 'Prioridade alta', 'Propaganda'].map((item) => (
          <div key={item} className="rounded-lg bg-slate-800 p-4">{item}</div>
        ))}
      </div>
    </Shell>
  );
}
