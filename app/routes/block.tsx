import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";

export function meta() {
  return [
    { title: "ブロック - Symbol DevToys" },
    { name: "description", content: "ブロックハッシュまたは番号でネットワークに問い合わせて、ブロック情報を取得します。" },
  ];
}

interface BlockInfo {
  [key: string]: any;
}

export default function Block() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const [identifier, setIdentifier] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 入力値の検証
  const validateIdentifier = (value: string): boolean => {
    if (!value.trim()) return false;

    // ブロック番号（数値）の場合
    if (/^\d+$/.test(value)) {
      return true;
    }

    // ブロックハッシュ（64文字の16進数）の場合
    if (/^[0-9A-Fa-f]{64}$/.test(value)) {
      return true;
    }

    return false;
  };

  const fetchBlockInfo = async () => {
    if (!validateIdentifier(identifier)) {
      setError("ブロック番号（数値）またはブロックハッシュ（64文字の16進数）を入力してください。");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const nodeUrl = getNodeUrl();
      if (!nodeUrl) {
        throw new Error(`${selectedNetwork}ネットワークの利用可能なノードが見つかりません。設定を確認してください。`);
      }

      const apiUrl = `${nodeUrl}/blocks/${identifier}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("指定されたブロックが見つかりません。");
        } else if (response.status >= 500) {
          throw new Error("サーバーエラーが発生しました。しばらく時間をおいて再試行してください。");
        } else {
          throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
        }
      }

      const blockInfo: BlockInfo = await response.json();
      setResult(JSON.stringify(blockInfo, null, 2));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("ネットワークエラーが発生しました。接続を確認してください。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlockInfo();
  };

  return (
    <SidebarInset>
      <PageHeader title={t("block.title")} subtitle={t("block.subtitle")} />

      <div className="w-full p-4">
        <div className="space-y-6">
          {/* ノード選択 */}
          <Card className="w-full">
            <CardContent>
              <NodeSelector />
            </CardContent>
          </Card>

          {/* ブロック情報取得 */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>ブロック情報取得</CardTitle>
              <CardDescription>
                ブロック番号またはブロックハッシュを入力して、{selectedNetwork}ネットワークからブロック情報を取得します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Label htmlFor="block-identifier">ブロック番号またはブロックハッシュ</Label>
                <div className="flex w-full space-x-2">
                  <Input
                    id="block-identifier"
                    type="text"
                    placeholder="例: 123456 または 1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading || !identifier.trim()} className="w-full md:w-auto">
                    {isLoading ? "取得中..." : "取得"}
                  </Button>
                </div>
              </form>

              {/* エラー表示 */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* 結果表示 */}
              {result && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="block-result">ブロック情報（JSON）</Label>
                  <Textarea
                    id="block-result"
                    value={result}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                    placeholder="ブロック情報がここに表示されます"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
