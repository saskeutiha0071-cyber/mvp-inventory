import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Учёт данных',
  description: 'Простое приложение для учёта данных',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
