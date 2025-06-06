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

const NodeRequestSchema = z.object({
  nodeUrl: z.string().url("Please enter a valid URL."),
});

type NodeRequestSchemaType = z.infer<typeof NodeRequestSchema>;

const API_ENDPOINTS = ["health", "info", "peers", "storage", "time", "server", "unlockedaccount"];

export function meta() {
  return [{ title: "Node - Symbol DevToys" }, { name: "description", content: "Retrieve node information from the node host URL." }];
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

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Retrieve Node Information</CardTitle>
            <CardDescription>Retrieve {selectedNetwork} network node information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <fetcher.Form method="post" className="space-y-2">
              <input name="node-url" type="hidden" value={nodeUrl || ""} />
              <div className="flex w-full space-x-2">
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

            <div className="space-y-4">
              {API_ENDPOINTS.map((endpoint) => (
                <div key={endpoint} className="space-y-2">
                  <Label htmlFor={`node-result-${endpoint}`}>/{endpoint} Information (JSON)</Label>
                  <Textarea
                    id={`node-result-${endpoint}`}
                    value={results[endpoint] ? JSON.stringify(results[endpoint], null, 2) : busy ? "取得中..." : "情報がここに表示されます"}
                    readOnly
                    className="min-h-[150px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                    placeholder="Information will be displayed here"
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
