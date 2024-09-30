// src/firebase/2-firebase-auth.ts
import { auth } from "./1-firebase-config"; // Ensure this is the correct import
import { app } from "./1-firebase-config"; // Import the app from firebase config
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { serviceSaveUser } from "./3-firebase-cloudfirestore";
import { db } from "./1-firebase-config"; // Ensure Firestore is imported
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";

// Initialize Auth
// No need to initialize here again; use imported `auth`

// Function to sign up a user
type ServiceSignUpUserType = {
  email: string;
  password: string;
  userName: string;
};

export async function serviceSignUpUser({ email, password, userName }: ServiceSignUpUserType) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  await serviceSaveUser({ email, userName, uid });

  // Send email verification
  await sendEmailVerification(auth.currentUser!);
}

// Function to sign in a user
export async function serviceSignInUser(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

// Function to sign out a user
export function serviceSignOut() {
  return signOut(auth);
}

// Function to send email verification
export async function serviceSendEmailVerification() {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
}

// Function to get user expenses
export async function serviceGetExpenses(uid: string) {
  const expensesRef = collection(db, "Expenses");
  const q = query(expensesRef, where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Other expense-related functions...

