import { useTranslation } from "react-i18next";
import type { Route } from "./+types/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { LanguageSwitcher } from "~/components/language-switcher";

export function meta({}: Route.MetaArgs) {
  // Note: meta関数内ではuseTranslationが使用できないため、
  // 実際のプロジェクトではloaderでi18nインスタンスを使用することを推奨
  return [
    { title: "Symbol DevToys - 設定" },
    { name: "description", content: "Symbol DevToys の設定ページ" },
  ];
}

export default function Settings() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* ページヘッダー */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("settings.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("settings.subtitle")}
          </p>
        </div>

        <Separator />

        {/* 一般設定 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("settings.general.title")}
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("settings.general.language.label")}
              </CardTitle>
              <CardDescription>
                {t("settings.general.language.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSwitcher />
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 表示設定 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("settings.display.title")}
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">テーマ設定</CardTitle>
              <CardDescription>
                {t("settings.display.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    カラーテーマ
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ライト・ダークテーマの設定は今後追加予定です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">レイアウト設定</CardTitle>
              <CardDescription>
                レイアウトやフォントサイズの設定項目
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    フォントサイズ
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    フォントサイズの設定は今後追加予定です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ネットワーク設定 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("settings.network.title")}
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Symbol ネットワーク</CardTitle>
              <CardDescription>
                {t("settings.network.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ネットワークタイプ
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    メインネット・テストネットの選択は今後追加予定です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ノード設定</CardTitle>
              <CardDescription>
                接続するSymbolノードの設定
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ノードURL
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    カスタムノードURLの設定は今後追加予定です。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
