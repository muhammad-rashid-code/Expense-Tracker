//  filePath src/context/1-auth-context.tsx
"use client";

import { auth } from "@/firebase/2-firebase-auth";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  email: string | null;
  uid: string;
  emailVerified: boolean | null;
};
type AuthContextCreateType = { user: UserType | null };

const AuthContextCreate = createContext<AuthContextCreateType | null>(null);

type AuthContextFuncType = { children: React.ReactNode };
export default function AuthContextFunc({ children }: AuthContextFuncType) {
  const [userAcUs, setAserAcUs] = useState<UserType | null>(null);
  const route = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        const { email, emailVerified, uid } = loggedInUser;
        if (!emailVerified) {
          route.push("email-verification");
        } else {
          setAserAcUs({ email, uid, emailVerified });
          route.push("home");
        }
      } else {
        setAserAcUs(null);
        route.push("/");
      }
    });
  }, []);

  return (
    <AuthContextCreate.Provider value={{ user: userAcUs }}>
      {children}
    </AuthContextCreate.Provider>
  );
}
export const AuthContextExport = () => useContext(AuthContextCreate);
