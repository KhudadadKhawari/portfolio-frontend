import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevOps Portfolio',
  description: 'Dynamic portfolio demo for GitHub Actions and single-VPS deployment.',
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/admin', label: 'Admin' },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-stone-300 bg-paper/95">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
            <Link href="/" className="text-lg font-bold tracking-normal text-ink">
              DevOps Portfolio
            </Link>
            <div className="flex flex-wrap gap-2 text-sm font-medium">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-ink hover:bg-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="border-t border-stone-300 px-5 py-6 text-center text-sm text-stone-600">
          Built for GitHub Actions, Docker Compose, MinIO, and VPS deployment demos.
        </footer>
      </body>
    </html>
  );
}
