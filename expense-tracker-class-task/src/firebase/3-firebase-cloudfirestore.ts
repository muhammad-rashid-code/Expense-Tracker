// src/firebase/3-firebase-cloudfirestore.ts
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "./1-firebase-config";

// Define the structure of an Expense
interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

// Function to get expenses for a specific user
export async function serviceGetExpenses(uid: string): Promise<Expense[]> {
  const expensesRef = collection(db, "Expenses");
  const q = query(expensesRef, where("userId", "==", uid));
  const querySnapshot = await getDocs(q);

  const expenses: Expense[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Expense[];

  return expenses;
}

// Function to add a new expense
export async function serviceAddExpense(
  expense: Omit<Expense, "id">
): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  try {
    await addDoc(collection(db, "Expenses"), {
      ...expense,
      userId: user.uid, // Include userId to filter later
    });
    console.log("Expense added:", expense);
  } catch (error) {
    console.error("Error adding expense:", error);
  }
}

// Function to delete an expense
export const serviceDeleteExpense = async (
  expenseId: string
): Promise<void> => {
  await deleteDoc(doc(db, "Expenses", expenseId));
  console.log("Expense deleted:", expenseId);
};

// Function to update an existing expense
export const serviceUpdateExpense = async (
  expenseId: string,
  expenseData: Omit<Expense, "id">
): Promise<void> => {
  const expenseRef = doc(db, "Expenses", expenseId);
  await updateDoc(expenseRef, expenseData);
  console.log("Expense updated:", expenseId);
};

// Function to save a user to Firestore
export async function serviceSaveUser(userCf: {
  email: string;
  userName: string;
  uid: string;
}): Promise<void> {
  const docRef = doc(db, "Expense Users", userCf.uid);
  try {
    await setDoc(docRef, userCf);
    console.log("User saved:", userCf);
  } catch (error) {
    console.error("Error saving user:", error);
  }
}
