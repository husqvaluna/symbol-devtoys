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

import ky from "ky";

import { mosaicRequestSchema } from "../schemas/mosaic-request";
import type { MosaicClientActionArgs, MosaicClientActionData } from "./+types/mosaic";

export function meta() {
  return [
    { title: "Mosaic - Symbol DevToys" },
    { name: "description", content: "Query the network by mosaic ID to retrieve mosaic information." },
  ];
}

export async function clientAction({ request }: MosaicClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const mosaicId = String(formData.get("mosaicId"));
  const entries = { nodeUrl, mosaicId };

  const submission = mosaicRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const url = `${nodeUrl}/mosaics/${mosaicId}`;
  const response = await ky.get(url, { throwHttpErrors: false });

  if (!response.ok) {
    const body = await response.json<{ code: string; message: string }>();
    return data({ errors: [body] }, { status: response.status });
  }

  const mosaicInfo: MosaicInfo = await response.json();

  return {
    result: mosaicInfo,
  };
}

interface MosaicInfo {
  [key: string]: any;
}

export default function Mosaic() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<MosaicClientActionData>();
  const busy = fetcher.state !== "idle";

  const [mosaicId, setMosaicId] = useState("");

  return (
    <SidebarInset>
      <PageHeader title={t("mosaic.title")} subtitle={t("mosaic.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Mosaic Information</CardTitle>
            <CardDescription>Retrieve mosaic information from the {selectedNetwork} network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="mosaicId">Mosaic ID</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="mosaicId"
                  name="mosaicId"
                  placeholder="ex: 0DC67FBE1CAD29E3"
                  value={mosaicId}
                  onChange={(e) => setMosaicId(e.target.value)}
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
              <Label htmlFor="mosaic-result">Mosaic Information (JSON)</Label>
              <Textarea
                id="mosaic-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="Mosaic information will be displayed here"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
