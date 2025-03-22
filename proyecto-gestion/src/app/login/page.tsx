"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { getUserRole } from "@/services/userService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const checkMaintenance = async () => {
      const docRef = doc(db, "config", "system");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().isMaintenance) {
        setIsMaintenance(true);
      }
    };
    checkMaintenance();
  }, []); 

  if (isMaintenance) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">
          🚧 El sistema está en mantenimiento. Vuelve más tarde. 🚧
        </h1>
      </div>
    );
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await login(email, password); // Login devuelve el objeto userCredential
      const user = userCredential.user; // Extraemos el usuario autenticado
      const role = await getUserRole(user.uid); // Obtenemos el rol desde Firestore
      if (role === "Administrador") {
        
        router.push("/admin");
      } else if (role === "Gerente") {
        router.push("/gerente");
      } else if (role === "Miembro") {
        router.push("/miembro");
      } else {
        setError("No tiene un rol asignado.");
      }
      
    } catch (err) {
      
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
