import { useEffect, useState } from "react"
import { GalleryVerticalEnd, Loader2 } from "lucide-react"

// pour manupuler le  Token d'authentification
// import { saveToken, getToken, deleteToken } from '../../utils/token';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/dach-aut/button"
import { Input } from "@/components/ui/dach-aut/input"
import { Label } from "@/components/ui/dach-aut/label"

import { useNavigate } from "react-router-dom"


import { Link } from "react-router-dom"
// import { useEffect } from "react";

export function LoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate() 

  // requet pour verifier sil existe un token valide
//   useEffect(() => {
//     const verifyToken = async () => {
      
//       try {
//         const token = await window.electronAPI.getToken();
//         // const token = window.tokenAPI.get();
//         // alert("Token récupéré :"+ token);
//         if (token) {
//           const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/isConnected`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`
//             }
//           });
//           const data = await response.json();
//           // alert(data.isConnected)
//           if (data.isConnected) {
//             alert("Information valide, redirection vers le tableau de bord.");
//             window.location.href = "/"; // Remplacez par votre route de tableau de bord
//           } else {
//             alert("Token invalide, veuillez vous reconnecter.");
//             // await window.electronAPI.deleteToken();
//           }
//         }
//       } catch (error) {
//         console.error("Erreur lors de la vérification du des information :", error);
//       }
//     };
//     verifyToken();
//   }
// , []);

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // 🔹 Gère le changement des inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

 

  // 🔹 Envoi du formulaire
  const handleSubmit = async (e) => {
    
    e.preventDefault()
    setLoading(true)
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/connexion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || "Échec de la connexion")
      }
  
      // Sauvegarder le token dans Electron
      await window.electronAPI.saveToken(data.token)
  
      // Navigation vers le tableau de bord
      navigate("/") // avec useNavigate
    } catch (error) {
      console.error("❌ Erreur :", error)
      alert(error.message || "Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h2 className="text-5xl font-bold text-center">BIEN VENUE SUR G-STOCK</h2>
            <div className="text-center text-sm ">
              Vous n&apos;avez pas de compte ?{" "}
              <Link to='/inscription' className="underline underline-offset-4">
                S'inscrire
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input 
                name="email" 
                type="email" 
                placeholder="m@example.com" 
                className='h-12' 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                name="password" 
                type="password" 
                placeholder="********" 
                className='h-12' 
                required 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-xl flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
          <div
            className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              xxxxxxxxx
            </span>
          </div>
          
        </div>
      </form>
      <div
        className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        En cliquant sur Continuer, vous acceptez nos <a href="#">Conditions d'utilisation</a>{" "}
        et <a href="#">Politique de confidentialité</a>.
      </div>
    </div>
  )
}
