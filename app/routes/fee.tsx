export function meta() {
  return [
    { title: "手数料計算機 - Symbol DevToys" },
    { name: "description", content: "構築したトランザクションの手数料を試算する計算機です。" },
  ];
}

export default function Fee() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">手数料計算機</h1>
        <p className="text-muted-foreground mt-2">
          構築したトランザクションの手数料を試算する計算機です。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
