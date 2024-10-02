"use client";

import { db } from "@/firebase/1-firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function CloudFire() {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [capital, setCapital] = useState(false);
  const [population, setPopulation] = useState("");
  const [regions, setRegions] = useState("");

  const btnHandler = async () => {
    const citiesRef = collection(db, "cities");
    const newCityRef = doc(citiesRef); // Create a reference with an auto-generated ID

    await setDoc(newCityRef, {
      name,
      state: state || null,
      country,
      capital,
      population: parseInt(population, 10),
      regions: regions.split(",").map((region) => region.trim()), // Split regions into an array
    });

    // Clear the input fields after submission (optional)
    setName("");
    setState("");
    setCountry("");
    setCapital(false);
    setPopulation("");
    setRegions("");
  };

  return (
    <>
      <h1>himmat e mardan</h1>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <label htmlFor="state">State:</label>
      <input
        type="text"
        id="state"
        value={state}
        onChange={(e) => setState(e.target.value)}
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
      <label htmlFor="capital">Capital:</label>
      <input
        type="checkbox"
        id="capital"
        checked={capital}
        onChange={(e) => setCapital(e.target.checked)}
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
      <button onClick={btnHandler}>Add City</button>
    </>
  );
}
