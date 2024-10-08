"use client";

import { useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/1-firebase-config"; // Ensure firebaseConfig is set up correctly

// Define types for City and FormData
type City = {
  id: string;
  name: string;
  state: string | null;
  country: string;
  capital: boolean;
  population: number;
  regions: string[];
};

type FormData = {
  name: string;
  state: string;
  country: string;
  capital: boolean;
  population: number;
  regions: string;
};

export default function CityForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    state: "",
    country: "",
    capital: false,
    population: 0,
    regions: "",
  });
  const [cities, setCities] = useState<City[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCityId, setEditCityId] = useState<string | null>(null);

  // Fetch all cities from Firestore
  useEffect(() => {
    const fetchCities = async () => {
      const citiesCollection = collection(db, "cities");
      const citySnapshot = await getDocs(citiesCollection);
      const cityList = citySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as City[];
      setCities(cityList);
    };

    fetchCities();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "population"
          ? parseInt(value)
          : type === "checkbox"
          ? checked
          : value,
    });
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && editCityId) {
        // Update the existing document
        await setDoc(doc(db, "cities", editCityId), {
          name: formData.name,
          state: formData.state,
          country: formData.country,
          capital: formData.capital,
          population: formData.population,
          regions: formData.regions.split(",").map((region) => region.trim()),
        });
        alert("City updated successfully!");
        setIsEditing(false);
        setEditCityId(null);
      } else {
        // Add a new city document
        await setDoc(doc(db, "cities", formData.name), {
          name: formData.name,
          state: formData.state,
          country: formData.country,
          capital: formData.capital,
          population: formData.population,
          regions: formData.regions.split(",").map((region) => region.trim()),
        });
        alert("City added successfully!");
      }
      setFormData({
        name: "",
        state: "",
        country: "",
        capital: false,
        population: 0,
        regions: "",
      });
      // Reload cities
      fetchCities();
    } catch (error) {
      console.error("Error adding/updating city: ", error);
      alert("Error processing request, please try again.");
    }
  };

  // Handle delete city
  const handleDelete = async (cityId: string) => {
    try {
      await deleteDoc(doc(db, "cities", cityId));
      alert("City deleted successfully!");
      setCities(cities.filter((city) => city.id !== cityId));
    } catch (error) {
      console.error("Error deleting city: ", error);
      alert("Error deleting city, please try again.");
    }
  };

  // Handle edit city
  const handleEdit = (city: City) => {
    setFormData({
      name: city.name,
      state: city.state || "",
      country: city.country,
      capital: city.capital,
      population: city.population,
      regions: city.regions.join(", "),
    });
    setIsEditing(true);
    setEditCityId(city.id);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit City" : "Add a City"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>City Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isEditing}
          />
        </div>
        <div>
          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Is Capital:</label>
          <input
            type="checkbox"
            name="capital"
            checked={formData.capital}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Population:</label>
          <input
            type="number"
            name="population"
            value={formData.population}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Regions (comma-separated):</label>
          <input
            type="text"
            name="regions"
            value={formData.regions}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{isEditing ? "Update City" : "Add City"}</button>
      </form>

      <h2>City List</h2>
      <ul>
        {cities.map((city) => (
          <li key={city.id}>
            <strong>{city.name}</strong> - {city.country} ({city.population}{" "}
            people)
            <button onClick={() => handleEdit(city)}>Edit</button>
            <button onClick={() => handleDelete(city.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
