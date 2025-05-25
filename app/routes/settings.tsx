import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { LanguageSwitcher } from "~/components/language-switcher";
import {
  Globe,
  Palette,
  Monitor,
  Download,
  BarChart3,
  Zap,
  FileText,
  ExternalLink,
  Settings as SettingsIcon
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Symbol DevToys - 設定" },
    { name: "description", content: "Symbol DevToys の設定ページ" },
  ];
}

export default function Settings() {
  const { t } = useTranslation();

  // 設定状態の管理
  const [theme, setTheme] = useState("system");
  const [compactDisplay, setCompactDisplay] = useState(false);
  const [checkUpdates, setCheckUpdates] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  const [smartDetection, setSmartDetection] = useState(true);
  const [smartDetectionMode, setSmartDetectionMode] = useState("auto");
  const [textEditor, setTextEditor] = useState("monaco");

  return (
    <div className="flex flex-col min-h-screen p-8">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* ページヘッダー */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("settings.title")}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("settings.subtitle")}
          </p>
        </div>

        <Separator />

        {/* 一般設定 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.general.title")}
            </h2>
          </div>

          {/* 言語設定 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t("settings.general.language.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.general.language.description")}
                  </CardDescription>
                </div>
                <div className="min-w-[200px]">
                  <LanguageSwitcher />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* テーマ設定 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t("settings.general.theme.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.general.theme.description")}
                  </CardDescription>
                </div>
                <div className="min-w-[200px]">
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("settings.general.theme.options.light")}</SelectItem>
                      <SelectItem value="dark">{t("settings.general.theme.options.dark")}</SelectItem>
                      <SelectItem value="system">{t("settings.general.theme.options.system")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* コンパクト表示 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    {t("settings.general.compact.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.general.compact.description")}
                  </CardDescription>
                </div>
                <Switch
                  checked={compactDisplay}
                  onCheckedChange={setCompactDisplay}
                />
              </div>
            </CardHeader>
          </Card>

          {/* 更新の確認 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    {t("settings.general.updates.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.general.updates.description")}
                  </CardDescription>
                </div>
                <Switch
                  checked={checkUpdates}
                  onCheckedChange={setCheckUpdates}
                />
              </div>
            </CardHeader>
          </Card>
        </div>

        <Separator />

        {/* 表示設定 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Monitor className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.display.title")}
            </h2>
          </div>

          {/* 使用統計とツール表示 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t("settings.display.statistics.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.display.statistics.description")}
                  </CardDescription>
                </div>
                <Switch
                  checked={showStatistics}
                  onCheckedChange={setShowStatistics}
                />
              </div>
            </CardHeader>
          </Card>

          {/* スマート検出 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {t("settings.display.smartDetection.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.display.smartDetection.description")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="min-w-[150px]">
                    <Select
                      value={smartDetectionMode}
                      onValueChange={setSmartDetectionMode}
                      disabled={!smartDetection}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">{t("settings.display.smartDetection.options.auto")}</SelectItem>
                        <SelectItem value="manual">{t("settings.display.smartDetection.options.manual")}</SelectItem>
                        <SelectItem value="disabled">{t("settings.display.smartDetection.options.disabled")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Switch
                    checked={smartDetection}
                    onCheckedChange={setSmartDetection}
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Separator />

        {/* エディター設定 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.editor.title")}
            </h2>
          </div>

          {/* テキストエディター */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t("settings.editor.textEditor.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.editor.textEditor.description")}
                  </CardDescription>
                </div>
                <div className="min-w-[200px]">
                  <Select value={textEditor} onValueChange={setTextEditor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monaco">{t("settings.editor.textEditor.options.monaco")}</SelectItem>
                      <SelectItem value="codemirror">{t("settings.editor.textEditor.options.codemirror")}</SelectItem>
                      <SelectItem value="textarea">{t("settings.editor.textEditor.options.textarea")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Separator />

        {/* このアプリについて */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {t("settings.about.title")}
            </h2>
          </div>

          {/* DevToys */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    {t("settings.about.devtoys.label")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("settings.about.devtoys.description")}
                  </CardDescription>
                </div>
                <a
                  href="https://devtoys.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  DevToys
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
