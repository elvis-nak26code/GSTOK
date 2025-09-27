import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Loader2 } from "lucide-react"

export default function DialogDemo({ selectedProducts }) {
  const [nom, setNom] = useState("")
  const [numero, setNumero] = useState("")
  const [montantTotal, setMontantTotal] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    // alert("debut")
    // alert(JSON.stringify(selectedProducts))
    e.preventDefault()
    setIsSubmitting(true)
    try {
        // alert("debut")
      const token = await window.electronAPI.getToken()
      if (!token) throw new Error("Token non disponible")

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/credit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produits:selectedProducts,
          nomCeancier: nom,
          numero,
          montantTotal,
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'envoi du crédit")
      const result = await response.json()
      console.log("Réponse du serveur :", result)
      alert(result.message)
      window.location.reload()
    } catch (error) {
      console.error("Erreur :", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className={"bg-red-400 font-bold h-7"}>
        Credit
      </Button>
    </DialogTrigger>
  
    <DialogContent className="sm:max-w-[425px]">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Enregistrement du credit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Nom du client</Label>
            <Input
              id="name-1"
              name="name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username-1">Numero du client</Label>
            <Input
              type="text"
              id="username-1"
              name="username"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="montant-1">Montant total</Label>
            <Input
              type="number"
              id="montant-1"
              name="montant"
              value={montantTotal}
              onChange={(e) => setMontantTotal(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className=" mt-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Annuler
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting || !montantTotal || !nom} >
            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  
  )
}
