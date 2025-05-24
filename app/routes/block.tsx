export function meta() {
  return [
    { title: "ブロック - Symbol DevToys" },
    { name: "description", content: "ブロックハッシュまたは番号でネットワークに問い合わせて、ブロック情報を取得します。" },
  ];
}

export default function Block() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ブロック</h1>
        <p className="text-muted-foreground mt-2">
          ブロックハッシュまたは番号でネットワークに問い合わせて、ブロック情報を取得します。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
