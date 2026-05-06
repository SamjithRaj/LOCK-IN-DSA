import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'LOCK-IN DSA — Learn, Practice, Track',
  description: 'A self-contained DSA learning, practice, doubt-solving, and roadmap tracking app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
