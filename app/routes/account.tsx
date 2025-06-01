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
import type { Route } from "./+types/account";

import ky from "ky";

import AccountRequestSchema, { type AccountRequestSchemaType } from "~/schemas/account-request";

export function meta() {
  return [
    { title: "Account - Symbol DevToys" },
    { name: "description", content: "Query the network by account ID to retrieve account information." },
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

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Account Information</CardTitle>
            <CardDescription>Retrieve account information from the {selectedNetwork} network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="accountId">Account ID (Public Key or Address)</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="accountId"
                  name="accountId"
                  placeholder="ex: TCIFSMQZAX3IDPHUP2RTXP26N6BJRNKEBBKP33I"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  disabled={busy}
                  className="font-mono"
                />
                <Button type="submit" disabled={busy}>
                  {busy ? "Fetching..." : "Fetch"}
                </Button>
              </div>
            </fetcher.Form>

            {fetcher.data?.errors && (
              <Alert variant="destructive">
                <AlertTitle>Fetch Error</AlertTitle>
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
              <Label htmlFor="account-result">Account Information (JSON)</Label>
              <Textarea
                id="account-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="Account information will be displayed here"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
