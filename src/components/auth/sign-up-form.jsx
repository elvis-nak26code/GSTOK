import { useState } from "react"
import { GalleryVerticalEnd, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/dach-aut/button"
import { Input } from "@/components/ui/dach-aut/input"
import { Label } from "@/components/ui/dach-aut/label"

import { Link } from "react-router-dom"

import Otp from "./otpinput"

export function LoginForm({ className, ...props }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    numero: "",
    entreprise: "",
    password: "",
    confirmPassword: "",
    licence:""
  })

  // 🔹 Gère les changements d’input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/utilisateur`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("✅ Réponse API :", data)
      // alert(data.message || "Inscription réussie ✅")
      // alert(JSON.stringify(data))
      // Sauvegarde du token et redirection
      await window.electronAPI.saveToken(data.token)
      window.location.href = "/" // Remplacez par votre route de tableau de bord

      // Reset du form
      setFormData({
        nom: "",
        email: "",
        numero: "",
        entreprise: "",
        password: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("❌ Erreur API :", error)
      alert("Erreur lors de l'inscription ❌")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className={cn("flex flex-col gap-6  w-150", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h2 className="text-4xl font-bold text-center">
              Créez un compte en quelques secondes.
            </h2>
            <div className="text-center text-sm ">
              Vous avez déjà un compte ?{" "}
              
              <Link to='connexion'  className="underline underline-offset-4>Se connecter">Se connecter</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid gap-3">
              <Label htmlFor="nom">Nom et prénom</Label>
              <Input name="nom" value={formData.nom} onChange={handleChange} type="text" placeholder="ex: Sanou VICTOR" required className="h-12" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="ex: sanouvictor1@gmail.com" required className="h-12" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="numero">Numéro</Label>
              <Input name="numero" value={formData.numero} onChange={handleChange} type="text" placeholder="ex: 70 00 50 34" required className="h-12" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="entreprise">Nom de l'entreprise</Label>
              <Input name="entreprise" value={formData.entreprise} onChange={handleChange} type="text" placeholder="ex: cabapro" required className="h-12" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Mot de passe</Label>
              <Input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="********" required className="h-12" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="********" required className="h-12" />
            </div>

            <div className="gap-3 flex flex-col items-center">
              <Label>Clé d’activation ✅</Label>
              {/* <Otp /> */}
               <Input name="licence" value={formData.licence} onChange={handleChange} type="text" placeholder=""  className="h-12 border-red-700" />
            </div>

            {/* 🔹 Bouton avec Loader */}
            <Button type="submit" className="w-full h-12 text-xl flex items-center justify-center" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Inscription...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </div>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              xxxxxxxxx
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}
