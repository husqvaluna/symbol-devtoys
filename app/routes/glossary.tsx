import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { SidebarInset } from "~/components/ui/sidebar";
import { PageHeader } from "~/components/page-header";

export function meta() {
  return [{ title: "Glossary - Symbol DevToys" }, { name: "description", content: "" }];
}

export default function Glossary() {
  const { t } = useTranslation();

  return (
    <SidebarInset>
      <PageHeader title={t("glossary.title")} subtitle={t("glossary.subtitle")} />

      <div className="w-full p-4">
        <div className="space-y-6">
          <Card className="w-full">
            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
