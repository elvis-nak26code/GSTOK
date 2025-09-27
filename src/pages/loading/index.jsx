import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

export default function Load(){
    const navigate = useNavigate()
    useEffect(() => {
        const verifyToken = async () => {
          try {
            const token = await window.electronAPI.getToken();
            if (token) {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/isConnected`, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              });
              const data = await response.json();
              if (data.isConnected) {
                // alert("Information valide, redirection vers le tableau de bord.");
                // window.location.href = "/"; // Remplacez par votre route de tableau de bord
                console.log("User is connected, redirecting to dashboard...");
                navigate("/dashboard");
              } else {
                // alert("Token invalide, veuillez vous reconnecter.");
                // await window.electronAPI.deleteToken();
                console.log("User is connected, redirecting to dashboard...");
                navigate("/connexion");
              }
            }else {
              console.log("No token found, redirecting to login...");
              navigate("/connexion");
            }
          } catch (error) {
            console.error("Erreur lors de la vérification du des information :", error);
            alert("Erreur lors de la vérification du des information :", error);
          }
        };
        verifyToken();
      }
    , []);

    return (
       <div>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
            <p className="text-lg text-gray-700">Un instant… Nous préparons tout pour vous</p>
          </div>
        </div>
       </div>
    )
}