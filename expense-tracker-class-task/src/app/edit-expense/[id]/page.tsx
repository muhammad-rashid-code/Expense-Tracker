// src/app/edit-expense/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for the latest Next.js versions
import { AuthContextExport } from "@/context/1-auth-context";
import { serviceGetExpenses, serviceUpdateExpense } from "@/firebase/3-firebase-cloudfirestore";
import ButtonComp from "@/components/button-comp";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export default function EditExpense({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = AuthContextExport()!;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchExpense = async () => {
      if (user) {
        const expenses = await serviceGetExpenses(user.uid);
        const foundExpense = expenses.find((exp) => exp.id === params.id);
        if (foundExpense) {
          setExpense(foundExpense);
          setTitle(foundExpense.title);
          setAmount(foundExpense.amount);
          setCategory(foundExpense.category);
          setDate(foundExpense.date);
          setNote(foundExpense.note);
        }
      }
    };
    fetchExpense();
  }, [user, params.id]); // Add params.id as a dependency

  const handleUpdateExpense = async () => {
    if (expense) {
      await serviceUpdateExpense(expense.id, {
        title,
        amount,
        category,
        date,
        note,
      });
      router.push("/add-expense"); // Redirect after updating
    }
  };

  if (!expense) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Expense</h1>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />

      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <br />

      <label htmlFor="category">Category:</label>
      <input
        type="text"
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
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

      <ButtonComp btnLabel="Update Expense" btnHandler={handleUpdateExpense} />
    </div>
  );
}
