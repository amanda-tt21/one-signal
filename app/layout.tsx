import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Automation',
  description: 'Create and send content automatically',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
