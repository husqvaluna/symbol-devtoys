import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "モザイク - Symbol DevToys" },
    { name: "description", content: "モザイクでネットワークに問い合わせて、モザイク情報を取得します。" },
  ];
}

export default function Mosaic() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("mosaic.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("mosaic.subtitle")}</p>
      </div>
    </div>
  );
}
