import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "~/components/ui/toast-provider";
import type { Route } from "./+types/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { LanguageSwitcher } from "~/components/language-switcher";
import { getNodeSettings, saveNodeSettings, parseNodeUrls, formatNodeUrls, type NodeSettings } from "~/lib/node-settings";
import {
  Globe,
  Palette,
  Monitor,
  Download,
  BarChart3,
  Zap,
  FileText,
  ExternalLink,
  Settings as SettingsIcon,
  Server,
  Save,
  RotateCcw
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Symbol DevToys - 設定" },
    { name: "description", content: "Symbol DevToys の設定ページ" },
  ];
}

export default function Settings() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // 設定状態の管理
  const [theme, setTheme] = useState("system");
  const [compactDisplay, setCompactDisplay] = useState(false);
  const [checkUpdates, setCheckUpdates] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  const [smartDetection, setSmartDetection] = useState(true);
  const [smartDetectionMode, setSmartDetectionMode] = useState("auto");
  const [textEditor, setTextEditor] = useState("monaco");

  // ノード設定の状態管理
  const [nodeSettings, setNodeSettings] = useState<NodeSettings>({ testnet: [], mainnet: [] });
  const [activeNetworkTab, setActiveNetworkTab] = useState("testnet");
  const [testnetUrls, setTestnetUrls] = useState("");
  const [mainnetUrls, setMainnetUrls] = useState("");

  // ノード設定の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const settings = getNodeSettings();
      setNodeSettings(settings);
      setTestnetUrls(formatNodeUrls(settings.testnet));
      setMainnetUrls(formatNodeUrls(settings.mainnet));
    }
  }, []);

  // ノード設定の保存
  const handleSaveNodeSettings = () => {
    const newSettings: NodeSettings = {
      testnet: parseNodeUrls(testnetUrls),
      mainnet: parseNodeUrls(mainnetUrls),
    };
    setNodeSettings(newSettings);
    saveNodeSettings(newSettings);

    // Toastメッセージを表示
    addToast({
      title: t("settings.nodes.toast.saved"),
      variant: "success",
      duration: 3000
    });
  };

  // ノード設定のリセット
  const handleResetNodeSettings = () => {
    const defaultSettings = {
      testnet: [
        'https://sym-test-01.opening-line.jp:3001',
        'https://sym-test-02.opening-line.jp:3001',
        'https://sym-test-03.opening-line.jp:3001'
      ],
      mainnet: [
        'https://sym-main-01.opening-line.jp:3001',
        'https://sym-main-02.opening-line.jp:3001',
        'https://sym-main-03.opening-line.jp:3001'
      ]
    };
    setNodeSettings(defaultSettings);
    setTestnetUrls(formatNodeUrls(defaultSettings.testnet));
    setMainnetUrls(formatNodeUrls(defaultSettings.mainnet));
    saveNodeSettings(defaultSettings);

    // Toastメッセージを表示
    addToast({
      title: t("settings.nodes.toast.reset"),
      variant: "success",
      duration: 3000
    });
  };

  return (
    <div className="p-4">
      <div className="w-full space-y-2">
        {/* ページヘッダー */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h1 className="font-bold text-gray-900 dark:text-gray-100">{t("settings.title")}</h1>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{t("settings.subtitle")}</p>
        </div>

        {/* 一般設定 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t("settings.general.title")}</h2>
          </div>

          {/* 言語設定 */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.general.language.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.general.language.description")}
                  </p>
                </div>
                <LanguageSwitcher />
              </div>
            </CardContent>
          </Card>

          {/* テーマ設定 */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <Palette className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.general.theme.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.general.theme.description")}
                  </p>
                </div>
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
            </CardContent>
          </Card>

          {/* コンパクト表示 */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <Monitor className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.general.compact.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.general.compact.description")}
                  </p>
                </div>
                <Switch
                  checked={compactDisplay}
                  onCheckedChange={setCompactDisplay}
                />
              </div>
            </CardContent>
          </Card>

          {/* 更新の確認 */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <Download className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.general.updates.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.general.updates.description")}
                  </p>
                </div>
                <Switch
                  checked={checkUpdates}
                  onCheckedChange={setCheckUpdates}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* 表示設定 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {t("settings.display.title")}
            </h2>
          </div>

          {/* 使用統計とツール表示 */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.display.statistics.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.display.statistics.description")}
                  </p>
                </div>
                <Switch
                  checked={showStatistics}
                  onCheckedChange={setShowStatistics}
                />
              </div>
            </CardContent>
          </Card>

          {/* スマート検出 */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <Zap className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.display.smartDetection.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.display.smartDetection.description")}
                  </p>
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
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Editor settings */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {t("settings.editor.title")}
            </h2>
          </div>

          {/* Text editor */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.editor.textEditor.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.editor.textEditor.description")}
                  </p>
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
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* ノード設定 */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {t("settings.nodes.title")}
            </h2>
          </div>

          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-start space-x-4">
                <Server className="h-4 w-4 flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {t("settings.nodes.title")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("settings.nodes.description")}
                    </p>
                  </div>

                  <Tabs value={activeNetworkTab} onValueChange={setActiveNetworkTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="testnet">{t("settings.nodes.testnet.label")}</TabsTrigger>
                      <TabsTrigger value="mainnet">{t("settings.nodes.mainnet.label")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="testnet" className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="testnet-urls" className="text-sm font-medium">
                          {t("settings.nodes.testnet.label")}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t("settings.nodes.testnet.description")}
                        </p>
                        <Textarea
                          id="testnet-urls"
                          placeholder={t("settings.nodes.placeholder")}
                          value={testnetUrls}
                          onChange={(e) => setTestnetUrls(e.target.value)}
                          className="min-h-[120px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="mainnet" className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="mainnet-urls" className="text-sm font-medium">
                          {t("settings.nodes.mainnet.label")}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {t("settings.nodes.mainnet.description")}
                        </p>
                        <Textarea
                          id="mainnet-urls"
                          placeholder={t("settings.nodes.placeholder")}
                          value={mainnetUrls}
                          onChange={(e) => setMainnetUrls(e.target.value)}
                          className="min-h-[120px] font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleSaveNodeSettings}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {t("settings.nodes.save")}
                    </Button>
                    <Button
                      onClick={handleResetNodeSettings}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t("settings.nodes.reset")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* このアプリについて */}
        <div className="space-y-2">
          <div className="flex items-center">
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {t("settings.about.title")}
            </h2>
          </div>

          {/* DevToys */}
          <Card className="rounded-md py-4 w-[650px]">
            <CardContent>
              <div className="flex items-center space-x-4">
                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("settings.about.devtoys.label")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("settings.about.devtoys.description")}
                  </p>
                </div>
                <a
                  href="https://devtoys.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  DevToys
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
