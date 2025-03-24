"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig"; // Asegúrate de importar correctamente Firestore
import ConfirmModal from "@/components/ui/ConfirmModal";
const AdminPanel = () => {  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  

   

  const handleToggle = () => {
    setIsModalOpen(true);
  };
  const handleConfirm = () => {    
    setIsChecked(!isChecked); // Cambiar estado
    const newState = !isChecked;     
    updateDoc(doc(db, "config", "system"), { isMaintenance: newState });
    setIsModalOpen(false);
  };
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
     <h1 className="text-xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>
      <div className="mt-4 flex items-center">
      <label className="mr-2 text-gray-700 dark:text-gray-300">Modo Mantenimiento:</label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="toggle-checkbox"
        />
      </div>
       {/* Modal de confirmación */}
       <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="Confirmar Cambio"
        message="¿Estás seguro de cambiar el estado del sistema?"
      />
    </div>
  );
};

export default AdminPanel;
