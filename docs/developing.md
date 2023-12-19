# 詳細な開発方法

> [!IMPORTANT]
> 本ページの内容理解には、[Gitの概念](about_git.md)についての知識が必要な部分があります。

## 開発の大まかな流れ

1. [ローカルリポジトリ](about_git.md#リポジトリ)と[リモートリポジトリ](about_git.md#リポジトリ)を同期させる :arrows_counterclockwise:
    - プロジェクトのディレクトリに入って次のコマンドを実行します。

        ```
        git pull
        ```

> [!IMPORTANT]
> ローカルリポジトリがリモートより進んでいる場合、エラーが発生して同期できなくなります。  
> 本ページの手順通りに開発を進めることでエラーが出る状況は回避できます。

2. [ブランチ](about_git.md#ブランチ)を切る :cactus:
    - 次のコマンドを実行します。

        ```
        git checkout -b dev/<ブランチ名>
        ```

> [!NOTE]
> ここでは、1つの機能の実装を1つのブランチにまとめる方法([GitHub Flow](https://docs.github.com/ja/get-started/quickstart/github-flow))で開発を行います。  
> `<ブランチ名>`の部分は実装する機能に応じた分かりやすい名前を入力します。
> (`dev/new-page`など)

3. プログラムを書く :pen:

> [!NOTE]
> あとから編集内容の一部だけ元に戻すことや、バグが出来てしまった原因の実装を探すことが困難になるので、一度にたくさんの機能を追加することは避けるべきです。  
> 適切な編集単位については[commitの粒度](https://qiita.com/chihiro/items/04482caebc702e75e84d)を参照してください。

4. 変更したファイルを[ステージ](about_git.md#ステージ)する :raised_hands:
    - 次のコマンドを実行します。

        ```
        git add <ファイル名>
        ```

> [!NOTE]
> 思いがけないファイルをステージしてしまう事故を防ぐために、変更されたファイルの一覧を`git status`で確認することをおすすめします。

> [!TIP]
> `<ファイル名>`を`.`とすると変更された全てのファイルをステージすることができます。

5. 変更を[コミット](about_git.md#コミット)する :muscle:
    - 次のコマンドを実行します。

        ```
        git commit -m "コミットメッセージ"
        ```

> [!NOTE]
> コミットメッセージは手順3で行った変更点を簡潔に表すような文章にします。
> (`"Foo.tsの文字列処理の修正"`など)

6. 目的の機能の実装が完了するまで手順3から5を繰り返す :clock4:
7. ここまで編集してきたブランチをリモートリポジトリにアップロードする :globe_with_meridians:
    - 次のコマンドを実行します。

        ```
        git push origin HEAD
        ```

8. [プルリクエスト](about_git.md#プルリクエスト)を作成する :wave:
    1. Webブラウザで[このリポジトリのプルリクエストページ](https://github.com/SU-ProgC-Marionnette/GakujoViewer/pulls)を開きます。
    2. 右上のNew pull requestをクリックします。
    3. `base: master <- compare: master`のように表示されている部分があるので、compareを自分が作成したブランチに変更します。
    4. 問題がなければCreate pull requestをクリックします。
    5. 作業は完了です。後ほどmasterブランチを触る権限を持っている人がプルリクエストの内容を確認して、問題なければmasterブランチに反映します。
