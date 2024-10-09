"use client";

import { db } from "@/firebase/1-firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

interface City {
  id: string;
  name: string;
  state: string | null;
  country: string;
  capital: boolean;
  population: number;
  regions: string[];
}

export default function Home() {
  const [useManualId, setUseManualId] = useState<boolean>(false);
  const [manualId, setManualId] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [cityState, setCityState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [capitalCheckbox, setCapitalCheckbox] = useState<boolean>(false);
  const [population, setPopulation] = useState<string>("");
  const [regions, setRegions] = useState<string>("");

  const btnHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const citiesRef = collection(db, "cities");
    const cityId = useManualId && manualId ? manualId : doc(citiesRef).id;

    await setDoc(doc(citiesRef, cityId), {
      name: cityName,
      state: cityState || null,
      country,
      capital: capitalCheckbox,
      population: parseInt(population, 10),
      regions: regions.split(",").map((region) => region.trim()),
    });

    // Resetting form fields after submission
    setCityName("");
    setCityState("");
    setCountry("");
    setCapitalCheckbox(false);
    setPopulation("");
    setRegions("");
    if (useManualId) {
      setManualId("");
      setUseManualId(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    // Resetting form fields
    setCityName("");
    setCityState("");
    setCountry("");
    setCapitalCheckbox(false);
    setPopulation("");
    setRegions("");
    if (useManualId) {
      setManualId("");
      setUseManualId(false);
    }
  };

  return (
    <>
      <h1>Himmat E Mardan</h1>
      <form onSubmit={btnHandler}>
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
            <br />
          </>
        )}
        <label htmlFor="cityName">Name:</label>
        <input
          type="text"
          id="cityName"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="cityState">State:</label>
        <input
          type="text"
          id="cityState"
          value={cityState}
          onChange={(e) => setCityState(e.target.value)}
        />
        <br />
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <br />
        <label htmlFor="capitalCheckbox">Capital:</label>
        <input
          type="checkbox"
          id="capitalCheckbox"
          checked={capitalCheckbox}
          onChange={(e) => setCapitalCheckbox(e.target.checked)}
        />
        <br />
        <label htmlFor="population">Population:</label>
        <input
          type="number"
          id="population"
          value={population}
          onChange={(e) => setPopulation(e.target.value)}
        />
        <br />
        <label htmlFor="regions">Regions (comma separated):</label>
        <input
          type="text"
          id="regions"
          value={regions}
          onChange={(e) => setRegions(e.target.value)}
        />
        <br />
        <button type="submit">Add City</button>
        <button onClick={handleCancel}>Cancel</button>

        <h2>Cities List</h2>
        <table style={{ border: "1px solid black" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black" }}>ID</th>
              <th style={{ border: "1px solid black" }}>Name</th>
              <th style={{ border: "1px solid black" }}>State</th>
              <th style={{ border: "1px solid black" }}>Country</th>
              <th style={{ border: "1px solid black" }}>Capital</th>
              <th style={{ border: "1px solid black" }}>Population</th>
              <th style={{ border: "1px solid black" }}>Regions</th>
              <th style={{ border: "1px solid black" }}>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </form>
    </>
  );
}
