"use client";

import { app } from "../../firebase/1-firebase-config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import Image from "next/image"; // Import the Image component

export default function About() {
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageURL, setImageURL] = useState("");

  const storage = getStorage(app);

  const uploadImage = async () => {
    if (!file) {
      setErrorMsg("First select an image.");
      return;
    }
    setErrorMsg("");
    console.log(file);

    const imageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
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
      <h1>Upload Image</h1>
      <input
        type="file"
        onChange={(e) => {
          let files = e.target.files;
          if (files) {
            setFile(files[0]);
            setErrorMsg(""); // Clear any previous error
            setProgress(0); // Reset progress on new file selection
          }
        }}
      />
      <button onClick={uploadImage}>Upload Image</button>

      {progress > 0 && <p>Upload is {progress.toFixed(2)}% done</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {imageURL && (
        <div
          style={{
            marginTop: "20px",
            position: "relative",
            width: "100%",
            height: "400px",
          }}
        >
          <Image
            src={imageURL}
            alt="Uploaded"
            fill // Use fill instead of layout
            style={{ objectFit: "contain" }} // Use the style prop to manage how the image fits
          />
        </div>
      )}
    </>
  );
}
