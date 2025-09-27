"use client"

import { useEffect } from "react"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/dach-aut/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dach-aut/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/dach-aut/sidebar"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Loader2 } from "lucide-react"

export function NavUser({
  user
}) {
  const navigate = useNavigate()


const [loading, setLoading] = useState(true);
   // information sur l'entreprise
    const [datas, setDatas] = useState([]);
    // fonction fetchData
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
        setLoading(false);
        setDatas(result);
        // alert("Bienvenue  "+" "+result.entreprise)
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
  
    useEffect(() => {
      fetchData();
    }
    , []);

  const { isMobile } = useSidebar()

  const deconnect = async () => {
    await window.electronAPI.deleteToken();
    // alert("Vous avez été déconnecté.");
    // window.location.reload();
    navigate("/");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                   <span className="truncate font-medium">{loading? (<Loader2 className="animate-spin w-3 h-3" />):(datas.entreprise)} </span>
                   <span className="truncate text-xs">{loading? (<Loader2 className="animate-spin w-3 h-3" />):(datas.numero)}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={deconnect} >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
