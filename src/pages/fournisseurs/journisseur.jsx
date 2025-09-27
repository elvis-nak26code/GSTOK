import { useState } from "react";
import { Input } from "@/components/ui/dach-aut/input"
import { Label } from "@/components/ui/dach-aut/label"
import { Button } from "@/components/ui/dashbord/button";
import { Loader2 } from "lucide-react"

export default function Entree() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nom: "",
        tel: ""
      });

       // 🔹 Gère le changement dans les inputs
     const handleChange = (e) => {
       setFormData({
         ...formData,
         [e.target.name]: e.target.value
       });
     };

      // 🔹 Gère l’envoi du formulaire
     const handleSubmit = async () => {
      //  e.preventDefault();
      //  console.log(formData)
       try {
        const tpken = await window.electronAPI.getToken();
         setLoading(true);
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/fournisseur`, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${tpken}`
           },
           body: JSON.stringify(formData),
         });
   
         const data = await response.json();
         console.log("✅ Fournisseur enregistré :", data);
         setLoading(false);
         alert(data.message );
         setFormData({
          nom: "",
          tel: ""
        })
       } catch (error) {
         console.error("❌ Erreur lors de l'enregistrement :", error);
         setLoading(false);
         alert("Erreur lors de l'enregistrement");
       }
     };
    return (
        <>
        {loading && (
          <div className=" bg-white w-[98%] h-[93%] absolute  flex items-center justify-center">
             <Loader2 className="mr-2 h-10 w-10 animate-spin" />
             ENREGISTREMENT...
          </div>
         )}
          <div className=" flex items-center justify-center gap-6 p-6 md:p-10">
                <div className="w-[50%] flex flex-col gap-4 items-center">
                   <div className="grid w-full  items-center gap-3 ">
                      <Label >Nom</Label>
                      <Input name='nom' value={formData.nom} onChange={handleChange} className='h-12 ' type="text"  placeholder="Nom du fournisseur" />
                   </div>             
                </div>
  
                <div className="w-[50%] flex flex-col gap-4 items-center">
                   <div className="grid w-full  items-center gap-3">
                      <Label >Tel</Label>
                      <Input name='tel' value={formData.tel} onChange={handleChange} className='h-12' type="number"  placeholder="Numero du fournisseur" />
                   </div>             
                </div>
           </div>
            <div className=" flex items-center justify-center gap-6 w-full">
                <Button 
                  type="button"
                  onClick={()=>{handleSubmit();}}
                  className="text-xl bg-blue-500 text-white px-4 py-2 rounded w-[40%] h-12">Enregistrer</Button>

                <Button
                 onClick={() =>
                    setFormData({
                      nom: "",
                      tel: ""
                    })
                  }
                className="text-xl bg-gray-500 text-white px-4 py-2 rounded w-[40%] h-12">Annuler</Button>   
            </div>
        </>   
    );
  }