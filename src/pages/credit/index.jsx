import React, { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ListeStock2() {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loading2, setLoading2] = useState(true);

  const divRefs = useRef({}); // Un ref par crédit pour impression individuelle

  // fetch infos entreprise
  const fetchData = async () => {
    try {
      const token = await window.electronAPI.getToken();
      if (!token) throw new Error("Token non disponible");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur récupération données");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // fetch crédits
  const fetchData2 = async () => {
    console.log("fetch credit")
    try {
      const token = await window.electronAPI.getToken();
      if (!token) throw new Error("Token non disponible");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/creditsList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erreur récupération crédits");
      const result = await response.json();
      console.log(result)
      setData2(result);
      setLoading2(false);
    } catch (error) {
      console.error("Erreur:", error); 
    }
  };

  useEffect(() => {
    fetchData();
    fetchData2();

    const generateInvoiceNumber = () => "FAC-" + Date.now();
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  // impression d’un crédit spécifique
  const handlePrint = (creditId) => {
    const content = divRefs.current[creditId];
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=650");
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture</title>
          <style>
            body { margin:0; padding:20px; font-family:ui-sans-serif,system-ui,sans-serif; background:white; display:flex; justify-content:center; }
            .container { width: 100%; max-width: 900px; padding: 24px; background: #fff; border-radius: 0.375rem; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #d1d5db; padding: 8px; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="container">${content.innerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

 // fonction enregistrement sortie
 const [isLoading,setIsloading]=useState(false)
 const setSorties = async (selectedProducts) => {
  try {
    setIsloading(true)
    const token = await window.electronAPI.getToken();
    if (!token) throw new Error("Token non disponible");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/validerCredit/${selectedProducts._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sorties: "sortie" }),
    });
    if (!response.ok) throw new Error("Erreur lors de lenvois des donnees");
    const result = await response.json();
    setData(result);
    alert(result.message);
    window.location.reload();
    setIsloading(false)
  } catch (error) {
    console.error("Erreur:", error);
    alert(error.message);
  }
};

  return (
    <div className="flex gap-3 justify-center min-h-[900px] ">
      {loading2 ? (<Loader2 className=" mt-20 animate-spin w-14 h-14 text-blue-500" />):(
           <div className="w-[60%] p-2 rounded-2xl">
           {data2 && data2.length > 0 && data2.map((credit, creditIndex) => {
             const totalCredit = credit.produits
               ? credit.produits.reduce((acc, p) => acc + (p.total || 0), 0)
               : 0;
   
             return (
               <div
                 key={creditIndex}
                 ref={(el) => (divRefs.current[credit._id] = el)}
                 className="mt-4 p-6 bg-white shadow-lg rounded-md w-full max-w-3xl mx-auto"
               >
                 <div className="flex justify-between items-center border-b pb-4 mb-4">
                   <div>
                     <h1 className="text-2xl font-bold">FACTURE</h1>
                     <p className="text-sm text-gray-500">{invoiceNumber}</p>
                     <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                     <p className="text-sm text-gray-500">Heure: {new Date().toLocaleTimeString()}</p>
                   </div>
                   <div className="text-right">
                     <h2 className="font-bold text-lg">{data.entreprise}</h2>
                     <p className="text-sm">Adresse {data.ville}</p>
                     <p className="text-sm">Tel: {data.numero}</p>
                     <p className="text-sm">Email: {data.email}</p>
                   </div>
                 </div>
   
                 <div className="mb-6">
                   <h3 className="font-semibold text-lg mb-2">Client</h3>
                   <p>Nom: {credit.nomCeancier || "________________"}</p>
                   {/* <p>Adresse: {credit.adresse || "________________"}</p> */}
                   <p>Téléphone: {credit.numero || "________________"}</p>
                 </div>
   
                 <table className="w-full border-collapse border border-gray-300 mb-6">
                   <thead>
                     <tr className="bg-gray-100">
                       <th className="border border-gray-300 p-2 text-left">Produit</th>
                       <th className="border border-gray-300 p-2 text-center">Quantité</th>
                       <th className="border border-gray-300 p-2 text-right">Prix Unitaire</th>
                       {/* <th className="border border-gray-300 p-2 text-right">Total</th> */}
                     </tr>
                   </thead>
                   <tbody>
                     {credit.produits && credit.produits.length > 0 ? (
                       credit.produits.map((prod, idx) => (
                         <tr key={idx}>
                           <td className="border border-gray-300 p-2">{prod.nom || ""}</td>
                           <td className="border border-gray-300 p-2 text-center">{prod.quantite || 0}</td>
                           <td className="border border-gray-300 p-2 text-right">{prod.prix || 0} F CFA</td>
                           {/* <td className="border border-gray-300 p-2 text-right">{credit.montantTotal || 0} F CFA</td> */}
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan={4} className="border border-gray-300 p-4 text-center text-gray-500">
                           Aucun produit
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
   
                 <div className="flex justify-end mb-6">
                   <table className="w-1/3 border-collapse border border-gray-300">
                     <tbody>
                       <tr>
                         <td className="border border-gray-300 p-2 font-semibold">Sous-total</td>
                         <td className="border border-gray-300 p-2 text-right">{credit.montantTotal} F CFA</td>
                       </tr>
                       <tr className="bg-gray-100">
                         <td className="border border-gray-300 p-2 font-bold">Total</td>
                         <td className="border border-gray-300 p-2 text-right font-bold">{credit.montantTotal} F CFA</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
   
                 <div className="flex justify-center gap-4">
                   <button
                     onClick={() => {handlePrint(credit._id),setSorties(credit)}}
                     className="bg-blue-500 text-white px-4 py-2 rounded-md flex justify-center items-center"
                     disabled={loading}
                   >
                     {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Valider et Imprimer"}
                   </button>
                 </div>
               </div>
             );
           })}
         </div>
      )}
      
      
    </div>
  );
}
