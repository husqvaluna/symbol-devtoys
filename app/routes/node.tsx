import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "ノード - Symbol DevToys" },
    { name: "description", content: "ノードホストURLからノード情報を取得します。" },
  ];
}

export default function Node() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("node.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("node.subtitle")}</p>
      </div>
    </div>
  );
}
