import { NextResponse } from "next/server";

/**
 * BFF (Backend for Frontend) の Route Handler です。
 * エンドポイント: /api/books/[id]
 * 
 * 【なぜこの層に書くのか】
 * ID指定の取得・削除リクエストをブラウザから受け取り、内部ネットワーク上の Spring Boot REST API に中継するためです。
 */

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:8080";

// GET /api/books/[id] -> GET Spring Boot /books/{id}
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const res = await fetch(`${BACKEND_BASE_URL}/books/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Book not found" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch book from backend" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] -> DELETE Spring Boot /books/{id}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const res = await fetch(`${BACKEND_BASE_URL}/books/${id}`, {
      method: "DELETE",
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete book in backend" },
      { status: 500 }
    );
  }
}
