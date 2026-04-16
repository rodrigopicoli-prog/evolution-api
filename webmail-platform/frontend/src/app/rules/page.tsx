import { Shell } from '@/components/shell';

export default function RulesPage() {
  return (
    <Shell title="Regras automáticas">
      <div className="space-y-3">
        <button className="rounded bg-indigo-500 px-4 py-2">Nova regra</button>
        <div className="rounded bg-slate-800 p-4 text-sm">
          Se categoria = propaganda, mover para aba Propaganda e marcar prioridade baixa.
        </div>
      </div>
    </Shell>
  );
}
