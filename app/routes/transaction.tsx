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

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>トランザクション情報取得</CardTitle>
            <CardDescription>{selectedNetwork}ネットワークからトランザクション情報を取得します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="transaction-id">トランザクションIDまたはハッシュ</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="transaction-id"
                  name="transaction-id"
                  pattern="[a-fA-F\d]+"
                  maxLength={64}
                  placeholder="ex: 0000000000000000000000000000000000000000000000000000000000000000"
                  autoFocus
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
              <Label htmlFor="result">トランザクション情報（JSON）</Label>
              <Textarea
                id="result"
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
