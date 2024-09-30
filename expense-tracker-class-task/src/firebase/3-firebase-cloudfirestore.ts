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

// Function to get expenses for a specific user
export async function serviceGetExpenses(uid: string) {
  try {
    const expensesRef = collection(db, "Expenses");
    const q = query(expensesRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    const expenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return expenses;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

// Function to add a new expense
export async function serviceAddExpense(expense: any) {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  try {
    await addDoc(collection(db, "Expenses"), {
      ...expense,
      userId: user.uid,
    });
    console.log("Expense added:", expense);
  } catch (error) {
    console.error("Error adding expense:", error);
  }
}

// Function to delete an expense
export const serviceDeleteExpense = async (expenseId: string) => {
  try {
    await deleteDoc(doc(db, "Expenses", expenseId)); // Ensure this matches your Firestore collection
    console.log("Expense deleted:", expenseId);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};

// Function to update an existing expense
export const serviceUpdateExpense = async (
  expenseId: string,
  expenseData: {
    title: string;
    amount: number;
    category: string;
    date: string;
    note: string;
  }
) => {
  try {
    const expenseRef = doc(db, "Expenses", expenseId);
    await updateDoc(expenseRef, expenseData);
    console.log("Expense updated:", expenseId);
  } catch (error) {
    console.error("Error updating expense:", error);
  }
};

// Function to save a user to Firestore
export async function serviceSaveUser(userCf: {
  email: string;
  userName: string;
  uid: string;
}) {
  try {
    const docRef = doc(db, "Expense Users", userCf.uid);
    await setDoc(docRef, userCf);
    console.log("User saved:", userCf);
  } catch (error) {
    console.error("Error saving user:", error);
  }
}
