"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Modifier({ data ,onUpdate}) {
  const [isLoading,detIsLoading]=useState(false)

  const [nom, setNom] = useState(data?.nom || "")
  const [description, setDescription] = useState(data?.description || "")
  const [categorie, setCategorie] = useState(data?.categorie || "")
  const [prix, setPrix] = useState(data?.prix || "")
  const [seuilAlerte, setSeuilAlerte] = useState(data?.seuilAlerte || "")
  const [quantite, setQuantite] = useState(data?.quantite || "")

  useEffect(() => {
    if (data) {
      setNom(data.nom || "")
      setDescription(data.description || "")
      setCategorie(data.categorie || "")
      setPrix(data.prix || "")
      setSeuilAlerte(data.seuilAlerte || "")
      setQuantite(data.quantite || "")
    }
  }, [data])

  const handleSubmit = async () => {
    // e.preventDefault()
    
    const produit = {
      nom,
      description,
      categorie,
      prix: parseFloat(prix),
      seuilAlerte: parseInt(seuilAlerte),
      quantite: parseInt(quantite),
    }

    try {
      detIsLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/produit/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produit),
      })

      if (!response.ok) throw new Error("Erreur lors de l'envoi des données")

      const result = await response.json()
      console.log("Produit modifié avec succès :", result)
      alert("Produit modifié avec succès !")
      if (onUpdate) onUpdate()  // ⚡ Rafraîchit le tableau après suppression
      detIsLoading(false)
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert("Erreur lors de la modification du produit")
    }
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Modifier le produit</DialogTitle>
            <DialogDescription className="text-lg">
              Les anciens champs seront remplacés par les nouveaux.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="nom" className="text-lg">Nom</Label>
              <Input
                id="nom"
                name="nom"
                placeholder="Nom du produit"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="h-12 text-lg p-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-lg">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Description du produit"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-12 text-lg p-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categorie" className="text-lg">Catégorie</Label>
              <Input
                id="categorie"
                name="categorie"
                placeholder="Catégorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="h-12 text-lg p-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prix" className="text-lg">Prix</Label>
              <Input
                id="prix"
                name="prix"
                type="number"
                placeholder="Prix en FCF"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="h-12 text-lg p-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="seuilAlerte" className="text-lg">Seuil d'alerte</Label>
              <Input
                id="seuilAlerte"
                name="seuilAlerte"
                type="number"
                placeholder="Seuil d'alerte"
                value={seuilAlerte}
                onChange={(e) => setSeuilAlerte(e.target.value)}
                className="h-12 text-lg p-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantite" className="text-lg">Quantité</Label>
              <Input
                id="quantite"
                name="quantite"
                type="number"
                placeholder="Quantité en stock"
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className="h-12 text-lg p-2"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="text-lg h-12">Annuler</Button>
            </DialogClose>
            <Button type="submit" className="text-lg h-12" onClick={()=>handleSubmit()}>{isLoading ? (<Loader2 className="animate-spin w-8 h-8"/>):"Modifier"}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
