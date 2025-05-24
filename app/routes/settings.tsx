import { useTranslation } from "react-i18next";
import type { Route } from "./+types/settings";

export function meta({}: Route.MetaArgs) {
  // Note: meta関数内ではuseTranslationが使用できないため、
  // 実際のプロジェクトではloaderでi18nインスタンスを使用することを推奨
  return [
    { title: "Symbol DevToys - 設定" },
    { name: "description", content: "Symbol DevToys の設定ページ" },
  ];
}

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("settings.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="border-t pt-6">
          <div className="grid gap-6">
            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                一般設定
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                設定項目は今後追加予定です。
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                表示設定
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                テーマやレイアウトの設定項目は今後追加予定です。
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                ネットワーク設定
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Symbol ネットワークの接続設定は今後追加予定です。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
