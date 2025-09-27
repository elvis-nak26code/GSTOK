import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  
  const produits = [
    {
      type: "Alimentaire",
      produit: "Riz",
      date: "2025-09-05",
      quantite: 100,
      prixUnitaire: "$2.50",
      prixTotal: "$250.00",
      fournisseur: "Fournisseur A",
    },
    {
      type: "Boisson",
      produit: "Jus d’orange",
      date: "2025-09-05",
      quantite: 50,
      prixUnitaire: "$3.00",
      prixTotal: "$150.00",
      fournisseur: "Fournisseur B",
    },
  ]
  
  
  export default function TableDemo() {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])
    const fetchData = async () => {
        try {
            const token = await window.electronAPI.getToken();
            // alert("Token récupéré :" + token);
            if (!token) throw new Error("Token non disponible");
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/sorties`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          })
          if (!response.ok) throw new Error("Erreur lors de la récupération des données")
          const result = await response.json()
          setData(result)
        //   alert(JSON.stringify(result))
        //   setIsLoading(false)
        } catch (error) {
          console.error("Erreur:", error)
        }
        finally {
            setIsLoading(false)
        }
      }

   useEffect(() => {
    //   alert(JSON.stringify(data))
      fetchData()
   }, [])

    return (
        <>
         <p className="font-bold text-2xl bg-purple-500 w-full p-2 text-center text-white rounded-lg">INVENTAIRE DES VENTES</p>
       {isLoading ? <Loader2 className="w-14 h-14 animate-spin text-gray-500"/> : (
                  <Table>
                  <TableCaption className="text-lg">
                    Liste des produits enregistrés.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-lg">Type</TableHead>
                      <TableHead className="font-bold text-lg">Produit</TableHead>
                      <TableHead className="font-bold text-lg">Date</TableHead>
                      <TableHead className="font-bold text-lg">Quantité sortie</TableHead>
                      <TableHead className="font-bold text-lg">Prix unitaire</TableHead>
                      <TableHead className="font-bold text-lg">Prix total</TableHead>
                      {/* <TableHead className="font-bold text-lg">Fournisseur</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {data && data.map((item, index) => (
                   <TableRow key={index}>
                     <TableCell className="text-base ">{item.type }</TableCell>
                     <TableCell className="text-base ">{item.produit.nom }</TableCell>
                     <TableCell className="text-base ">{new Date(item.date).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}           </TableCell>
                     <TableCell className="text-base ">{item.quantite }</TableCell>
                     <TableCell className="text-base ">{item.prix + " F CFA"}</TableCell>
                     <TableCell className="text-base ">{item.total + " F CFA"}</TableCell>
                     {/* <TableCell className="text-base ">{item.fournisseur }</TableCell> */}
                   </TableRow>
                 ))}
                  </TableBody>
                  <TableFooter>
                   <TableRow>
                     <TableCell colSpan={5} className="text-lg">Total</TableCell>
                     <TableCell className="text-right font-bold text-lg">
                       {data
                         ? data
                             .reduce((acc, item) => acc + Number(item.total), 0)
                             .toLocaleString("fr-FR") + " F CFA"
                         : "0 F CFA"}
                     </TableCell>
                     <TableCell />
                   </TableRow>
                 </TableFooter>
                </Table>
       )} 
      
      </>
    )
  }
  