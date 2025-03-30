import { auth } from "@/lib/firebase/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";


export async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    return userCredential;
  } catch (error) {
   
    throw error;
  }
}

export const logout = async () => {
  try {
    await signOut(auth);
    
  } catch (error) {
    
  }
};