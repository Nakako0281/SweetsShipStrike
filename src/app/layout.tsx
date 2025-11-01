import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SweetsShipStrike - スイーツシップストライク',
  description: 'バトルシップのゲームシステムをベースに、スイーツ擬人化の世界観で対戦するWebゲーム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
