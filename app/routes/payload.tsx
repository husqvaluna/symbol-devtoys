import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";

export function meta() {
  return [
    { title: "Payload - Symbol DevToys" },
    { name: "description", content: "Decode payload hexadecimal strings to represent transaction content." },
  ];
}

export default function Payload() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  return (
    <SidebarInset>
      <PageHeader title={t("payload.title")} subtitle={t("payload.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">{/* コンテンツ部分はここに実装されます */}</div>
    </SidebarInset>
  );
}
