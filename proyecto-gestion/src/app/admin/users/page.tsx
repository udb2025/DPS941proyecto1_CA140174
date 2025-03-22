"use client";

import { useEffect, useState } from "react";
import { collection, getDocs ,updateDoc, doc,setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "@/lib/firebase/firebaseConfig";
import { Key } from 'lucide-react';
import { UserRoundPlus } from 'lucide-react';
import { Clipboard } from 'lucide-react';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';
import { UserPen } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  active: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "Miembro" });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [passwordPopup, setPasswordPopup] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const roles = ["Administrador", "Gerente", "Miembro"];
  const [tempUserData, setTempUserData] = useState<Partial<User> | null>(null);

  useEffect(() => {


    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
         id: doc.id, // Aquí nos aseguramos de que el ID venga de Firestore
         email: doc.data().email || "",
         role: doc.data().role || "Miembro",
         active: doc.data().active ?? true, // Manejo de valores nulos
      })) as User[];

      setUsers(usersList);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const isValidEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewUser((prev) => ({ ...prev, password }));
    setPasswordPopup(password);

    setTimeout(() => {
      setPasswordPopup(null);
    }, 5000);
  };
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setTempUserData({ role: user.role, active: user.active });
  };
  const handleCancel = () => {
    setEditingUserId(null);
    setTempUserData(null);
  };
  const copyPassword = () => {
    if (passwordPopup) {
      navigator.clipboard.writeText(passwordPopup);
      setMessage({ text: "Contraseña copiada al portapapeles", type: "success" });
      setTimeout(() => setMessage(null), 2000);
    }
  };
const handleConfirm = async () => {
    if (!editingUserId || !tempUserData) return;

    try {
      const userRef = doc(db, "users", editingUserId);
      await updateDoc(userRef, {
        role: tempUserData.role,
        active: tempUserData.active,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUserId
            ? { ...user, role: tempUserData.role!, active: tempUserData.active! }
            : user
        )
      );

      setMessage({ text: "Usuario actualizado con éxito", type: "success" });
    } catch (error) {
      setMessage({ text: "Error al actualizar el usuario", type: "error" });
    }

    setEditingUserId(null);
    setTempUserData(null);

    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      setMessage({ text: "Email y contraseña son obligatorios", type: "error" });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
      return;
    }
    if (!isValidEmail(newUser.email)) {
      setMessage({ text: "El email ingresado no es válido", type: "error" });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        email: newUser.email,
        role: newUser.role,
        active: true,
      });

      setUsers([...users, { id: uid, email: newUser.email, role: newUser.role, active: true }])
      setMessage({ text: "Usuario creado exitosamente", type: "success" });
      setNewUser({ email: "", password: "", role: "Miembro" });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setMessage({ text: "Este correo ya está registrado. Usa otro.", type: "error" });
      } else {
        setMessage({ text: "Error al crear el usuario", type: "error" });
      }
    }

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

 

 

 


  if (loading) return <p className="text-center text-gray-500">Cargando usuarios...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
      {message && (
        <div
          className={`mt-4 p-2 text-white text-center rounded ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

<div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Usuario</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <div className="flex space-x-2">
          <input
            type="password"
            placeholder="Contraseña"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded flex-1"
            readOnly
          />
          <button onClick={generatePassword} className="bg-gray-900 text-white px-4 py-2 rounded">
          <Key  className="inline-block w-4 h-4 mr-1 user-cog" />Generar
          </button>
        </div>
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button onClick={handleCreateUser} className="bg-gray-900 text-white px-3 py-1 rounded">
        <UserRoundPlus   className="inline-block w-4 h-4 mr-1 user-cog" /> Crear Usuario
        </button>
      </div>

      {passwordPopup && (
        <div className="fixed bottom-10 right-10 bg-white shadow-lg border rounded-lg p-4 flex items-center">
          <span className="text-gray-800 font-semibold mr-2">{passwordPopup}</span>
          <button onClick={copyPassword} className="bg-blue-500 text-white px-3 py-1 rounded">
          <Clipboard   className="inline-block w-4 h-4 mr-1 user-cog" /> Copiar
          </button>
        </div>
      )}

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Rol</th>
            <th className="border border-gray-300 p-2">Estado</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`text-center ${
                editingUserId === user.id ? "border-4 border-red-500" : ""
              }`}
            >
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">
                <select
                  value={
                    editingUserId === user.id ? tempUserData?.role : user.role
                  }
                  onChange={(e) =>
                    setTempUserData((prev) => ({
                      ...prev!,
                      role: e.target.value,
                    }))
                  }
                  disabled={editingUserId !== user.id}
                  className="border p-1 rounded disabled:opacity-50"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                <select
                  value={
                    editingUserId === user.id
                      ? tempUserData?.active
                        ? "Activo"
                        : "Inactivo"
                      : user.active
                      ? "Activo"
                      : "Inactivo"
                  }
                  onChange={(e) =>
                    setTempUserData((prev) => ({
                      ...prev!,
                      active: e.target.value === "Activo",
                    }))
                  }
                  disabled={editingUserId !== user.id}
                  className="border p-1 rounded disabled:opacity-50"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </td>
              <td className="border border-gray-300 p-2">
                {editingUserId === user.id ? (
                  <>
                    <button
                      onClick={handleConfirm}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                       <Check className="inline-block w-4 h-4 mr-1 user-cog" />Confirmar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      <X   className="inline-block w-4 h-4 mr-1 user-cog" /> Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-gray-900 text-white px-3 py-1 rounded"
                  >
                     <UserPen   className="inline-block w-4 h-4 mr-1 user-cog" />Editar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
