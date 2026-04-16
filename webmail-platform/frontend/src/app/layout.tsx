import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="mx-auto min-h-screen max-w-7xl p-4">{children}</div>
      </body>
    </html>
  );
}
