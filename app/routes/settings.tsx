import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import type { Route } from "./+types/settings";
import { useToast } from "~/components/ui/toast-provider";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { LanguageSwitcher } from "~/components/language-switcher";
import { parseNodeUrls, formatNodeUrls, type NodeSettings, DEFAULT_SETTINGS } from "~/lib/node-settings";
import { nodeSettingsAtom } from "~/atoms/network-atoms";
import { Globe, ExternalLink, Server, Save, RotateCcw, Sparkles } from "lucide-react";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Symbol DevToys - 設定" }, { name: "description", content: "Symbol DevToys の設定ページ" }];
}

export default function Settings() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // ノード設定の状態管理（jotai使用）
  const [nodeSettings, setNodeSettings] = useAtom(nodeSettingsAtom);
  const [activeNetworkTab, setActiveNetworkTab] = useState("testnet");
  const [testnetUrls, setTestnetUrls] = useState("");
  const [mainnetUrls, setMainnetUrls] = useState("");

  // ノード設定の初期化
  useEffect(() => {
    setTestnetUrls(formatNodeUrls(nodeSettings.testnet));
    setMainnetUrls(formatNodeUrls(nodeSettings.mainnet));
  }, [nodeSettings]);

  // ノード設定の保存
  const handleSaveNodeSettings = () => {
    const newSettings: NodeSettings = {
      testnet: parseNodeUrls(testnetUrls),
      mainnet: parseNodeUrls(mainnetUrls),
    };
    setNodeSettings(newSettings);

    // Toastメッセージを表示
    addToast({
      title: t("settings.nodes.toast.saved"),
      variant: "success",
      duration: 3000,
    });
  };

  // ノード設定のリセット
  const handleResetNodeSettings = () => {
    setNodeSettings(DEFAULT_SETTINGS);
    setTestnetUrls(formatNodeUrls(DEFAULT_SETTINGS.testnet));
    setMainnetUrls(formatNodeUrls(DEFAULT_SETTINGS.mainnet));

    // Toastメッセージを表示
    addToast({
      title: t("settings.nodes.toast.reset"),
      variant: "success",
      duration: 3000,
    });
  };

  return (
    <SidebarInset>
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <div className="w-full p-4">
        <div className="space-y-2">
          {/* 一般設定 */}
          <div className="space-y-2">
            <div className="flex items-center">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t("settings.general.title")}</h2>
            </div>

            {/* 言語設定 */}
            <Card>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{t("settings.general.language.label")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.general.language.description")}</p>
                  </div>
                  <LanguageSwitcher />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ノード設定 */}
          <div className="space-y-2">
            <div className="flex items-center">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t("settings.nodes.title")}</h2>
            </div>

            <Card>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Server className="h-4 w-4 flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{t("settings.nodes.title")}</p>
                      <p className="text-xs text-muted-foreground">{t("settings.nodes.description")}</p>
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
                          <p className="text-xs text-muted-foreground">{t("settings.nodes.testnet.description")}</p>
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
                          <p className="text-xs text-muted-foreground">{t("settings.nodes.mainnet.description")}</p>
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
                      <Button onClick={handleSaveNodeSettings} size="sm" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {t("settings.nodes.save")}
                      </Button>
                      <Button onClick={handleResetNodeSettings} variant="outline" size="sm" className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        {t("settings.nodes.reset")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* このアプリについて */}
          <div className="space-y-2">
            <div className="flex items-center">
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">{t("settings.about.title")}</h2>
            </div>

            {/* DevToys */}
            <Card>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Sparkles className="h-4 w-4 flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{t("settings.about.devtoys.label")}</p>
                      <p className="text-xs text-muted-foreground">{t("settings.about.devtoys.description")}</p>
                    </div>
                    <ul>
                      {[
                        { to: "https://github.com/symbol/symbol", label: "symbol/symbol" },
                        { to: "https://docs.symbol-community.com/category/v3", label: "Symbol Community Documents" },
                        { to: "https://qiita.com/tags/symbol", label: "Qiita - Symbol" },
                        { to: "https://devtoys.app/", label: "DevToys" },
                      ].map(({ to, label }) => (
                        <li key={to}>
                          <Link
                            to={to}
                            target="_blank"
                            className="inline-flex items-center gap-1 p-2 text-sm hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            {label}
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
