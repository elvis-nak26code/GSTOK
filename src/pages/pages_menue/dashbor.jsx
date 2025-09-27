import Chart from "./chart"
import Card_section from "./section-card"
import Calandar from "./calandar"
import {Button} from "@/components/ui/dach-aut/button"
import { Link } from "react-router-dom"

export default function Dashb() {
    return (
         <>
            <Card_section/>
  
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min overflow-hidden flex flex-col " >
                <div className=" w-full h-[10%] flex justify-center gap-2  items-center p-1  bg-purple-900">
                    <Link to="st"><Button className=" h-[50px] min-w-[150px] font-extrabold text-[16px] rounded-[0] bg-purple-700 border border-white">Vendre </Button></Link>
                    <Link to="et"><Button className=" h-[50px] min-w-[150px] font-extrabold text-[16px] rounded-[0] bg-purple-700 border border-white">Ajouter des produits</Button></Link> 
                    <Link to="hst"><Button className="h-[50px] min-w-[150px] font-extrabold text-[16px] rounded-[0] bg-purple-700 border border-white">Historique des ventes</Button></Link>
                    <Link to="fr"> <Button className="h-[50px] min-w-[150px] font-extrabold text-[16px] rounded-[0] bg-purple-700 border border-white">Enregistrer un fournisseur</Button></Link>
                    <Link to="cr"> <Button className="h-[50px] min-w-[150px] font-extrabold text-[16px] rounded-[0] bg-purple-700 border border-white">Liste des credits</Button></Link>
  
                </div>
                <div className=" w-full min-h-[90%] flex overflow-hidden gap-3">
                     <div className=" gap-2 w-full  p-2 flex items-center justify-center border-5 border-purple-900">
                         <div className=" flex justify-between gap-2 rounded ">
                              <Chart/>
                              <Chart/>
                         </div> 
                      </div>
                </div>
            </div>
         </>   
    )
  }
  