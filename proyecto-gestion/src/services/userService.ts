import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseConfig";

/**
 * Obtiene el rol del usuario desde Firestore usando su UID.
 */
export const getUserRole = async (uid: string) => {
  try {
    
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().role; // Devuelve el rol del usuario
    } else {
       
      return null;
    }
  } catch (error) {
 
    return null;
  }
};
