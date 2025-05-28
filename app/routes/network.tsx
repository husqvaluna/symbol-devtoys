import { useTranslation } from "react-i18next";

export function meta() {
  return [{ title: "ネットワーク - Symbol DevToys" }, { name: "description", content: "Symbolネットワークの情報を取得・表示します。" }];
}

export default function Network() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("network.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("network.subtitle")}</p>
      </div>
    </div>
  );
}
