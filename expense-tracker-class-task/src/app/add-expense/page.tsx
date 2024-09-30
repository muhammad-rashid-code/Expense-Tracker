// src/app/add-expense/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AuthContextExport } from "@/context/1-auth-context";
import {
  serviceGetExpenses,
  serviceAddExpense,
  serviceDeleteExpense,
} from "@/firebase/3-firebase-cloudfirestore";
import ButtonComp from "@/components/button-comp";
import Link from "next/link";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export default function AddExpense() {
  const { user } = AuthContextExport()!;
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      if (user) {
        const userExpenses = await serviceGetExpenses(user.uid);
        setExpenses(userExpenses);
      }
    };
    fetchExpenses();
  }, [user]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh

    const expenseData = {
      title,
      amount: Number(amount),
      category,
      date,
      note,
    };

    await serviceAddExpense(expenseData);
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]); // Reset to today
    setNote("");

    // Refresh the expenses list
    const userExpenses = await serviceGetExpenses(user.uid);
    setExpenses(userExpenses);
  };

  const handleDelete = async (id: string) => {
    await serviceDeleteExpense(user.uid, id);
    setExpenses(expenses.filter((expense) => expense.id !== id)); // Update local state
  };

  return (
    <div>
      <h1>Add Expense</h1>
      <form onSubmit={handleAddExpense}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <br />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Education">Education</option>
          <option value="Investments">Investments</option>
          <option value="Luxuries">Luxuries</option>
          <option value="Other">Other</option>
        </select>
        <br />

        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />

        <label htmlFor="note">Note:</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <br />

        <ButtonComp btnLabel="Add Expense" btnHandler={handleAddExpense} />
      </form>

      <h2>Your Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <strong>{expense.title}</strong> - ${expense.amount} <br />
              Category: {expense.category} <br />
              Date: {expense.date} <br />
              Note: {expense.note} <br />
              <ButtonComp
                btnLabel="Delete"
                btnHandler={() => handleDelete(expense.id)}
              />
              <Link href={`/edit-expense/${expense.id}`}>
                <ButtonComp btnLabel="Edit" btnHandler={() => {}} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
