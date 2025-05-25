import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "ペイロード - Symbol DevToys" },
    { name: "description", content: "ペイロード16進数文字列をデコードして、トランザクションの内容を表現します。" },
  ];
}

export default function Payload() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("payload.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("payload.subtitle")}</p>
      </div>
    </div>
  );
}
