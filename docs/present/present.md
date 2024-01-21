---
marp: true
paginate: true
headingDivider: 1

style: |
    section.title {
        justify-content: center;
    }

    section {
        justify-content: start;
    }
---

<!-- _class: title -->
# 学務情報システムビューワ「GakujoViewer」の開発

チーム名: マリオネット

- 70210028 川口裕大
- 70210036 小出智大
- 70210049 杉山真沙人

# 概要

- aaaa

# 実演

- 動画

# テーマの選定理由

## 学務情報システムの欠点

- 毎回ログイン操作が必要
- 動作が重い etc....

## 欠点を補うために

- 非同期でスクレイピングしてデータを取得
- 取得したデータをキャッシュして2度目からのロード時間を回避

# 講義で学んだ技術

- スクレイピング
- 取得したデータ構造の工夫
  - スクレイピング→変換するコード→表示
- クラスの概念(モデリングの講義など)

# 開発環境

## 使用言語

- JavaScript, TypeScript
  - Node.jsを用いることでメンバー間で環境を揃えるのが容易
  - 時間がかかるスクレイピング+すぐに反応してほしいGUI
    - →非同期処理を容易に行えるasync/await

- HTML
  - Vue.js(後述)を使うことで変数内のデータをHTMLとして出力するのが容易

# 開発環境(つづき)

## 主要な使用ライブラリ

- Electron
  - JavaScript, TypeScriptとHTMLを用いてGUIソフトを作るためのフレームワーク
- Puppeteer
  - スクレイピングのためのヘッドレスブラウザ
- Vue.js
  - WebアプリのUIを作るためのフレームワーク
- Pinia
  - Vue.jsで複数ページのデータを一箇所で管理

# 開発時の工夫

## GitHubの活用

- GitHub Flowモデル(<https://docs.github.com/ja/get-started/using-github/github-flow>)を用いたコードの編集
- タスク管理(Projects)の使用
- 問題点(Issues)の管理

# 開発時の工夫(つづき)

## シーケンス図の作成

- ソフトの大まかな流れを図示して分かりやすく

![bg right h:100%](../../images/sequence.png)

# 開発時の工夫(つづき)

## クラス図の作成

- クラスを図にすることで共同開発の担当を分かりやすく

![](../../images/class.png)
