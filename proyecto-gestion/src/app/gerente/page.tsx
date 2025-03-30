"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { logout } from "@/services/authService";
import { FolderKanban  } from "lucide-react";
import { ScrollText  } from 'lucide-react'; 
export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
         
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login"); // Redirigir al login después de cerrar sesión
  };
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <div className="p-6">
       
      {user ? (
        <>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.email}</h1> 
          <div className="mt-6 space-y-4">
          <button
            onClick={() => handleNavigation("/gerente/proyects/")}
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700"
          >
            <FolderKanban className="inline-block w-4 h-4 mr-1 user-cog" />Gestionar Proyectos
          </button>

          </div>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Cerrar Sesión
          </button>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}
