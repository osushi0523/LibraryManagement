"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * 書籍登録画面コンポーネントです。 (URL: /books/new)
 * 
 * 【なぜこの層に書くのか】
 * フォーム状態の管理（useState）およびユーザー入力を取得し、
 * Next.js BFF (/api/books) へ POST リクエストを送出するためです。
 * 成功後は useRouter を使ってクライアントサイドで一覧画面 (/books) へ遷移します。
 */
export default function NewBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim()) {
      setError("タイトルと著者名は必須です。");
      return;
    }

    setSubmitting(true);

    try {
      // ブラウザから Next.js BFF の POST /api/books を呼び出します
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "書籍の登録に失敗しました");
      }

      // 登録成功後は一覧画面 (/books) に戻ります
      router.push("/books");
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>書籍新規登録</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: Clean Code"
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">著者名</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="例: Robert C. Martin"
            disabled={submitting}
          />
        </div>

        <div>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? "登録中..." : "登録"}
          </button>
          <Link href="/books" className="btn btn-secondary">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
