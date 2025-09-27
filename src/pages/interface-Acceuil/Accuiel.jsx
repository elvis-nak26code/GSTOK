import { AppSidebar } from "@/components/dachboard/app-sidebar"
// import ChartAreaGradient from "./chart"
import Chart from "./chart"
import Card_section from "./section-card"
import Calandar from "./calandar"
import {Button} from "@/components/ui/dach-aut/button"

import LicenceExpiree from "../licence/index"

import { Outlet, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/dach-aut/breadcrumb"

import { Separator } from "@/components/ui/dach-aut/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/dach-aut/sidebar"
// import { size } from "zod"

import { useState } from "react"

export default function Page() {
  const [licence, setLicence] = useState(true)


  const verifilicence = async () => {
    const token = await window.electronAPI.getToken();
    // alert("Token dans page.jsx :"+ token);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/verifLicence`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })
     
      const data = await response.json()

      
      console.log("Licence valide :", data.isvalid);
      
      if(!data.isvalid) {
        setLicence(false)
        return
      }
      setLicence(true)

    } catch (error) {
      console.error("❌ Erreur API :", error)
      setLicence(false)
      alert("Erreur lors de la vérification de la licence ❌" + error)
    }
  }
  useState(() => {
    verifilicence()
  }, [])
   
  return (
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset >
        <header className=" flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
             <div className="flex items-center gap-2 px-4 w-full h-[70%]">
               <SidebarTrigger className="ml-1 bg-purple-900 p-5 text-white " />
               <Separator
                 orientation="vertical"
                 className="mr-2 data-[orientation=vertical]:h-4"
               />
                {/* navbar */}
                   <div className=" w-full h-full flex justify-center items-center font-bold text-xl bg-purple-900 text-white rounded-lg">
                          Gérez vos stocks facilement et suivez vos performances en temps réel
                   </div>
             </div>
        </header>
        <div className=" flex flex-1 flex-col gap-4 p-4 pt-0 ">
             {licence ? <Outlet /> : <LicenceExpiree/>} 
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
