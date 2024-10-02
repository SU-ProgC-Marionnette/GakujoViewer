# GakujoViewer

[静岡大学の学務情報システム](https://gakujo.shizuoka.ac.jp)用の非公式クライアント

## 新システム対応について

v0.2.0でLiveCampusUに対応しましたが、まだ不具合が残っている可能性があります。

## インストール

[ダウンロードページ](https://github.com/SU-ProgC-Marionnette/GakujoViewer/releases)からインストーラかzipファイルをダウンロードしてインストールする

## 機能

- 初回起動時にログインを求められるのでログインすると以降自動でログインする
- レポート一覧、授業連絡一覧、小テスト一覧のデータが自動で取得される(10分おきに自動更新)
- 表中のタイトルをクリックで内容確認

## 注意

- **このソフトを利用したことによって生じたいかなる損害についても開発者は責任を負いません**
- 自動ログインは初回ログイン時のCookieを保存、読み込みすることで実現しています
- 取得したCookieや表データは次の場所に保存されます
  - Linux: `$XDG_CONFIG_HOME/GakujoViewer`または`~/.config/GakujoViewer`
  - Windows: `%APPDATA%\GakujoViewer`

## 開発

```
# Install dependencies
npm i

# Launch the app in development mode
npm run dev

# Update third-party softwares license docs (ThirdPartyLicense.txt, src/renderer/assets/license.json)
npm run license

# Build release binary (built binaries are found at dist/)
npm run build
```
