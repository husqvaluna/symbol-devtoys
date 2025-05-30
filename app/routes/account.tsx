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
import type { Route } from "./+types/account";

import ky from "ky";

import AccountRequestSchema, { type AccountRequestSchemaType } from "~/schemas/account-request";

export function meta() {
  return [
    { title: "アカウント - Symbol DevToys" },
    { name: "description", content: "アカウントIDでネットワークに問い合わせて、アカウント情報を取得します。" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const accountId = String(formData.get("accountId"));
  const entries: AccountRequestSchemaType = { nodeUrl, accountId };

  const submission = AccountRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const url = `${nodeUrl}/accounts/${accountId}`;
  const response = await ky.get(url, { throwHttpErrors: false });

  if (!response.ok) {
    const body = await response.json<{ code: string; message: string }>();
    return data({ errors: [body] }, { status: response.status });
  }

  const accountInfo: AccountInfo = await response.json();

  return {
    result: accountInfo,
  };
}

interface AccountInfo {
  [key: string]: any;
}

export default function Account() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<{ result?: string; errors?: { message: string }[] }>();
  const busy = fetcher.state !== "idle";

  const [accountId, setAccountId] = useState("");

  return (
    <SidebarInset>
      <PageHeader title={t("account.title")} subtitle={t("account.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>アカウント情報取得</CardTitle>
            <CardDescription>{selectedNetwork}ネットワークからアカウント情報を取得します</CardDescription>
          </CardHeader>
          <CardContent>
            <fetcher.Form method="post">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="accountId">アカウントID（公開鍵またはアドレス）</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="accountId"
                  name="accountId"
                  placeholder="例: TCIFSMQZAX3IDPHUP2RTXP26N6BJRNKEBBKP33I"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
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
              <Label htmlFor="account-result">アカウント情報（JSON）</Label>
              <Textarea
                id="account-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="アカウント情報がここに表示されます"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
