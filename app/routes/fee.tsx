import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "手数料計算機 - Symbol DevToys" },
    { name: "description", content: "構築したトランザクションの手数料を試算する計算機です。" },
  ];
}

export default function Fee() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("fee.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("fee.subtitle")}</p>
      </div>
    </div>
  );
}
