// src/context/1-auth-context.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/1-firebase-config"; // Ensure you're importing auth correctly
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

type UserType = {
  email: string | null;
  uid: string;
  emailVerified: boolean | null;
};

type AuthContextCreateType = {
  user: UserType | null;
};

const AuthContextCreate = createContext<AuthContextCreateType | null>(null);

type AuthContextFuncType = {
  children: React.ReactNode;
};

export default function AuthContextFunc({ children }: AuthContextFuncType) {
  const [userAcUs, setUserAcUs] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        const { email, emailVerified, uid } = loggedInUser;
        if (!emailVerified) {
          router.push("/email-verification");
        } else {
          setUserAcUs({ email, uid, emailVerified });
          router.push("/home");
        }
      } else {
        setUserAcUs(null);
        router.push("/");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <AuthContextCreate.Provider value={{ user: userAcUs }}>
      {children}
    </AuthContextCreate.Provider>
  );
}

export const AuthContextExport = () => useContext(AuthContextCreate);
