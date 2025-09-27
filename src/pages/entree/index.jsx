import { useEffect, useState } from "react";
import { Input } from "@/components/ui/dach-aut/input"
import { Label } from "@/components/ui/dach-aut/label"
import { Button } from "@/components/ui/dashbord/button";
import { Loader2 } from "lucide-react"

export default function Entree() {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        categorie: "",
        prix: "",
        seuilAlerte: "",
        quantite: "",
        fournisseur: ""
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
        const token = await window.electronAPI.getToken();
        // alert("Token récupéré :" + token);
        if (!token) throw new Error("Token non disponible");
         setLoading(true);
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/produit`, {
           method: "POST",
           headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
           body: JSON.stringify(formData),
         });
   
         const data = await response.json();
         console.log("✅ Produit enregistré :", data);
         setLoading(false);
         alert(data.message );
         setFormData({
          nom: "",
          description: "",
          categorie: "",
          prix: "",
          seuilAlerte: "",
          quantite: "",
          fournisseur: ""
        })
       } catch (error) {
         console.error("❌ Erreur lors de l'enregistrement :", error);
         setLoading(false);
         alert("Erreur lors de l'enregistrement");
       }
     };

    //  liste fournisseur
    const [dataf, setDataf] = useState([])
    const fetchData = async () => {
      try {
          const token = await window.electronAPI.getToken();
          // alert("Token récupéré :" + token);
          if (!token) throw new Error("Token non disponible");
          
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/fournisseurs`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error("Erreur lors de la récupération des données")
        const result = await response.json()
        setDataf(result)
      //   alert(JSON.stringify(result))
      //   setIsLoading(false)
      } catch (error) {
        console.error("Erreur:", error)
      }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
        {loading && (
          <div className=" bg-white w-[98%] h-[93%] absolute  flex items-center justify-center">
             <Loader2 className="mr-2 w-14 h-14 animate-spin" />
             ENREGISTREMENT...
          </div>
         )}
          <div className=" flex items-center justify-center gap-6 p-6 md:p-10">
                <div className="w-[50%] flex flex-col gap-4 items-center">
                   <div className="grid w-full  items-center gap-3 ">
                      <Label >Nom</Label>
                      <Input name='nom' value={formData.nom} onChange={handleChange} className='h-12 ' type="text"  placeholder="Nom du produit" />
                   </div>
                   <div className="grid w-full  items-center gap-3">
                      <Label >Description</Label>
                      <Input name='description' value={formData.description} onChange={handleChange} className='h-12' type="text"  placeholder="Description du produit" />
                   </div>
                   <div className="grid w-full  items-center gap-3">
                      <Label >Categorie</Label>
                      <input name='categorie' value={formData.categorie} onChange={handleChange} className="h-12 border rounded px-2" type="text"  placeholder="Catégorie du produit" list="categories"
                      />
                      <datalist name="categories">
                        <option value="Électronique" />
                        <option value="Vêtements" />
                        <option value="Accessoires" />
                        <option value="Alimentation" />
                      </datalist>
                   </div>

                   <div className="grid w-full  items-center gap-3">
                      <Label >Fournisseur</Label>
                      <input name='fournisseur' value={formData.fournisseur} onChange={handleChange} className="h-12 border rounded px-2" type="text"  placeholder="Choisir fournisseur (optionnel)" list="fournisseurs"
                      />
                      <datalist name="fournisseurs">
                        {dataf.map((fournisseur) => (
                            <option key={fournisseur.id} value={fournisseur.nom} />
                        ))}
                        {/* <option value="F1" />
                        <option value="F2" />
                        <option value="F3" />
                        <option value="F4" /> */}
                      </datalist>
                   </div>
                </div>
  
                <div className="w-[50%] flex flex-col gap-4 items-center">
                   <div className="grid w-full  items-center gap-3">
                      <Label >Prix</Label>
                      <Input name='prix' value={formData.prix} onChange={handleChange} className='h-12' type="number"  placeholder="Prix unitaire" />
                   </div>
                   <div className="grid w-full  items-center gap-3">
                      <Label >Seuil</Label>
                      <Input name='seuilAlerte' value={formData.seuilAlerte} onChange={handleChange} className='h-12' type="number"  placeholder="Seuil d'alerte" />
                   </div>
                   <div className="grid w-full  items-center gap-3">
                      <Label >Quantite</Label>
                      <Input name='quantite' value={formData.quantite} onChange={handleChange} className='h-12' type="number"  placeholder="Quantite du produit" />
                   </div>
                </div>
           </div>
            <div className=" flex items-center justify-center gap-6 w-full">
                <Button 
                  type="button"
                  onClick={()=>{handleSubmit();}}
                  className="text-xl bg-purple-500 text-white px-4 py-2 rounded w-[40%] h-12">Enregistrer</Button>

                <Button
                 onClick={() =>
                    setFormData({
                      nom: "",
                      description: "",
                      categorie: "",
                      prix: "",
                      seuilAlerte: "",
                      quantite: "",
                      fournisseur: ""
                    })
                  }
                className="text-xl bg-gray-500 text-white px-4 py-2 rounded w-[40%] h-12">Annuler</Button>   
            </div>
        </>   
    );
  }