import "./globals.css";
import React from "react";

export const metadata = {
  title: "簡易図書管理アプリ",
  description: "学習用サンプルアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="container">
          <header>
            <h1>簡易図書管理アプリ</h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
