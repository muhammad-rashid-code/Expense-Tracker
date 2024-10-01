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
  const [loading, setLoading] = useState(false);

  const storage = getStorage(app);

  const uploadImage = async () => {
    if (!file) {
      setErrorMsg("First select an image.");
      return;
    }

    // Basic file type validation
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }

    setErrorMsg("");
    setLoading(true);

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
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImageURL(downloadURL);
            setLoading(false);
          })
          .catch((e) => {
            console.error("Error getting download URL:", e);
            setErrorMsg("Failed to retrieve file URL.");
            setLoading(false);
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
            setImageURL(""); // Clear previous image
          }
        }}
      />
      <button onClick={uploadImage} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {progress > 0 && <p>Upload is {progress.toFixed(2)}% done</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {imageURL && (
        <Image
          src={imageURL}
          alt="Uploaded"
          width={500} // Set desired width
          height={300} // Set desired height
          style={{ marginTop: "20px", objectFit: "cover" }} // Add styles if needed
        />
      )}
    </>
  );
}
