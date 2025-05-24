import { useTranslation } from "react-i18next";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  // Note: meta関数内ではuseTranslationが使用できないため、
  // 実際のプロジェクトではloaderでi18nインスタンスを使用することを推奨
  return [
    { title: "Symbol DevToys - ホーム" },
    { name: "description", content: "Symbol DevToys のホームページ" },
  ];
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {t("home.title")}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t("home.subtitle")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              {t("home.categories.accountManagement.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.categories.accountManagement.description")}
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              {t("home.categories.blockchainMonitoring.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.categories.blockchainMonitoring.description")}
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              {t("home.categories.assetManagement.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.categories.assetManagement.description")}
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">
              {t("home.categories.developmentSupport.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("home.categories.developmentSupport.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
