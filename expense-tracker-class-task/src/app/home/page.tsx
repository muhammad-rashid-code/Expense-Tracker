// filePath src/app/home/page.tsx
"use client";

import ButtonComp from "@/components/button-comp";
import { AuthContextExport } from "@/context/1-auth-context";
import { serviceSignOut } from "@/firebase/2-firebase-auth";
import Link from "next/link";

export default function Home() {
  const { user } = AuthContextExport()!;
  return (
    <>
      {/* {user ? (
        <h1>
          Welcome, <span>{user.email.split("@")[0]}</span>!
        </h1>
      ) : (
        <h1>Please log in.</h1>
      )} */}
      {user ? (
        <h1>
          Welcome,{" "}
          <span style={{ backgroundColor: "rgb(225 229 233)" }}>
            {user.email?.split("@")[0] || "User"}
          </span>
          <p>
            <>
              {" "}
              <Link href={"manage-expense"}>Mange Expense</Link>
            </>
          </p>
        </h1>
      ) : (
        <></>
      )}{" "}
      <ButtonComp
        btnLabel={"Sign Out"}
        btnHandler={() => {
          serviceSignOut();
        }}
      />
    </>
  );
}
