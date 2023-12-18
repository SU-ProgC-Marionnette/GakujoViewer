# GakujoViewer

## 設計

とりあえず情報を表示するだけの場合の設計
(レポート提出などの操作には対応していない)

### シーケンス図

![シーケンス図](images/sequence.png)

<details>
    <summary>PlantUML</summary>

    actor "ユーザ" as user
    participant "フロントエンド" as front
    participant "バックエンド" as back
    participant "学務情報システム" as gakujo

    user -> front : 起動
    front -> back : キャッシュ取得
    front <-- back : キャッシュ
    user <-- front : リスト表示
    back ->> gakujo : 最新データ取得
    back <-- gakujo : 最新データ
    back -> back : データをキャッシュ
    front <-- back : 最新データ
    user <-- front : リスト更新
    user -> front : ページ遷移
    front -> back : キャッシュ取得
    front <-- back : キャッシュ
    user <-- front : リスト表示
    back ->> gakujo : 最新データ取得
    back <-- gakujo : 最新データ
    back -> back : データをキャッシュ
    front <-- back : 最新データ
    user <-- front : リスト更新
</details>

### クラス図

![クラス図](images/class.png)

<details>
    <summary>PlantUML</summary>

    hide empty fields
    hide empty methods

    class ViewController {
    }

    class Scraper {
        {static} +busy : boolean
        {static} +logged : boolean
        {static} +error : boolean
        {static} +page : Page
        {static} -movePage(page : Pages) : boolean
        {static} +getTable() : object?
    }

    class DataProcessor {
        {static} +getContactList() : ContactList
        {static} +getExamList() : ExpireList
        {static} +getReportList() : ReportList
    }

    class StringProcessor {
        {static} +toDateList(str : string) : Array<Date>
        {static} +getBody(str : string) : string
        {static} +isRead(str : string) : boolean
        {static} +isImportant(str : string) : boolean
    }

    class JsonUtil {
        +fileName : string
        -type Data = int | string | boolean
        +get(key : string) : Data
        +set(key : string, value : Data)
        +remove(key : string) : boolean
    }

    interface List {
        subject : string
        title : string
    }

    interface ContactList extends List {
        staff : string
        type : ContactType
        date : Date
        targetDate : Date?
        read : boolean
        important : boolean
    }

    interface ExpireList extends List {
        status : ExpireStatus
        start : Date
        expire : Date
        type : SubmitType
    }

    interface ReportList extends ExpireList {
        submit : Date?
    }

    enum Pages {
        Top
        Report
        Exam
        Contact
        Error
        Unknown
    }

    enum ContactType {
        Staff
    }

    enum SubmitType {
        Web
    }

    enum ExpireStatus {
        Accepting
        Submitted
        Closed
    }

    ViewController --> DataProcessor
    DataProcessor --> Scraper
    DataProcessor --> ContactList
    DataProcessor --> ExpireList
    DataProcessor --> ReportList
    DataProcessor --> StringProcessor
    DataProcessor --> JsonUtil
    Scraper --> JsonUtil
    ContactType --> ContactList
    SubmitType --> ExpireList
    Pages --> Scraper
    ExpireStatus --> ExpireList
</details>

#### クラス

- ViewController
  - フロントエンドとバックエンドの橋渡し
  - DataProcessorを用いてデータを取得
- Scraper
  - 直接学務情報システムにアクセスする唯一のクラス
  - JsonUtilでログイン情報(メール、パスワード)を取得する
  - busy: 処理中
  - logged: ログイン済み
  - error: アクセス不可
  - page: 現在のページ
  - movePage(page): pageに移動、成功したか返す
  - getTable(): 現在のページにある表をオブジェクトとして返す。失敗したらnull
- DataProcessor
  - JsonUtilを使ってキャッシュする
  - 各メソッド: ScraperのgetTableで取ってきたオブジェクトを解析してListに変換する
- StringProcessor
  - toDateList(str): strに含まれる日付を全部抽出して配列にして返す
  - getBody(str): strから【重要】や（未読）みたいな付加情報を消したものを返す
  - isRead(str): strに（未読）が含まれているか
  - isImportant(str): strに【重要】が含まれているか
- JsonUtil
  - JSONファイルの読み書き

#### インタフェース

- List
  - 教科名とタイトルのみのリスト
  - たぶん直接は使わない
- ContactList
  - 授業連絡リスト用
- ExpireList
  - 小テストみたいな期限があるリスト
- ReportList
  - ExpireListのとくにレポート用

#### Enum

- Pages
  - ページリスト
- ContactType
  - 連絡種別
- SubmitType
  - 提出方法
- ExpireStatus
  - 提出状態

## 環境構築

### Install dependencies

```bash
npm install
```

### Start developing

```bash
npm run dev
```

## Additional Commands

```bash
npm run dev # starts application with hot reload
npm run build # builds application, distributable files can be found in "dist" folder

# OR

npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target
```

## Project Structure

```bash
- scripts/ # all the scripts used to build or serve your application, change as you like.
- src/
  - main/ # Main thread (Electron application source)
  - renderer/ # Renderer thread (VueJS application source)
```

## Using static files

If you have any files that you want to copy over to the app directory after installation, you will need to add those files in your `src/main/static` directory.

#### Referencing static files from your main process

```ts
/* Assumes src/main/static/myFile.txt exists */

import {app} from 'electron';
import {join} from 'path';
import {readFileSync} from 'fs';

const path = join(app.getAppPath(), 'static', 'myFile.txt');
const buffer = readFileSync(path);
```
