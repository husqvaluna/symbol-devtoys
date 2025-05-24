export function meta() {
  return [
    { title: "モニター - Symbol DevToys" },
    { name: "description", content: "Symbolネットワークの監視機能を提供します。" },
  ];
}

export default function Monitor() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">モニター</h1>
        <p className="text-muted-foreground mt-2">
          Symbolネットワークの監視機能を提供します。
        </p>
      </div>
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-lg text-muted-foreground">実装予定</p>
      </div>
    </div>
  );
}
