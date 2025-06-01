import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Home,
  Key,
  User,
  Users,
  Monitor,
  Tag,
  Grid3X3,
  TicketCheck,
  Box,
  ArrowLeftRight,
  BookText,
  Server,
  Network,
  FileText,
  Calculator,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarRail,
} from "~/components/ui/sidebar";

import SymbolLogo from "./symbol-logo";

const getMenuItems = (t: (key: string) => string) => [
  {
    titleKey: "menu.home",
    title: t("menu.home"),
    url: "/",
    icon: Home,
  },
  {
    titleKey: "menu.keypair",
    title: t("menu.keypair"),
    url: "/keypair",
    icon: Key,
  },
  {
    titleKey: "menu.account",
    title: t("menu.account"),
    url: "/account",
    icon: User,
  },
  {
    titleKey: "menu.multisig",
    title: t("menu.multisig"),
    url: "/multisig",
    icon: Users,
  },
  {
    titleKey: "menu.monitor",
    title: t("menu.monitor"),
    url: "/monitor",
    icon: Monitor,
  },
  {
    titleKey: "menu.namespace",
    title: t("menu.namespace"),
    url: "/namespace",
    icon: Tag,
  },
  {
    titleKey: "menu.mosaic",
    title: t("menu.mosaic"),
    url: "/mosaic",
    icon: Grid3X3,
  },
  {
    titleKey: "menu.block",
    title: t("menu.block"),
    url: "/block",
    icon: Box,
  },
  {
    titleKey: "menu.transaction",
    title: t("menu.transaction"),
    url: "/transaction",
    icon: TicketCheck,
  },
  {
    titleKey: "menu.node",
    title: t("menu.node"),
    url: "/node",
    icon: Server,
  },
  {
    titleKey: "menu.network",
    title: t("menu.network"),
    url: "/network",
    icon: Network,
  },
  {
    titleKey: "menu.payload",
    title: t("menu.payload"),
    url: "/payload",
    icon: FileText,
  },
  {
    titleKey: "menu.fee",
    title: t("menu.fee"),
    url: "/fee",
    icon: Calculator,
  },
  {
    titleKey: "menu.converter",
    title: t("menu.converter"),
    url: "/converter",
    icon: ArrowLeftRight,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useTranslation();
  const location = useLocation();
  const menuItems = getMenuItems(t);

  // Function to check if current path matches menu item URL
  const isActiveRoute = (url: string) => {
    if (url === "/") {
      // Exact match for homepage
      return location.pathname === "/";
    }
    // For other pages, check if path matches
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SymbolLogo />
              <span>Symbol DevToys</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.titleKey}>
              <SidebarMenuButton
                asChild
                isActive={isActiveRoute(item.url)}
                tooltip={state === "collapsed" ? item.title : undefined}
                className="h-8 px-2"
              >
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActiveRoute("/glossary")}
              tooltip={state === "collapsed" ? t("menu.glossary") : undefined}
              className="h-8 px-2"
            >
              <Link to="/glossary">
                <BookText className="h-4 w-4" />
                <span>{t("menu.glossary")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActiveRoute("/settings")}
              tooltip={state === "collapsed" ? t("menu.settings") : undefined}
              className="h-8 px-2"
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span>{t("menu.settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
