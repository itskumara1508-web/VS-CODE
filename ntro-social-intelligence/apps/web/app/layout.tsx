import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SOCIOINTELL — AI-Powered Social Media Intelligence',
  description: 'SOCIOINTELL: AI-Powered Social Media Intelligence & Network Analysis. Understand. Analyze. Predict.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
