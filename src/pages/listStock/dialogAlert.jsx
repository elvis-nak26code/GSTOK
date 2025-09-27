import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// Fonction pour supprimer un produit
const supprimer = async (id) => { 
  const token = await window.electronAPI.getToken();
  // alert("Token récupéré :" + token);
  if (!token) throw new Error("Token non disponible");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/produit/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression');
  }
  return response.json();
}

export default function AlertDialogDemo({ id, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await supprimer(id)
      setIsDeleting(false)
      if (onUpdate) onUpdate()  // ⚡ Rafraîchit le tableau après suppression
    } catch (error) {
      console.error("Erreur :", error)
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Supprimer produit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
