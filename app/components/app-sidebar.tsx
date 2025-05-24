import { Link } from "react-router"
import {
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
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "~/components/ui/sidebar"

const menuItems = [
  {
    title: "キーペア",
    url: "/keypair",
    icon: Key,
  },
  {
    title: "アカウント",
    url: "/account",
    icon: User,
  },
  {
    title: "モニター",
    url: "/monitor",
    icon: Monitor,
  },
  {
    title: "ネームスペース",
    url: "/namespace",
    icon: Tag,
  },
  {
    title: "モザイク",
    url: "/mosaic",
    icon: Grid3X3,
  },
  {
    title: "ブロック",
    url: "/block",
    icon: Box,
  },
  {
    title: "トランザクション",
    url: "/transaction",
    icon: ArrowLeftRight,
  },
  {
    title: "ノード",
    url: "/node",
    icon: Server,
  },
  {
    title: "ネットワーク",
    url: "/network",
    icon: Network,
  },
  {
    title: "ペイロード",
    url: "/payload",
    icon: FileText,
  },
  {
    title: "手数料計算機",
    url: "/fee",
    icon: Calculator,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Symbol DevToys</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
