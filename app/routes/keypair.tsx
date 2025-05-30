import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";

export function meta() {
  return [
    { title: "Keypair - Symbol DevToys" },
    { name: "description", content: "Generate new keypairs and derive public keys and addresses from private keys." },
  ];
}

export default function Keypair() {
  const { t } = useTranslation();
  const { getNodeUrl, selectedNetwork } = useNetworkSelection();

  const nodeUrl = getNodeUrl();

  return (
    <SidebarInset>
      <PageHeader title={t("keypair.title")} subtitle={t("keypair.subtitle")}>
        <NodeSelector />
      </PageHeader>

      <div className="p-4 space-y-4">{/* コンテンツ部分はここに実装されます */}</div>
    </SidebarInset>
  );
}
