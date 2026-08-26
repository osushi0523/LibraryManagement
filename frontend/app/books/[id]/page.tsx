"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
}

/**
 * 書籍詳細画面コンポーネントです。 (URL: /books/[id])
 * 
 * 【なぜこの層に書くのか】
 * 特定書籍の詳細表示と削除アクションの起点となるUI層です。
 * 詳細データ取得は Next.js BFF (/api/books/[id]) の GET、
 * 削除処理は Next.js BFF (/api/books/[id]) の DELETE を呼び出します。
 */
export default function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const router = useRouter();

  const id = params.id;

  useEffect(() => {
    // ブラウザから Next.js BFF の GET /api/books/[id] を呼び出します
    fetch(`/api/books/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("書籍情報の取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("本当にこの書籍を削除しますか？")) {
      return;
    }

    setDeleting(true);

    try {
      // ブラウザから Next.js BFF の DELETE /api/books/[id] を呼び出します
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("書籍の削除に失敗しました");
      }

      // 削除成功後は一覧画面 (/books) に戻ります
      router.push("/books");
    } catch (err: any) {
      alert(err.message || "エラーが発生しました");
      setDeleting(false);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error || !book) return <div className="error-message">{error || "書籍が見つかりません"}</div>;

  return (
    <div>
      <h2>書籍詳細</h2>

      <div style={{ marginBottom: "20px", lineHeight: "1.8" }}>
        <p><strong>ID:</strong> {book.id}</p>
        <p><strong>タイトル:</strong> {book.title}</p>
        <p><strong>著者名:</strong> {book.author}</p>
      </div>

      <div>
        <button
          onClick={handleDelete}
          className="btn btn-danger"
          disabled={deleting}
        >
          {deleting ? "削除中..." : "削除"}
        </button>
        <Link href="/books" className="btn btn-secondary">
          一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
