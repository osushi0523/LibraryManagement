# アーキテクチャ解説ドキュメント (docs/architecture.md)

本ドキュメントでは、本アプリケーションの設計の背景、各技術要素の役割、およびセキュリティ／拡張性の観点からの設計理由を初心者向けに解説します。

---

## 1. 各技術の役割分担 (Responsibility Separation)

| 技術 | 担当範囲 | 主な役割 |
|---|---|---|
| **React (Client Component)** | ブラウザ側 UI | ユーザーインターフェースの描画、フォーム入力管理、ボタン押下などのイベント処理、BFFへのHTTP通信制御 |
| **Next.js (App Router)** | アプリ基盤 / ルーティング | ページルーティング (Pages/Layouts)、サーバーサイド機能、静的ファイルの配信 |
| **Next.js Route Handler (BFF)** | Backend for Frontend | ブラウザからのAPI受信、Spring Boot APIの呼び出し仲介、将来の認証・セッション層 |
| **Spring Boot** | バックエンド REST API | 業務ロジックの実行、データベースアクセス制御、データバリデーション、レスポンスデータの生成 |
| **H2 Database** | 永続化層 (In-Memory) | データの保存・検索・削除 (SELECT, INSERT, DELETE) |

---

## 2. BFF (Backend for Frontend) とは何か？

BFFとは、**「フロントエンド専用のバックエンド（中継層）」** のことです。

本アプリケーションでは、`frontend/app/api/books/route.ts` などの Next.js Route Handler が BFF の役割を担っています。

### なぜ Browser から Spring Boot を直接呼ばないのか？

1. **セキュリティの強化 (認証・セッションの隠蔽)**
   - ブラウザが直接バックエンドと通信する場合、APIキーや認証トークン（JWT等）をブラウザ側で保持・送受信する必要が生じ、XSS（クロスサイトスクリプティング）攻撃などの脆弱性に晒されるリスクが高まります。
   - BFFを挟むことで、ブラウザとBFFの間は暗号化されたCookie/セッションで通信し、BFFからSpring Bootの間で安全に認証トークンを付与する設計が可能になります。

2. **CORS (Cross-Origin Resource Sharing) の回避・簡略化**
   - ブラウザにはセキュリティ上「異なるドメイン/ポート」への直接通信を制限する同源ポリシー（Same-Origin Policy）があります。
   - ブラウザから見て同じオリジン（`http://localhost:3000`）である Next.js BFF (`/api/...`) を呼ぶ構成にすることで、ブラウザ向けのCORS許可設定をSpring Boot側に複雑に記述する必要がなくなります。
   - サーバー間通信（Next.js Node.js環境 → Spring Boot）にはブラウザのCORS制限が適用されません。

3. **クライアントに依存しないインターフェース整形**
   - 将来的に複数のマイクロサービスや外部APIを呼ぶ必要が出た場合でも、BFFで応答を束ねて1つの最適なレスポンスとしてブラウザに返すことができます。

---

## 3. CORS（クロスオリジンリソース共有）がこの構成ではどうなるか

本構成では、ブラウザは常に自ドメインである Next.js (`http://localhost:3000`) の `/api/books` に対してリクエストを送ります。

- **Browser → Next.js BFF**: 同一オリジン（Same-Origin）のため、CORS問題は一切発生しません。
- **Next.js BFF → Spring Boot**: Node.js環境（サーバーサイド）からのHTTP通信であるため、ブラウザのCORS制約を受けません。

結果として、**Spring Boot側で `@CrossOrigin` などの特別なCORS許可ヘッダーを設定することなく、安全に通話が可能** になります。

---

## 4. 将来 OIDC (OpenID Connect) や認証を追加する場合の拡張位置

将来的にログイン機能や OIDC 認証を追加する場合、本構成はそのまま拡張できるように設計されています。

### どこに何を追加するか？

1. **Next.js BFF (`frontend/app/api/...` または ミドルウェア `middleware.ts`)**
   - **担当内容**: OIDC（Auth0, Keycloak, Azure AD / Entra ID等）との認証リダイレクトフロー、セッションCookieの発行・検証、AccessTokenの暗号化保持。
   - **動作イメージ**:
     - ユーザーがアクセスした際、未認証であれば OIDC 認可サーバーへリダイレクト。
     - ログイン成功後、BFFが Access Token を取得して暗号化Cookieに保存。
     - BFFから Spring Boot を呼ぶ際、`Authorization: Bearer <AccessToken>` ヘッダーを自動的に付加。

2. **Spring Boot (`backend/src/...`)**
   - **担当内容**: リクエストヘッダーに含まれる Bearer Token の署名検証・認可（Resource Server化）。
   - **動作イメージ**:
     - `spring-boot-starter-oauth2-resource-server` を導入。
     - JWTトークンを検証し、認証済みユーザー情報（User IDやRole）を取得して業務ロジックを実行。

このように、**「ブラウザと認証処理を接する部分はBFFが引き受け、Spring Bootはトークン検証と業務ロジックに集中する」** という綺麗な責務分離を実現できます。
