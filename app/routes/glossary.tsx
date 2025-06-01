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

      <div className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>Resources for development.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-inside list-disc text-sm">
              {[
                { url: "https://symbol.github.io/symbol-openapi/v1.0.4/", title: "Catapult REST Endpoints (1.0.4)" },
                { url: "https://testnet.symbol.fyi", title: "Symbol Block Explorer" },
                { url: "https://symbol-community.com", title: "Symbol Community" },
              ].map(({ url, title }) => (
                <li key={url} className="text-sm">
                  <a href={url} target="_blank">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
