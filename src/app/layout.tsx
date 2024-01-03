import type { Metadata } from 'next';
import './globals.scss';
import styles from './layout.module.scss';

import { Roboto } from 'next/font/google';
import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Test Task',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <section className={styles.app}>
          <Topbar />
          <main className={styles.main}>
            <Sidebar />
            {children}
          </main>
        </section>
      </body>
    </html>
  );
}
