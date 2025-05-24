export function meta() {
  return [
    { title: "キーペア - Symbol DevToys" },
    { name: "description", content: "新しいキーペアを生成し、秘密鍵から公開鍵とアドレスを導出します。" },
  ];
}

export default function Keypair() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">キーペア</h1>
        <p className="text-muted-foreground mt-2">
          新しいキーペアを生成します。秘密鍵文字列から、公開鍵、アドレスを導出します。
          ターゲットとなるSymbolネットワークの選択ができ、選んだネットワーク用のアドレスが表示されます。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
