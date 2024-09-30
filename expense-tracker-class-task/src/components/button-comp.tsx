// src/components/button-comp.tsx
"use client";
type ButtonCompType = { btnLabel: string; btnHandler: () => void };
export default function ButtonComp({ btnLabel, btnHandler }: ButtonCompType) {
  return (
    <>
      <button
        onClick={btnHandler}
        style={{
          backgroundColor: "#4267B2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "5px 12px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {btnLabel}
      </button>
    </>
  );
}
