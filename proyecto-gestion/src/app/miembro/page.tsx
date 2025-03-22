"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { logout } from "@/services/authService";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        console.log("Usuario autenticado:", currentUser);
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login"); // Redirigir al login después de cerrar sesión
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user ? (
        <>
          <p>Bienvenido, {user.email}</p>
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
