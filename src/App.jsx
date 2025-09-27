import { Button } from './components/ui/dach-aut/button'
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form"
import { useEffect } from 'react'
import { BrowserRouter as Router,HashRouter, Routes, Route } from "react-router-dom";
import Connextion from './pages/connextion'
import Inscription from './pages/inscription/inscription'
import Dashboard from './pages/interface-Acceuil/Accuiel'
import Dashb from './pages/pages_menue/dashbor'
import ListeStock from './pages/listStock/lstk';
import ListeStock2 from './pages/sortie/index';
import Modifierproduit from './pages/modifierProduit/index';
import AjoutStk from './pages/ajouterStock/index';
import Credit from './pages/credit/index';
import Fournisseurs from './pages/fournisseurs/journisseur';
import HsrqEntree from './pages/historiqueEntree/index';
import HsrqSortie from './pages/historiqueSortie/index';
import Recu from './pages/recu';
import Sortie from './pages/sortie/index';
import Entree from './pages/entree/index';

// import { useState } from 'react'

import Load from './pages/loading';

import './App.css'

function App() {
// const [loading, setLoading] = useState(null)
// const [licence, sete] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      
      try {
        const token = await window.electronAPI.getToken();
        // alert("Token récupéré :"+ token);
        if (token) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/isConnected`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await response.json();
          // alert(data.isConnected)
          if (data.isConnected) {
            // setLoading(true)
          } else {
            // setLoading(false)
            await window.electronAPI.deleteToken();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
      }
    };
    // verifyToken();
  }
, []);

  return (
        <HashRouter>
             <Routes>
                <Route path="/" element={<Load />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/connexion" element={<Connextion />} />
                <Route path="/dashboard" element={<Dashboard />}>
                   <Route index element={<Dashb />} />
                   <Route path="ls" element={<ListeStock />} />
                   <Route path="md" element={<Modifierproduit />}/>
                   <Route path="aj" element={<AjoutStk />} />
                   <Route path="cr" element={<Credit />} />
                   <Route path="fr" element={<Fournisseurs />}/>
                   <Route path="het" element={<HsrqEntree />}/>
                   <Route path="hst" element={<HsrqSortie />}/>
                   <Route path="rc" element={<Recu />}/>
                   <Route path="st" element={<ListeStock2 />} />
                   <Route path="et" element={<Entree />} />
                </Route>
               <Route path="*" element={<Navigate to="/" />} />
             </Routes>
        </HashRouter>
        
  )
}

export default App
