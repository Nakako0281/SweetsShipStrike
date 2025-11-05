# SweetsShipStrike PeerServer

PeerJS シグナリングサーバー for SweetsShipStrike オンライン対戦

## セットアップ

```bash
cd server
npm install
```

## ローカル実行

```bash
npm start
# または開発モード
npm run dev
```

サーバーは `http://localhost:9000` で起動します。

## Render デプロイ

1. Render ダッシュボードで新しい Web Service を作成
2. リポジトリを接続
3. 以下の設定を使用:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000` (Render が自動設定)

または、`render.yaml` を使用した自動デプロイ:

1. リポジトリルートに `render.yaml` を配置
2. Render で Blueprint からデプロイ

## 接続URL

デプロイ後のURL例:
```
https://sweetsshipstrike-peerserver.onrender.com
```

クライアント側で以下のように設定:
```typescript
const peer = new Peer(id, {
  host: 'sweetsshipstrike-peerserver.onrender.com',
  port: 443,
  path: '/peerjs',
  secure: true,
});
```

## 環境変数

- `PORT`: サーバーポート (デフォルト: 9000)
- `NODE_ENV`: 環境 (`development` または `production`)

## 注意事項

- Render の無料プランは15分間アクティビティがないとスリープします
- 初回接続時に起動まで数秒かかる場合があります
- 本番環境では有料プランの使用を推奨
