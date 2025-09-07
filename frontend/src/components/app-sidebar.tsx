import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  ChartBarStacked,
  Home,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Isaac Salazar",
    email: "isaacsalazar9911@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Lagartos",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Division",
      url: "/admin/division",
      icon: Frame,
    },
    {
      name: "Team",
      url: "/admin/team",
      icon: PieChart,
    },
    {
      name: "Players",
      url: "/admin/player",
      icon: Map,
    },
    {
      name: "Player Team",
      url: "/admin/playerTeam",
      icon: Map,
    },
    {
      name: "Game",
      url: "/admin/game",
      icon: Map,
    },
    {
      name: "Statistics",
      url: "/admin/statistics",
      icon: ChartBarStacked,
    },
    {
      name: "Home",
      url: "/home",
      icon: Home,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
