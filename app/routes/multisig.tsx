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
import type { Route } from "./+types/multisig";

import ky from "ky";

import MultisigRequestSchema, { type MultisigRequestSchemaType } from "~/schemas/multisig-request";
import { graph2tree, renderAscii, renderMermaid, type MultisigLayer } from "~/lib/graph2tree";

export function meta() {
  return [
    { title: "Multisig - Symbol DevToys" },
    { name: "description", content: "Query the network by address to retrieve multisig account graph information." },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const nodeUrl = String(formData.get("node-url"));
  const address = String(formData.get("address"));
  const entries: MultisigRequestSchemaType = { nodeUrl, address };

  const submission = MultisigRequestSchema.safeParse(entries);

  if (submission.success === false) {
    return data({ errors: submission.error.errors }, { status: 400 });
  }

  const url = `${nodeUrl}/account/${address}/multisig/graph`;
  const response = await ky.get(url, { throwHttpErrors: false });

  if (!response.ok) {
    const body = await response.json<{ code: string; message: string }>();
    return data({ errors: [body] }, { status: response.status });
  }

  const multisigGraph: MultisigLayer[] = await response.json();

  const tree = graph2tree(multisigGraph);
  const asciiOutput = renderAscii(tree, { readableAddress: true });
  // const mermaidOutput = renderMermaid(tree);

  return {
    result: multisigGraph,
    asciiOutput,
  };
}

interface MultisigGraph {
  [key: string]: any;
}

export default function Multisig() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  const fetcher = useFetcher<{ result?: MultisigGraph; asciiOutput?: string; errors?: { message: string }[] }>();
  const busy = fetcher.state !== "idle";

  const [address, setAddress] = useState("");

  return (
    <SidebarInset>
      <PageHeader title={t("multisig.title")} subtitle={t("multisig.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Multisig Account Graph</CardTitle>
            <CardDescription>Retrieve multisig account graph information from the {selectedNetwork} network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <Input name="node-url" type="hidden" value={nodeUrl || ""} />
              <Label htmlFor="address">Address</Label>
              <div className="flex w-full space-x-2">
                <Input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="ex: TADP6C2GVEG654OP5LZI32P2GYJSCMEGQBYB7QY"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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

            {fetcher.data?.asciiOutput && (
              <div className="space-y-2">
                <Label htmlFor="tree-output">Multisig Account Tree</Label>
                <Textarea
                  id="tree-output"
                  value={fetcher.data.asciiOutput}
                  readOnly
                  className="min-h-[200px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                  placeholder="Multisig account tree will be displayed here"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="multisig-result">Multisig Graph Information (JSON)</Label>
              <Textarea
                id="multisig-result"
                value={JSON.stringify(fetcher.data?.result, null, 2)}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="Multisig graph information will be displayed here"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
