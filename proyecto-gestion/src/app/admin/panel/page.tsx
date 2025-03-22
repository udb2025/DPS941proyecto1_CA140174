"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig"; // Asegúrate de importar correctamente Firestore

const AdminPanel = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, "config", "system");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsMaintenance(docSnap.data().isMaintenance);
      }
    };
    fetchConfig();
  }, []);

  const toggleMaintenance = async () => {
    const newState = !isMaintenance;
    setIsMaintenance(newState);
    await updateDoc(doc(db, "config", "system"), { isMaintenance: newState });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
      <div className="flex items-center">
        <label className="mr-2">Modo Mantenimiento:</label>
        <input
          type="checkbox"
          checked={isMaintenance}
          onChange={toggleMaintenance}
          className="w-6 h-6"
        />
      </div>
    </div>
  );
};

export default AdminPanel;
