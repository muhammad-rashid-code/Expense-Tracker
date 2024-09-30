// src/app/page.tsx
"use client";

import ButtonComp from "@/components/button-comp";
import { serviceSignInUser } from "@/firebase/2-firebase-auth";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    serviceSignInUser({ email, password });
  };

  return (
    <>
      <h1>Sign In</h1>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <ButtonComp
        btnLabel={"Sign In"}
        btnHandler={handleSignIn}
      />
      <p>
        <Link href="/sign-up">Create an account</Link>
      </p>
    </>
  );
}
