import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";

export function meta() {
  return [
    { title: "Fee Calculator - Symbol DevToys" },
    { name: "description", content: "A calculator to estimate the fees for constructed transactions." },
  ];
}

export default function Fee() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  return (
    <SidebarInset>
      <PageHeader title={t("fee.title")} subtitle={t("fee.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">{/* Content section will be implemented here */}</div>
    </SidebarInset>
  );
}
