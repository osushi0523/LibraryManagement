"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
}

/**
 * 書籍一覧画面コンポーネントです。 (URL: /books)
 * 
 * 【なぜこの層に書くのか】
 * Reactコンポーネントとして、ユーザーへのUI表示とユーザー操作（クリック等）の検知を担当します。
 * Spring Boot REST API を直接呼ぶのではなく、Next.jsのBFF (/api/books) へ HTTP fetch を行うことで
 * クライアントとバックエンドを分離しています。
 */
export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ブラウザから Next.js BFF の GET /api/books を呼び出します
    fetch("/api/books")
      .then((res) => {
        if (!res.ok) {
          throw new Error("書籍一覧の取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2>書籍一覧</h2>
        <Link href="/books/new" className="btn">
          新規登録
        </Link>
      </div>

      {books.length === 0 ? (
        <p>登録されている書籍はありません。</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <Link href={`/books/${book.id}`}>
                {book.title} (著者: {book.author})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
