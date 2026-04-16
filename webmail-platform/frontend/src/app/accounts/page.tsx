import { Shell } from '@/components/shell';

export default function AccountsPage() {
  return (
    <Shell title="Contas de E-mail">
      <div className="space-y-4">
        <button className="rounded bg-indigo-500 px-4 py-2">Adicionar conta</button>
        <div className="rounded-lg bg-slate-800 p-4">Lista de contas IMAP/SMTP do usuário</div>
      </div>
    </Shell>
  );
}
