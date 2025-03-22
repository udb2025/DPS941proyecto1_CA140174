import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";

/**
 * Obtiene el rol del usuario desde Firestore usando su UID.
 */
export const getUserRole = async (uid: string) => {
  try {
    console.warn("uid Usuario.",uid);
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().role; // Devuelve el rol del usuario
    } else {
      console.warn("Usuario no encontrado en Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    return null;
  }
};
