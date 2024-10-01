"use client";

import ButtonComp from "@/components/button-comp";
import { storage } from "@/firebase/1-firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";

export default function UploadImg() {
  const [file, setFiles] = useState<File>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [imageURL, setImageURL] = useState("");
  const uploadHandler = async () => {
    if (!file) {
      setErrorMsg("Choose file first");
      return;
    }
    console.log(file);

    const imageRef = ref(storage, `imges/${file?.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);

        // Log only if progress is less than 100% and only once when it reaches 100%
        if (progress < 100) {
          console.log("Upload is running");
        } else if (progress === 100) {
          console.log("Upload is complete");
        }
      },
      (error) => {
        console.error("Upload failed:", error);
        setErrorMsg("Upload failed. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImageURL(downloadURL);
          })
          .catch((e) => {
            console.error("Error getting download URL:", e);
            setErrorMsg("Failed to retrieve file URL.");
          });
      }
    );
  };
  return (
    <>
      <label htmlFor="UploadImg">Upload Image:</label>
      <input
        type="file"
        id="UploadImg"
        onChange={(e) => {
          let files = e.target.files;
          if (files) {
            setFiles(files[0]);
            setErrorMsg("");
          }
          console.log(files);
        }}
      />
      <p>{errorMsg}</p>
      <p>progress{progress}</p>
      <br />
      <br />
      <ButtonComp btnLabel={"UploadImage"} btnHandler={uploadHandler} />
    </>
  );
}
function setImageURL(downloadURL: string) {
  throw new Error("Function not implemented.");
}
