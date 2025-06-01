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
import type { Route } from "./+types/block";

import ky from "ky";

import BlockRequestSchema, { type BlockRequestSchemaType } from "~/schemas/block-request";

export function meta() {
  return [
    { title: "Block - Symbol DevToys" },
    { name: "description", content: "Query the network by block hash or number to retrieve block information." },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  // const entries = Object.fromEntries(formData);
  const nodeUrl = String(formData.get("node-url"));
  const identifier = Number(formData.get("identifier"));
  const entries: BlockRequestSchemaType = { nodeUrl, identifier };

  const submission = BlockRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const url = `${nodeUrl}/blocks/${identifier}`;
  const response = await ky.get(url, { throwHttpErrors: false });

  if (!response.ok) {
    const body = await response.json<{ code: string; message: string }>();
    return data({ errors: [body] }, { status: response.status });
  }

  const blockInfo: BlockInfo = await response.json();

  return {
    result: blockInfo,
  };
}

interface BlockInfo {
  [key: string]: any;
}

export default function Block() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<{ result?: string; errors?: { message: string }[] }>();
  const busy = fetcher.state !== "idle";

  const [identifier, setIdentifier] = useState("1");

  return (
    <SidebarInset>
      <PageHeader title={t("block.title")} subtitle={t("block.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Block Information</CardTitle>
            <CardDescription>Retrieve block information from the {selectedNetwork} network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="identifier">Block Number</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="number"
                  min={1}
                  id="identifier"
                  name="identifier"
                  placeholder=""
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={busy}
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
              <Label htmlFor="block-result">Block Information (JSON)</Label>
              <Textarea
                id="block-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="Block information will be displayed here"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
