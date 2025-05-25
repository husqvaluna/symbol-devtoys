import { useTranslation } from "react-i18next";

export function meta() {
  return [
    { title: "キーペア - Symbol DevToys" },
    { name: "description", content: "新しいキーペアを生成し、秘密鍵から公開鍵とアドレスを導出します。" },
  ];
}

export default function Keypair() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <div className="space-y-2">
        <div className="flex items-center">
          <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("keypair.title")}</h1>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{t("keypair.subtitle")}</p>
      </div>
    </div>
  );
}
