import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'James Asoque Agbo | PORTFOLIO',
  description: 'IT student and developer based in the Philippines. Building digital products that matter.',
  openGraph: {
    title: 'James Asoque Agbo | PORTFOLIO',
    description: 'IT student and developer based in the Philippines. Building digital products that matter.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/jpeg" href="/logo.jpg?v=3" />
        <link rel="shortcut icon" href="/logo.jpg?v=3" />
        <link rel="apple-touch-icon" href="/logo.jpg?v=3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
