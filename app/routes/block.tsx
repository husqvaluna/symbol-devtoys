import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "ブロック - Symbol DevToys" },
    { name: "description", content: "ブロックハッシュまたは番号でネットワークに問い合わせて、ブロック情報を取得します。" },
  ];
}

export default function Block() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("block.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("block.subtitle")}</p>
      </div>
    </div>
  );
}
