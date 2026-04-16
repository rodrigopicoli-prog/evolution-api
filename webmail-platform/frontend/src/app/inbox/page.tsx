import { Shell } from '@/components/shell';

export default function InboxPage() {
  return (
    <Shell title="Inbox Unificada">
      <div className="grid h-[70vh] gap-3 md:grid-cols-[300px_1fr]">
        <section className="rounded bg-slate-800 p-3">
          <div className="mb-2 flex gap-2">
            <button className="rounded bg-slate-700 px-2 py-1 text-xs">Propaganda</button>
            <button className="rounded bg-slate-700 px-2 py-1 text-xs">Cliente</button>
          </div>
          <div className="text-sm">Lista lateral de e-mails + filtros por conta/categoria/busca</div>
        </section>
        <section className="rounded bg-slate-800 p-3">
          <h3 className="mb-2 font-semibold">Assunto do e-mail</h3>
          <p className="mb-4 text-sm text-slate-300">Visualização da mensagem selecionada.</p>
          <div className="flex gap-2">
            <button className="rounded bg-indigo-500 px-3 py-2 text-sm">Responder com IA</button>
            <button className="rounded bg-slate-700 px-3 py-2 text-sm">Resumir e-mail</button>
          </div>
        </section>
      </div>
    </Shell>
  );
}
