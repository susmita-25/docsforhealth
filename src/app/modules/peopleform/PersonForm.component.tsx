import React, { useState } from "react";
import "./PersonForm.css";
import { Person } from "../people/model";

interface PersonFormProps {
  onAddPerson: (person: Person) => void;
  onCloseForm: () => void;
}

export function PersonForm({ onAddPerson, onCloseForm }: PersonFormProps) {
  const [newPerson, setNewPerson] = useState({
    name: "",
    show: "",
    actor: "",
    dob: "",
    movies: "",
    id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPerson((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPerson({
      ...newPerson,
      movies: newPerson.movies.split(",").map((movie) => ({
        title: movie.trim(),
        released: "Unknown", // Providing a default value for 'released'
      })),
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
    });

    // Reset form fields
    setNewPerson({
      name: "",
      show: "",
      actor: "",
      dob: "",
      movies: "",
      id: "",
    });
    onCloseForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={newPerson.name}
        onChange={handleInputChange}
        required
      />
      <input
        name="show"
        placeholder="Show"
        value={newPerson.show}
        onChange={handleInputChange}
        required
      />
      <input
        name="actor"
        placeholder="Actor/Actress"
        value={newPerson.actor}
        onChange={handleInputChange}
        required
      />
      <label htmlFor="dob">Date of Birth</label>
      <input
        id="dob"
        name="dob"
        type="date"
        value={newPerson.dob}
        onChange={handleInputChange}
        required
      />
      <input
        name="movies"
        placeholder="Movies (comma-separated)"
        value={newPerson.movies}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Add Person</button>
      <button type="button" onClick={onCloseForm}>
        Back to table list
      </button>
    </form>
  );
}
