import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { app } from "./1-firebase-config";
import { auth } from "./2-firebase-auth";

// src/firebase/3-firebase-cloudfirestore.ts
export const db = getFirestore(app);

type ServiceSaveUserFsType = { userName: string; email: string; uid: string };
export async function serviceSaveUserFs(userCfS: ServiceSaveUserFsType) {
  let docRef = doc(db, "User's Expense", userCfS.uid);
  try {
    await setDoc(docRef, userCfS);
  } catch (error) {
    console.log("error=> inside serviceSaveUserFs", error);
  }
}

type ServiceAddExpense = {
  uid: string;
  title: string;
  amount: string;
  category: string;
  date: string;
  note: string;
};

export async function serviceAddExpense(expense: ServiceAddExpense) {
  const uid = auth.currentUser?.uid;
  const expenses = { expense, uid };
  let collectionRef = collection(db, "expendature");
  try {
    await addDoc(collectionRef, expenses);
    console.log("serviceAddExpense() trigerd");
  } catch (error) {
    console.log("error=> serviceAddExpense()", error);
  }
}
