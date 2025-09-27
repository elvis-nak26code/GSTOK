import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import Shariow from "../../assets/icons8-vendre-les-stock-96.png"
import indisponible from "../../assets/icons8-nuage-indisponible-96.png"
import actif from "../../assets/icons8-actif-96.png"
import credit from "../../assets/credit.png"

import { Badge } from "@/components/ui/dashbord/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/dashbord/card"
import { ur } from "zod/v4/locales/index.cjs"




export default function SectionCards() {
  const [loading1, setLoading1] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [loading3, setLoading3] = useState(true)
  const [loading4, setLoading4] = useState(true)


   // valeur total du stock
   const [valeurStock,setValeurStock]=useState(0)
   const valeursTotalStock = async () => { 
   
     try {
      // alert("debut")
       const token = await window.electronAPI.getToken();
       if (!token) {
         throw new Error("Token non disponible");
       }
       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/dashboard/totalStockValue`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         },
       });
       const data = await response.json();
      //  alert("valeur total du stock : " + data.valeurTotale)
       setValeurStock(data.valeurTotale)
       setLoading1(false)
       return data.valeurTotalStock;

     } catch (error) {
       console.error("Erreur lors de la récupération de la valeur totale du stock :", error);
       return 0; // Valeur par défaut en cas d'erreur
     }
    }
    valeursTotalStock()


  //  article critique
  const [Article,setArticle]=useState(0)
   const articleCritique = async () => { 
   
     try {
      // alert("debut")
       const token = await window.electronAPI.getToken();
       if (!token) {
         throw new Error("Token non disponible");
       }
       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/dashboard/criticalItems`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         },
       });
       const data = await response.json();
      //  alert("valeur total du stock : " + data.valeurTotale)
      setArticle(data.nombreArticlesAlerte)
      setLoading2(false)
       return data.nombreArticlesAlerte;

     } catch (error) {
       console.error("Erreur lors de la récupération de des aticles :", error);
       return 0; // Valeur par défaut en cas d'erreur
     }
    }
    articleCritique()



    // Article en stock
    const [ArticleEnStock,setArticleEnStock]=useState(0)
   const articleEnStock = async () => { 
   
     try {
      // alert("debut")
       const token = await window.electronAPI.getToken();
       if (!token) {
         throw new Error("Token non disponible");
       }
       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/dashboard/totalProducts`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         },
       });
       const data = await response.json();
      //  alert("valeur total du stock : " + data.valeurTotale)
      setArticleEnStock(data.nombreTotalArticlesEnStock)
      setLoading3(false)
       return data.nombreTotalArticlesEnStock;

     } catch (error) {
       console.error("Erreur lors de la récupération de des aticles :", error);
       return 0; // Valeur par défaut en cas d'erreur
     }
    }
    articleEnStock()


     // Article en credit
     const [tCredit,setTCredit]=useState(0)
     const [pCredit,setPCredit]=useState(0)
     const crediActif = async () => { 
     
       try {
        // alert("debut")
         const token = await window.electronAPI.getToken();
         if (!token) {
           throw new Error("Token non disponible");
         }
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/dashboard/totalCredits`, {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
           },
         });
         const data = await response.json();
        //  alert("valeur total du stock : " + data.valeurTotale)
        setTCredit(data.nombreTotalCredits)
        setPCredit(data.montantTotalCredits)
        setLoading4(false)
         return data.nombreTotalCredits;
  
       } catch (error) {
         console.error("Erreur lors de la récupération de des aticles :", error);
         return 0; // Valeur par défaut en cas d'erreur
       }
      }
      crediActif()



  return (
    <div className=" *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2 xl:grid-cols-4">
      <Card className="relative p-6 rounded-2xl shadow-lg 
                bg-gradient-to-br from-purple-900 to-purple-950 
                border border-purple-700 
                hover:shadow-xl hover:scale-[1.01] 
                transition-all duration-300">
        <div className="h-[45%] w-[30%] absolute left-[60%] top-[50%]"
         style={{
          backgroundImage: `url(${Shariow})`,
          backgroundSize: "50%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        ></div>
        <CardHeader>
          <CardDescription>Valeur total du stock actuel</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-600">
             {loading1 ? <Loader2 className="mr-2 h-8 w-8 animate-spin" /> : (valeurStock ?? 0).toLocaleString("de-DE") + " F CFA"}
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Pour une meilleur gestion <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Suivie en tempt reel
          </div>
        </CardFooter>
      </Card>

      <Card className="relative p-6 rounded-2xl shadow-lg 
                bg-gradient-to-br from-purple-900 to-purple-950 
                border border-purple-700 
                hover:shadow-xl hover:scale-[1.01] 
                transition-all duration-300">
      <div className="h-[45%] w-[30%] absolute left-[60%] top-[50%]"
         style={{
          backgroundImage: `url(${indisponible})`,
          backgroundSize: "50%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        ></div>
        <CardHeader>
          <CardDescription className="font-extrabold ">Article critique</CardDescription>
          <CardTitle className="text-2xl text-red-600  tabular-nums @[250px]/card:text-3xl font-extrabold">
             {loading2 ? <Loader2 className="mr-2 h-8 w-8 animate-spin" /> : (Article ?? 0).toLocaleString("de-DE") + " Article(s)"}
             
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div> */}
        </CardFooter>
      </Card>
      <Card className="relative p-6 rounded-2xl shadow-lg 
                bg-gradient-to-br from-purple-900 to-purple-950 
                border border-purple-700 
                hover:shadow-xl hover:scale-[1.01] 
                transition-all duration-300">
      <div className="h-[45%] w-[30%] absolute left-[60%] top-[50%]"
         style={{
          backgroundImage: `url(${actif})`,
          backgroundSize: "50%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        ></div>
        <CardHeader>
          <CardDescription>Nombre d'article Active</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-400">
          {loading3 ? <Loader2 className="mr-2 h-8 w-8 animate-spin" /> : (ArticleEnStock ?? 0).toLocaleString("de-DE")+ " Article(s)"}
          
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {/* <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div> */}
        </CardFooter>
      </Card>
      <Card className="relative p-6 rounded-2xl shadow-lg 
                bg-gradient-to-br from-purple-900 to-purple-950 
                border border-purple-700 
                hover:shadow-xl hover:scale-[1.01] 
                transition-all duration-300">
      <div className="h-[45%] w-[30%] absolute left-[60%] top-[50%]"
         style={{
          backgroundImage: `url(${credit})`,
          backgroundSize: "50%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        ></div>
        <CardHeader>
          <CardDescription>Credit</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-orange-400">
             {loading4 ? <Loader2 className="mr-2 h-8 w-8 animate-spin" /> : (tCredit ?? 0).toLocaleString("de-DE") + " Article(s)"}
           
          </CardTitle>
          <CardAction>
            {/* <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge> */}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2  font-bold text-xl text-orange-700">
              {(pCredit ?? 0).toLocaleString("de-DE") + " F CFA"}
          </div>
          <div className="text-muted-foreground">.</div>
        </CardFooter>
      </Card>
    </div>
  )
}
