import { useTranslation } from "react-i18next";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";
import { useNetworkSelection } from "~/hooks/use-network-selection";
import { NodeSelector } from "~/components/node-selector";

export function meta() {
  return [
    { title: "手数料計算機 - Symbol DevToys" },
    { name: "description", content: "構築したトランザクションの手数料を試算する計算機です。" },
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

      <div className="p-4 space-y-4">{/* コンテンツ部分はここに実装されます */}</div>
    </SidebarInset>
  );
}
