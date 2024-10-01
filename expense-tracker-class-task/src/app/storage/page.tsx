"use client";

import ButtonComp from "@/components/button-comp";
import { useState } from "react";

export default function StorageFb() {
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const UploadHandle = async () => {
    if (!file) {
      setErrorMsg("Choose File");
      return;
    }
    console.log(file);

    
  };
  return (
    <>
      <h1>Upload Image</h1>
      <label htmlFor="Uimage">Selcet Image:</label>
      <input
        type="file"
        id="Uimage"
        onChange={(e) => {
          let files = e.target.files;
          if (files) {
            setFile(files[0]);
            setErrorMsg("");
          }
        }}
      />
      <br />
      <br />
      <ButtonComp btnLabel={"Upload"} btnHandler={UploadHandle} />
      <h1 style={{ color: "red" }}>{errorMsg}</h1>
    </>
  );
}
