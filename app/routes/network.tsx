import { useState, useEffect } from "react";
import { data, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import type { Route } from "./+types/block";

import ky from "ky";
import { z } from "zod";

const NetworkRequestSchema = z.object({
  nodeUrl: z.string().url("有効なURLを入力してください。"),
});

type NetworkRequestSchemaType = z.infer<typeof NetworkRequestSchema>;

const API_ENDPOINTS = ["", "fees/rental", "fees/transaction", "properties"];

export function meta() {
  return [{ title: "ネットワーク - Symbol DevToys" }, { name: "description", content: "Symbolネットワークの情報を取得・表示します。" }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const entries: NetworkRequestSchemaType = { nodeUrl };

  const submission = NetworkRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const results: { [key: string]: any } = {};
  const errors: { message: string }[] = [];

  await Promise.all(
    API_ENDPOINTS.map(async (endpoint) => {
      const url = `${nodeUrl}/network${endpoint ? "/" + endpoint : ""}`;
      try {
        const response = await ky.get(url, { throwHttpErrors: false });
        if (!response.ok) {
          const body = await response.json<{ code: string; message: string }>();
          errors.push({ message: `/${endpoint || "network"}: ${body.message || response.statusText}` });
        } else {
          results[endpoint || "network"] = await response.json();
        }
      } catch (e: any) {
        errors.push({ message: `/${endpoint || "network"}: ${e.message}` });
      }
    }),
  );

  if (errors.length > 0) {
    return data({ errors }, { status: 500 });
  }

  return {
    result: results,
  };
}

interface NetworkInfo {
  [key: string]: any;
}

// エンドポイントの日本語ラベルマッピング
const ENDPOINT_LABELS: { [key: string]: string } = {
  "": "ネットワークタイプ",
  "fees/rental": "レンタル料金情報",
  "fees/transaction": "トランザクション料金情報",
  properties: "ネットワークプロパティ",
};

export default function Network() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<{ result?: NetworkInfo; errors?: { message: string }[] }>();
  const busy = fetcher.state !== "idle";

  const [results, setResults] = useState<NetworkInfo>({});

  // fetcher.dataが更新されたときにresultsを更新
  useEffect(() => {
    if (fetcher.data?.result) {
      setResults(fetcher.data.result);
    }
  }, [fetcher.data]);

  return (
    <SidebarInset>
      <PageHeader title={t("network.title")} subtitle={t("network.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>ネットワーク情報取得</CardTitle>
            <CardDescription>{selectedNetwork}ネットワークの情報を取得します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <input name="node-url" type="hidden" value={nodeUrl || ""} />
              <div className="flex w-full space-x-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "取得中..." : "取得"}
                </Button>
              </div>
            </fetcher.Form>

            {fetcher.data?.errors && (
              <Alert variant="destructive">
                <AlertTitle>取得エラー</AlertTitle>
                <AlertDescription>
                  <ul className="list-inside list-disc text-sm">
                    {fetcher.data.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600 dark:text-red-400">
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {API_ENDPOINTS.map((endpoint) => {
                const key = endpoint || "network";
                const label = ENDPOINT_LABELS[endpoint];
                return (
                  <div key={endpoint} className="space-y-2">
                    <Label htmlFor={`network-result-${key}`}>{label}（JSON）</Label>
                    <Textarea
                      id={`network-result-${key}`}
                      value={results[key] ? JSON.stringify(results[key], null, 2) : busy ? "取得中..." : "情報がここに表示されます"}
                      readOnly
                      className="min-h-[150px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                      placeholder="情報がここに表示されます"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
