import { useState } from "react";
import { data, useFetcher } from "react-router";
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
import type { TransactionClientActionArgs } from "./+types/transaction";

import ky from "ky";

import TransactionRequestSchema, { type TransactionRequestSchemaType } from "~/schemas/transaction-request";

export function meta() {
  return [
    { title: "トランザクション - Symbol DevToys" },
    { name: "description", content: "トランザクションIDまたはハッシュでネットワークに問い合わせて、トランザクション情報を取得します。" },
  ];
}

export async function clientAction({ request }: TransactionClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const transactionId = String(formData.get("transactionId"));
  const entries: TransactionRequestSchemaType = { nodeUrl, transactionId };

  const submission = TransactionRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const url = `${nodeUrl}/transactions/confirmed/${transactionId}`;
  const response = await ky.get(url, { throwHttpErrors: false });

  if (!response.ok) {
    const body = await response.json<{ code: string; message: string }>();
    return data({ errors: [body] }, { status: response.status });
  }

  const transactionInfo: TransactionInfo = await response.json();

  return {
    result: transactionInfo,
  };
}

interface TransactionInfo {
  [key: string]: any;
}

export default function Transaction() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<{ result?: string; errors?: { message: string }[] }>();
  const busy = fetcher.state !== "idle";

  const [transactionId, setTransactionId] = useState("");

  return (
    <SidebarInset>
      <PageHeader title={t("transaction.title")} subtitle={t("transaction.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>トランザクション情報取得</CardTitle>
            <CardDescription>{selectedNetwork}ネットワークからトランザクション情報を取得します</CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="transactionId">トランザクションIDまたはハッシュ</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  placeholder="例: 0000000000000000000000000000000000000000000000000000000000000000"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  disabled={busy}
                  className="font-mono"
                />
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
            <div className="mt-4 space-y-2">
              <Label htmlFor="transaction-result">トランザクション情報（JSON）</Label>
              <Textarea
                id="transaction-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="トランザクション情報がここに表示されます"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
