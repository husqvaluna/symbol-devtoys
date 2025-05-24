export function meta() {
  return [
    { title: "アカウント - Symbol DevToys" },
    { name: "description", content: "アドレスでネットワークに問い合わせて、アカウント情報を取得します。" },
  ];
}

export default function Account() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">アカウント</h1>
        <p className="text-muted-foreground mt-2">
          アドレスでネットワークに問い合わせて、アカウント情報を取得します。
          公開鍵文字列の表示、保有モザイクとその残高の表示、メタデータの表示、マルチシグ構成の表示を行います。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
