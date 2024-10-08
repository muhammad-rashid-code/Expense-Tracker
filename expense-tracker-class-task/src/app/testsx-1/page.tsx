"use client";

import { useState } from "react";

export default function Home() {
  const [useManualId, setUseManualId] = useState<boolean>(false);
  const [manualId, setManualId] = useState<string>("");
  return (
    <>
      <h1>Himmat E Mardan</h1>
      <form>
        <input
          type="checkbox"
          id="useManualId"
          checked={useManualId}
          onChange={(e) => setUseManualId(e.target.checked)}
        />
        <label htmlFor="useManualId">Use Manual ID</label>
        <br />
        {useManualId && (
          <>
            <label htmlFor="manualId">Manual ID:</label>
            <input
              type="text"
              id="manualId"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
            />
          </>
        )}
      </form>
    </>
  );
}
