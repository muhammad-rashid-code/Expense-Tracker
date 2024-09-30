//src/app/manage-expense/page.tsx
"use client";

import { useState } from "react";

export default function MenageExpense() {
  const [title, setTitle] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [] = useState<string>("");
  const [] = useState<string>("");
  const [] = useState<string>("");
  const [] = useState<string>("");
  return (
    <>
      <h1>Add Expeses</h1>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <br />
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <br />
      <br />
      <label htmlFor="category">Category:</label>
      <select name="" id="category">
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="bills">Bills</option>
        <option value="education">Education</option>
        <option value="investment">Investment</option>
        <option value="luxuries">Luxuries</option>
        <option value="others">Others</option>
      </select>
      <br />
      <br />
      <label htmlFor="date">Date:</label>
      <input type="date" id="date" />
      <br />
      <br />
      <label htmlFor="note">Note:</label>
      <textarea id="note"></textarea>
    </>
  );
}
