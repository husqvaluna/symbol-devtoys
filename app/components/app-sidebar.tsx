import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import {
  Home,
  Key,
  User,
  Monitor,
  Tag,
  Grid3X3,
  Box,
  ArrowLeftRight,
  Server,
  Network,
  FileText,
  Calculator,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar"
import { LanguageSwitcher } from "~/components/language-switcher"

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
    icon: ArrowLeftRight,
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
]

export function AppSidebar() {
  const { state } = useSidebar()
  const { t } = useTranslation()
  const menuItems = getMenuItems(t)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between p-2">
        {state !== "collapsed" && <LanguageSwitcher />}
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="pt-0">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.titleKey}>
              <SidebarMenuButton
                asChild
                tooltip={state === "collapsed" ? item.title : undefined}
                className="h-10 px-2"
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
              tooltip={state === "collapsed" ? t("menu.settings") : undefined}
              className="h-10 px-2"
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span>{t("menu.settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
