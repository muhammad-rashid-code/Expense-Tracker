// src/app/email-verification/page.tsx
"use client";

import ButtonComp from "@/components/button-comp";
import {
  serviceSendEmailVerification,
  serviceSignOut,
} from "@/firebase/2-firebase-auth";

export default function EmailVerificationFunc() {
  return (
    <>
      <h1>Verify Email</h1>
      <ButtonComp
        btnLabel={"Sign Out"}
        btnHandler={serviceSignOut}
      />
      <br />
      <br />
      <ButtonComp
        btnLabel={"Send Email"}
        btnHandler={serviceSendEmailVerification}
      />
    </>
  );
}
