import { NextResponse } from "next/server";

/**
 * BFF (Backend for Frontend) の Route Handler です。
 * エンドポイント: /api/books
 * 
 * 【なぜこの層に書くのか】
 * ブラウザ (React) からバックエンド (Spring Boot) への直接通信を隠蔽し、
 * 今後セッション管理やCookie認証、OIDC連携を単一のゲートウェイ（BFF）で安全に行えるようにするためです。
 * ここでは業務ロジックを持たず、Spring Boot REST API へのリクエスト仲介（プロキシ）のみを担当します。
 */

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8080";

// GET /api/books -> GET Spring Boot /books
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/books`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { message: "Backend API error" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch books from backend" },
      { status: 500 }
    );
  }
}

// POST /api/books -> POST Spring Boot /books
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create book in backend" },
      { status: 500 }
    );
  }
}
