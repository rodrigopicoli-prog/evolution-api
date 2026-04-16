import Link from 'next/link';
import { ReactNode } from 'react';

const links = [
  ['Dashboard', '/dashboard'],
  ['Contas', '/accounts'],
  ['Inbox', '/inbox'],
  ['Regras', '/rules'],
  ['Configurações', '/settings'],
];

export function Shell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl bg-slate-900 p-4">
        <h1 className="mb-6 text-lg font-bold">Webmail AI</h1>
        <nav className="space-y-2 text-sm">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded px-3 py-2 hover:bg-slate-800">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="rounded-xl bg-slate-900 p-4">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>
        {children}
      </main>
    </div>
  );
}
