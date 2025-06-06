# コンバータ機能の仕様

`/converter`ページで提供される機能の仕様に関する文書です。

値を相互に変換する入力と出力をワンセットとして扱います。
一方の入力は片方へ変換後の値が入ります。
変換が出来ない場合は空白を返し、変換に成功した値を表示してください。

## ネットワーク時間変換

Symbolネットワーク時間と現実の世界時間を相互変換します。

### 変換例

```
# NetworkTime | DateTimeString(ISO8601)
110097499 <=> 2016-04-01T00:00:00.000Z
```

## 16進数文字列のエンデコ

16進数メッセージをリーダブルな文字列へ相互変換します。

### 変換例

```
Hex | string(UTF-8)
474F4F44204C55434B21 <=> GOOD LUCK!
```

## アドレスのエンデコ

16進数アドレスをアカウントアドレスへ相互変換します。

### 変換例

```
Hex | string
906E4E3E03590AD14EF56EA4F7ED3980C1C6248B796C784556 <=> SBXE4P-QDLEFN-CTXVN2-SPP3JZ-QDA4MJ-ELPFWH-QRKW
```

