import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LicenceExpiree() {
  const [licence, setLicence] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleRenouveler = async () => {
    if (!licence.trim()) {
      setMessage("Veuillez entrer un code de licence.");
      return;
    }
  
    setLoading(true);
    setMessage(null);
  
    try {
      const token = await window.electronAPI.getToken();
      if (!token) {
        setMessage("❌ Token manquant. Veuillez vous reconnecter.");
        return;
      }
  
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/licenceMj`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ licenceCode: licence })
      });
  
      if (!res.ok) {
        setMessage(`❌ Erreur serveur: ${res.status}`);
        return;
      }
  
      const data = await res.json();
      setMessage(data.success ? "✅ Licence renouvelée avec succès !" : (data.message || "❌ Erreur lors du renouvellement."));
      window.location.reload();
    } catch (err) {
      console.error("Erreur API :", err);
      setMessage("❌ Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-6">
        
        {/* Alerte licence expirée */}
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-5 w-5 " />
          <AlertTitle>Licence expirée</AlertTitle>
          <AlertDescription>
            Votre licence est expirée. Veuillez entrer un nouveau code de licence pour continuer.
          </AlertDescription>
        </Alert>

        {/* Champ pour la licence */}
        <Input
          placeholder="Entrez votre nouvelle licence"
          value={licence}
          onChange={(e) => setLicence(e.target.value)}
        />

        {/* Bouton de renouvellement */}
        <Button
          onClick={handleRenouveler}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Renouvellement...
            </>
          ) : (
            "Renouveler la licence"
          )}
        </Button>

        {/* Message retour */}
        {message && (
          <p className="text-center text-sm font-medium text-gray-700">{message}</p>
        )}
      </div>
    </div>
  )
}
