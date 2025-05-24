import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Symbol DevToys - ホーム" },
    { name: "description", content: "Symbol DevToys のホームページ" },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Symbol DevToys
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Symbol ブロックチェーン開発者向けツール集
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">アカウント管理</h3>
            <p className="text-gray-600 dark:text-gray-400">
              キーペアの生成やアカウント情報の確認ができます
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">ブロックチェーン監視</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ブロック、トランザクション、ネットワークの状態を監視できます
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">アセット管理</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ネームスペースやモザイクの作成・管理ができます
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">開発支援</h3>
            <p className="text-gray-600 dark:text-gray-400">
              ペイロード作成や手数料計算などの開発支援ツールです
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
