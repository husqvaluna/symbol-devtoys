import { useState } from "react";
import { data, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import type { NamespaceClientActionArgs, NamespaceClientActionData } from "./+types/namespace";

import ky from "ky";

import NamespaceRequestSchema, { type NamespaceRequestSchemaType } from "~/schemas/namespace-request";

export function meta() {
  return [
    { title: "ネームスペース - Symbol DevToys" },
    { name: "description", content: "ネームスペースIDでネットワークに問い合わせて、ネームスペース情報を取得します。" },
  ];
}

export async function clientAction({ request }: NamespaceClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const namespaceId = String(formData.get("namespaceId"));
  const entries: NamespaceRequestSchemaType = { nodeUrl, namespaceId };

  const submission = NamespaceRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const url = `${nodeUrl}/namespaces/${namespaceId}`;
  const response = await ky.get(url, { throwHttpErrors: false });

  if (!response.ok) {
    const body = await response.json<{ code: string; message: string }>();
    return data({ errors: [body] }, { status: response.status });
  }

  const namespaceInfo: NamespaceInfo = await response.json();

  return {
    result: namespaceInfo,
  };
}

interface NamespaceInfo {
  [key: string]: any;
}

export default function Namespace() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<NamespaceClientActionData>();
  const busy = fetcher.state !== "idle";

  const [namespaceId, setNamespaceId] = useState("");

  return (
    <SidebarInset>
      <PageHeader title={t("namespace.title")} subtitle={t("namespace.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>ネームスペース情報取得</CardTitle>
            <CardDescription>{selectedNetwork}ネットワークからネームスペース情報を取得します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="namespaceId">ネームスペースID</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="namespaceId"
                  name="namespaceId"
                  placeholder="ex: E74B99BA41F4AFEE"
                  pattern="[a-fA-F\d]+"
                  maxLength={64}
                  value={namespaceId}
                  onChange={(e) => setNamespaceId(e.target.value)}
                  disabled={busy}
                  className="font-mono"
                />
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

            <div className="space-y-2">
              <Label htmlFor="namespace-result">ネームスペース情報（JSON）</Label>
              <Textarea
                id="namespace-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="ネームスペース情報がここに表示されます"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
