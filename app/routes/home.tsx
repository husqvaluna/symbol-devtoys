import { useTranslation } from "react-i18next";
import type { Route } from "./+types/home";
import SymbolLogo from "~/components/symbol-logo";
import { SidebarInset } from "~/components/ui/sidebar";

export function meta({}: Route.MetaArgs) {
  // Note: useTranslation cannot be used within meta function,
  // it is recommended to use i18n instance in loader for actual projects
  return [{ title: "Symbol DevToys" }, { name: "description", content: "Symbol DevToys" }];
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <SidebarInset>
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{t("home.title")}</h1>
          <p className="text-center">
            <SymbolLogo size={128} />
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">{t("home.subtitle")}</p>
        </div>
      </div>
    </SidebarInset>
  );
}
