// filePath src/app/sign-up/page.tsx

"use client";

import ButtonComp from "@/components/button-comp";
import { serviceSignUpUser } from "@/firebase/2-firebase-auth";
import Link from "next/link";
import { useState } from "react";

export default function LoginUserFunc() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState<string>("");
  return (
    <>
      <h1>Sign Up Here</h1>
      <label htmlFor="userName">User Name:</label>
      <input
        type="text"
        id="userName"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <br />
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
        btnLabel={"Sign up"}
        btnHandler={() => {
          serviceSignUpUser({ email, password, userName });
        }}
      />
      <p>
        <Link href={"/"}>Sign in</Link> If you have an account.
      </p>
    </>
  );
}
