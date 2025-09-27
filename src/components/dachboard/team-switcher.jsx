import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dach-aut/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/dach-aut/sidebar"
import { useState } from "react"
import { Loader2 } from "lucide-react"
export function TeamSwitcher({
  teams
}) {
   // information sur l'entreprise
  const [datas, setDatas] = useState([]);
  // fonction fetchData

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await window.electronAPI.getToken();
      if (!token) throw new Error("Token non disponible");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur lors de la récupération des données");
      const result = await response.json();
      setDatas(result);
      setLoading(false)
      // alert("Bienvenue  "+" "+result.entreprise)
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (


    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div
                className=" text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg bg-purple-900">
                <p className="font-extrabold text-xl">$</p>
                
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xl font-extrabold overflow-hidden">{loading? (<Loader2 className="animate-spin w-3 h-3" />):(datas.entreprise)}</span>
                <span className="truncate text-xs">{loading? (<Loader2 className="animate-spin w-3 h-3" />):(datas.numero)}</span>
              </div>
              {/* <ChevronsUpDown className="ml-auto" /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
