import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avalon Game Record System",
  description: "A database system for recording Avalon games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>
        <nav className="navbar">
          <div className="nav-title">
            <Link href="/">Avalon DB</Link>
          </div>

          <div className="nav-links">
            <Link href="/">首頁</Link>
            <Link href="/games">遊戲列表</Link>
            <Link href="/games/new">新增遊戲</Link>
          </div>
        </nav>

        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}