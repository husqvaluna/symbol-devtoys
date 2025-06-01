import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

import { utils } from "symbol-sdk";
import { SymbolTransactionFactory, models } from "symbol-sdk/symbol";

export function meta() {
  return [
    { title: "Payload - Symbol DevToys" },
    { name: "description", content: "Decode payload hexadecimal strings to represent transaction content." },
  ];
}

function restore(hexPayload: string): models.Transaction {
  const transaction = SymbolTransactionFactory.deserialize(utils.hexToUint8(hexPayload));
  return transaction;
}

export default function Payload() {
  const { t } = useTranslation();

  const [payload, setPayload] = useState("");

  let readable = "";
  try {
    readable = JSON.stringify(restore(payload).toJson(), null, 2);
  } catch (e: any) {}

  return (
    <SidebarInset>
      <PageHeader title={t("payload.title")} subtitle={t("payload.subtitle")}></PageHeader>

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Payload Decode</CardTitle>
            <CardDescription>Decode hexadecimal payload to get transaction information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payload">Payload (Hex)</Label>
              <Textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Enter hexadecimal payload here"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-result">Transaction Information (JSON)</Label>
              <Textarea
                id="transaction-result"
                value={readable}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-gray-50 dark:bg-gray-800"
                placeholder="Transaction information will be displayed here"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
