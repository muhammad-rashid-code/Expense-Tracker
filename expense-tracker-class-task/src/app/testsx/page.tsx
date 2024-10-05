"use client";

import { db } from "@/firebase/1-firebase-config";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

// Define the City interface
interface City {
  id: string;
  name: string;
  state: string | null;
  country: string;
  capital: boolean;
  population: number;
  regions: string[];
}

export default function CloudFire() {
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [capital, setCapital] = useState(false);
  const [population, setPopulation] = useState("");
  const [regions, setRegions] = useState("");
  const [manualId, setManualId] = useState(""); // State for manual ID
  const [useManualId, setUseManualId] = useState(false); // State to toggle between ID modes
  const [cities, setCities] = useState<City[]>([]); // State to store fetched cities
  const [editingCityId, setEditingCityId] = useState<string | null>(null); // State for the city currently being edited

  // Fetch cities from Firestore on component mount
  useEffect(() => {
    const fetchCities = async () => {
      const citiesRef = collection(db, "cities");
      const citySnapshot = await getDocs(citiesRef);
      const cityList: City[] = citySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as City)
      );
      setCities(cityList);
    };

    fetchCities();
  }, []);

  const btnHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const citiesRef = collection(db, "cities");
    const cityId = useManualId && manualId ? manualId : doc(citiesRef).id; // Use manual ID if provided

    await setDoc(doc(citiesRef, cityId), {
      name,
      state: state || null,
      country,
      capital,
      population: parseInt(population, 10),
      regions: regions.split(",").map((region) => region.trim()), // Split regions into an array
    });

    // Clear input fields after submission
    resetForm();
    await refreshCities(); // Refresh the cities list after adding/updating
  };

  const editCity = (city: City) => {
    setEditingCityId(city.id);
    setName(city.name);
    setState(city.state || "");
    setCountry(city.country);
    setCapital(city.capital);
    setPopulation(city.population.toString());
    setRegions(city.regions.join(", "));
    setManualId(city.id); // Set manual ID to the city's ID
    setUseManualId(true); // Enable manual ID mode
  };

  const deleteCity = async (cityId: string) => {
    const cityRef = doc(db, "cities", cityId);
    await deleteDoc(cityRef);
    await refreshCities(); // Refresh the cities list after deletion
  };

  const resetForm = () => {
    setName("");
    setState("");
    setCountry("");
    setCapital(false);
    setPopulation("");
    setRegions("");
    setManualId("");
    setUseManualId(false);
    setEditingCityId(null); // Reset editing city
  };

  const refreshCities = async () => {
    const citiesRef = collection(db, "cities");
    const citySnapshot = await getDocs(citiesRef);
    const cityList: City[] = citySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as City)
    );
    setCities(cityList);
  };

  return (
    <>
      <h1>himmat e mardan</h1>
      <form onSubmit={btnHandler}>
        <label>
          <input
            type="checkbox"
            checked={useManualId}
            onChange={() => setUseManualId(!useManualId)}
          />
          Use Manual ID
        </label>
        <br />
        {useManualId && (
          <>
            <label htmlFor="manualId">Manual ID:</label>
            <input
              type="text"
              id="manualId"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              required
            />
            <br />
          </>
        )}
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
          required
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
        <button type="submit">
          {editingCityId ? "Update City" : "Add City"}
        </button>
        <button type="button" onClick={resetForm}>
          Cancel
        </button>
      </form>

      <h2>Cities List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>State</th>
            <th>Country</th>
            <th>Capital</th>
            <th>Population</th>
            <th>Regions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td>{city.id}</td>
              <td>{city.name}</td>
              <td>{city.state || "N/A"}</td>
              <td>{city.country}</td>
              <td>{city.capital ? "Yes" : "No"}</td>
              <td>{city.population.toLocaleString()}</td>
              <td>{city.regions.join(", ")}</td>
              <td>
                <button onClick={() => editCity(city)}>Edit</button>
                <button onClick={() => deleteCity(city.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
