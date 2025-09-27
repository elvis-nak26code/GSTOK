import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Package,
  Repeat,
  Clock,
  PlusCircle,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/dachboard/nav-main"
import { NavProjects } from "@/components/dachboard/nav-projects"
import { NavUser } from "@/components/dachboard/nav-user"
import { TeamSwitcher } from "@/components/dachboard/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/dach-aut/sidebar"


import { useState,useEffect } from "react"

export function AppSidebar({
  ...props
}) {


// This is sample data.
  const data = {
    dashbord: [
      {
        title: "DASHBOARD",
        url: "#",
        icon: Package,
        isActive: true,
        items: [
          {
            title: "Vue d'ensemble",
            url: "/",
          }
        ],
      }
    ],
    user: {
      name: "shadcnbb",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
  
      
      {
        name:  "Mon Entreprise",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "ENTEE SORTIE",
        url: "#",
        icon: Repeat,
        isActive: true,
        items: [
          {
            title: "Enregistrement de stock",
            url: "et",
          },
          {
            title: "Vendre",
            url: "st",
          }
        ],
      },
      {
        title: "GESTION STOCKS",
        url: "#",
        icon: Package,
        isActive: true,
        items: [
          {
            title: "List les produits ",
            url: "ls",
          },
          {
            title: "Augmenter ou modifier le stock",
            url: "ls",
          }
        ],
      },
      
      {
        title: "HISTORIQUE",
        url: "#",
        icon: Clock,
        isActive: true,
        items: [
          {
            title: "Historique des entrées",
            url: "het",
          },
          {
            title: "Historique des sorties",
            url: "hst",
          }
        ],
      },
      {
        title: "PLUS",
        url: "#",
        icon: PlusCircle,
        isActive: true,
        items: [
          {
            title: "Fournisseurs",
            url: "fr",
          },
          {
            title: "Credit actifs",
            url: "cr",
          }
        ],
      },
    ],
    projects: [
      
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props} className="bg-amber-900">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.dashbord} />
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
