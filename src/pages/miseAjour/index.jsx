import { useState , useEffect } from "react";


// fonction qui verifie la dernier version de l'application
async function checkUpdate() {
    const res = await fetch("https://api.github.com/repos/elvis-nak26code/GSTOK/releases/latest");
    const data = await res.json();
    return data.tag_name // ex: "v2.0.0"
  }



export default function MiseAjour() {
    const [updateAvailable , setUpdateAvailable] = useState(false);

    useEffect( () => {
        checkUpdate().then((result) => {
            // alert(JSON.stringify(result) );
            if(result !== "v0.0.1"){
                setUpdateAvailable(true);
            }
          });
    }
    , []);

  return (
    <>
        {updateAvailable ? (
            <div 
            onClick={() => {
              window.open("https://github.com/elvis-nak26code/GSTOK/releases/latest");
            }}
             className=" p-3 font-bold text-white rounded animate-pulse bg-gradient-to-r from-red-600 to-red-800 shadow-lg cursor-pointer">
            🚀 Mise à jour disponible
          </div>
        ):(
          <div className="p-3 bg-emerald-900 font-bold text-white rounded shadow-lg ">
          ✅ Application à jour
        </div>
        )}
    </>
  );
}