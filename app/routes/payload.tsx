export function meta() {
  return [
    { title: "ペイロード - Symbol DevToys" },
    { name: "description", content: "ペイロード16進数文字列をデコードして、トランザクションの内容を表現します。" },
  ];
}

export default function Payload() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">ペイロード</h1>
        <p className="text-muted-foreground mt-2">
          ペイロード16進数文字列をデコードして、トランザクションの内容を表現します。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
