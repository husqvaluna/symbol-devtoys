import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "コンバータ - Symbol DevToys" },
    { name: "description", content: "様々な値を相互変換します。" },
  ];
}

export default function Converter() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("converter.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("converter.subtitle")}</p>
      </div>
    </div>
  );
}
