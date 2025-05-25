import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "ネームスペース - Symbol DevToys" },
    { name: "description", content: "ネームスペースでネットワークに問い合わせて、ネームスペース情報を取得します。" },
  ];
}

export default function Namespace() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("namespace.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("namespace.subtitle")}</p>
      </div>
    </div>
  );
}
