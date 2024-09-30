import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { app } from "./1-firebase-config";

// filePath src/firebase/1-firebase-auth.ts
export const auth = getAuth(app);

type ServiceSignUpUserType = { email: string; password: string };
export function serviceSignUpUser(userSu: ServiceSignUpUserType) {
  createUserWithEmailAndPassword(auth, userSu.email, userSu.password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("userSu=>", user, userCredential);
      if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("VEmail=> inside serviceSignUpUser");
          })
          .catch((error) => {
            console.log(" Error VEmail=> inside serviceSignUpUser =>", error);
          });
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      const errorCode = error.code;
      console.log("errorCode=>", errorCode, "errorMessage=>", errorMessage);
    });
}

type ServiceSignInUserType = { email: string; password: string };
export function serviceSignInUser(userSi: ServiceSignInUserType) {
  signInWithEmailAndPassword(auth, userSi.email, userSi.password)
    .then((userCredential) => {
      const userSi = userCredential.user;
      console.log("userSi=>", userSi);
    })
    .catch((error) => {
      console.log("errorSi=>", error);
    });
}

export function serviceSignOut() {
  signOut(auth)
    .then(() => {
      console.log("User LoggedOut");
    })
    .catch((error) => {
      console.log("Error User LoggedOut=>", error);
    });
}

export function serviceSendEmailVerification() {
  if (auth.currentUser) {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log("VEmail=> inside serviceSendEmailVerification");
      })
      .catch((error) => {
        console.log(
          " Error VEmail=> inside serviceSendEmailVerification =>",
          error
        );
      });
  }
}
