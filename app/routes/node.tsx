import { useState, useEffect } from "react";
import { data, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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

const NodeRequestSchema = z.object({
  nodeUrl: z.string().url("有効なURLを入力してください。"),
});

type NodeRequestSchemaType = z.infer<typeof NodeRequestSchema>;

const API_ENDPOINTS = ["health", "info", "peers", "storage", "time", "server", "unlockedaccount"];

export function meta() {
  return [{ title: "ノード - Symbol DevToys" }, { name: "description", content: "ノードホストURLからノード情報を取得します。" }];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const entries: NodeRequestSchemaType = { nodeUrl };

  const submission = NodeRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const results: { [key: string]: any } = {};
  const errors: { message: string }[] = [];

  await Promise.all(
    API_ENDPOINTS.map(async (endpoint) => {
      const url = `${nodeUrl}/node/${endpoint}`;
      try {
        const response = await ky.get(url, { throwHttpErrors: false });
        if (!response.ok) {
          const body = await response.json<{ code: string; message: string }>();
          errors.push({ message: `/${endpoint}: ${body.message || response.statusText}` });
        } else {
          results[endpoint] = await response.json();
        }
      } catch (e: any) {
        errors.push({ message: `/${endpoint}: ${e.message}` });
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

interface NodeInfo {
  [key: string]: any;
}

export default function Node() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<{ result?: NodeInfo; errors?: { message: string }[] }>();
  const busy = fetcher.state !== "idle";

  const [results, setResults] = useState<NodeInfo>({});

  // fetcher.dataが更新されたときにresultsを更新
  useEffect(() => {
    if (fetcher.data?.result) {
      setResults(fetcher.data.result);
    }
  }, [fetcher.data]);

  return (
    <SidebarInset>
      <PageHeader title={t("node.title")} subtitle={t("node.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ノード情報取得</CardTitle>
            <CardDescription>{selectedNetwork}ネットワークのノード情報を取得します</CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post">
              <input name="node-url" type="hidden" value={nodeUrl || ""} />
              <div className="flex w-full space-x-2">
                <Button type="submit" disabled={busy}>
                  {busy ? "取得中..." : "取得"}
                </Button>
              </div>
            </fetcher.Form>

            {/* エラー表示 */}
            {fetcher.data?.errors && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                {fetcher.data.errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                  </p>
                ))}
              </div>
            )}

            {/* 結果表示 */}
            <div className="mt-4 space-y-4">
              {API_ENDPOINTS.map((endpoint) => (
                <div key={endpoint} className="space-y-2">
                  <Label htmlFor={`node-result-${endpoint}`}>/{endpoint} 情報（JSON）</Label>
                  <Textarea
                    id={`node-result-${endpoint}`}
                    value={results[endpoint] ? JSON.stringify(results[endpoint], null, 2) : busy ? "取得中..." : "情報がここに表示されます"}
                    readOnly
                    className="min-h-[150px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                    placeholder="情報がここに表示されます"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
