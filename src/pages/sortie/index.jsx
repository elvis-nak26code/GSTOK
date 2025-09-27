import DataTableDemo from "./tb";
import React, { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Dialog from "./dialog" 

export default function ListeStock2() {
  // objet des produits sélectionnés
  const [selectedProducts, setSelectedProducts] = useState({});

  // calcule du total global
  const totalGeneral = Object.values(selectedProducts).reduce(
    (acc, prod) => acc + prod.total,
    0
  );

  // numéro de facture
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // information sur l'entreprise
  const [data, setData] = useState([]);

  // loaders des boutons
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [loadingSortie, setLoadingSortie] = useState(false);
  const [loadingCredit, setLoadingCredit] = useState(false);

  // fonction enregistrement sortie
  const setSorties = async () => {
    try {
      const token = await window.electronAPI.getToken();
      if (!token) throw new Error("Token non disponible");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/edit/sortie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sorties: selectedProducts }),
      });
      if (!response.ok) throw new Error("Erreur lors de lenvois des donnees");
      const result = await response.json();
      alert(result.message);
      // window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement de la vente");
    }
  };

  // fonctions wrappers pour gérer les loaders
  const handlePrintWithLoader = async () => {
    setLoadingPrint(true);
    await handlePrint();
    setLoadingPrint(false);
    setSortiesWithLoader();
  };

  const setSortiesWithLoader = async () => {
    setLoadingSortie(true);
    await setSorties();
    setLoadingSortie(false);
  };

  const handleCreditWithLoader = async () => {
    setLoadingCredit(true);
    await handlePrint();
    setLoadingCredit(false);
  };

  useEffect(() => {
     // fonction fetchData
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
      if (!response.ok) throw new Error("Erreur lors de la récupération des données");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
    fetchData();
    // numéro de facture
    const generateInvoiceNumber = () => {
      return "FAC-" + Date.now();
    };
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  const divRef = useRef(null);

  // fonction print
  const handlePrint = () => {
    const content = divRef.current;
    const printWindow = window.open("", "", "width=900,height=650");

    printWindow.document.write(`
      <html>
        <head>
          <title>Facture</title>
          <style>
            body { 
              margin:0; 
              padding:20px; 
              font-family:ui-sans-serif,system-ui,sans-serif; 
              background:white; 
              display:flex; 
              justify-content:center; 
            }
            .container { 
              width: 100%; 
              max-width: 900px; 
              padding: 24px; 
              background: #fff; 
              border-radius: 0.375rem; 
            }
            .text-gray-500 { color:#6B7280; }
            .text-gray-600 { color:#4B5563; }
            .font-bold { font-weight:700; }
            .font-semibold { font-weight:600; }
            .mb-2 { margin-bottom:0.5rem; }
            .mb-4 { margin-bottom:1rem; }
            .mb-6 { margin-bottom:1.5rem; }
            .mb-16 { margin-bottom:4rem; }
            .mt-4 { margin-top:1rem; }
            .mt-8 { margin-top:2rem; }
            .mt-12 { margin-top:3rem; }
            .flex { display:flex; }
            .justify-between { justify-content:space-between; }
            .justify-end { justify-content:flex-end; }
            .text-center { text-align:center; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #d1d5db; padding: 8px; }
            th { background-color: #f3f4f6; }
            .bg-gray-100 { background-color: #f3f4f6; }
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

  return (
    <div className="flex gap-3">
      <DataTableDemo setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts} />

      <div className="w-[60%]  min-h-[700px] p-2 rounded-2xl">
        <div
          ref={divRef}
          className="mt-4 p-6 bg-white shadow-lg rounded-md w-full max-w-3xl mx-auto"
        >
          {/* 🧾 En-tête facture */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">FACTURE</h1>
              <p className="text-sm text-gray-500">{invoiceNumber}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Heure: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <h2 className="font-bold text-lg">{data.entreprise}</h2>
              <p className="text-sm">Adresse {data.ville}</p>
              <p className="text-sm">Tel: {data.numero}</p>
              <p className="text-sm">Email: {data.email}</p>
            </div>
          </div>

          {/* 👤 Infos client */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Client</h3>
            <p>Nom: _______________________________________________________</p>
            <p>Adresse: _______________________________________________________</p>
            <p>Téléphone: ________.________.________.________</p>
          </div>

          {/* 📦 Tableau des produits */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Produit</th>
                <th className="border border-gray-300 p-2 text-center">Quantité</th>
                <th className="border border-gray-300 p-2 text-right">Prix Unitaire</th>
                <th className="border border-gray-300 p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(selectedProducts).map((prod, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{prod.nom}</td>
                  <td className="border border-gray-300 p-2 text-center">{prod.quantite}</td>
                  <td className="border border-gray-300 p-2 text-right">{prod.prix} F CFA</td>
                  <td className="border border-gray-300 p-2 text-right">{prod.total} F CFA</td>
                </tr>
              ))}

              {Object.values(selectedProducts).length === 0 && (
                <tr>
                  <td colSpan={4} className="border border-gray-300 p-4 text-center text-gray-500">
                    Aucun produit sélectionné
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 💰 Résumé */}
          <div className="flex justify-end mb-6">
            <table className="w-1/3 border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Sous-total</td>
                  <td className="border border-gray-300 p-2 text-right">{totalGeneral} F CFA</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-2 font-bold">Total</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{totalGeneral} F CFA</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ✍️ Signature */}
          <div className="flex justify-between mt-12">
            <div className="text-center">
              <p className="mb-16">Signature Client</p>
              <p>______________________</p>
            </div>
            <div className="text-center">
              <p className="mb-16">Signature Caissier</p>
              <p>______________________</p>
            </div>
          </div>

          {/* ✅ Remerciement */}
          <div className="text-center mt-8 text-sm text-gray-600">
            Merci pour votre confiance !
          </div>
        </div>

        <div className="grid grid-cols-3 justify-center items-center h-[60px]">
          <button
            onClick={handlePrintWithLoader}
            className="bg-purple-600 text-white font-bold px-4 py-2 rounded-md ml-4 flex justify-center items-center"
            disabled={loadingPrint}
          >
            {loadingPrint ? <Loader2 className="animate-spin w-5 h-5" /> : "valider et imprimer"}
          </button>

          <button
            onClick={setSortiesWithLoader}
            className="bg-purple-600 text-white font-bold px-4 py-2 rounded-md ml-4 flex justify-center items-center"
            disabled={loadingSortie}
          >
            {loadingSortie ? <Loader2 className="animate-spin w-5 h-5" /> : "Valider"}
          </button>

          <div
            // onClick={handleCreditWithLoader}
            className="bg-purple-600 text-white px-4 py-2 rounded-md ml-4 flex justify-center items-center"
            disabled={loadingCredit}
          >
            {/* {loadingCredit ? <Loader2 className="animate-spin w-5 h-5" /> : "Credit"} */}
            <Dialog selectedProducts={selectedProducts}/>
          </div>
        </div>
      </div>
    </div>
  );
}
