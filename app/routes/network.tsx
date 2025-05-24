export function meta() {
  return [
    { title: "ネットワーク - Symbol DevToys" },
    { name: "description", content: "Symbolネットワークの情報を取得・表示します。" },
  ];
}

export default function Network() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ネットワーク</h1>
        <p className="text-muted-foreground mt-2">
          Symbolネットワークの情報を取得・表示します。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
