下記のようにGoogle claspでダウンロードしてからgithubへコミットする。

idtrm@otaskacyba MINGW64 ~/vscode/scacyba/reservtest
$ clasp login
`🔑 Authorize clasp by visiting this url: https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A60283&access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.deployments%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.projects%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fscript.webapp.deploy%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.file%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fservice.management%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Flogging.read%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&response_type=code&client_id=1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com
You are logged in as idtrmnt@gmail.com.

idtrm@otaskacyba MINGW64 ~/vscode/scacyba/reservtest
$ clasp clone 1nuzUcCvlF-95aKD42nJhGz_b3wsA97gfcIfUqWsjcyrvzQRMCu4ZRTze
└─ appsscript.json
└─ シート作成.js
└─ 重複等.js
└─ Googleフォーム.js
└─ サイドバー予約.html
Cloned 5 files.

idtrm@otaskacyba MINGW64 ~/vscode/scacyba/GASreservtest (main)
$ clasp pull
└─ appsscript.json
└─ シート作成.js
└─ 重複等.js
└─ Googleフォーム.js
└─ サイドバー予約.html
Pulled 5 files.
