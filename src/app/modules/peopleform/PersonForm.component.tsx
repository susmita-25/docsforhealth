import React, { useState } from "react";
import "./PersonForm.css";

interface PersonFormProps {
  onAddPerson: (person: {
    name: string;
    show: string;
    actor: string;
    dob: string;
    movies: string;
  }) => void;
  onCloseForm: () => void;
  onBackToList: () => void;
}

export function PersonForm({
  onAddPerson,
  onCloseForm,
  onBackToList,
}: PersonFormProps) {
  const [newPerson, setNewPerson] = useState({
    name: "",
    show: "",
    actor: "",
    dob: "",
    movies: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPerson((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPerson(newPerson);
    setNewPerson({ name: "", show: "", actor: "", dob: "", movies: "" });
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
      <button type="button" onClick={onBackToList}>
        Back to table list
      </button>
    </form>
  );
}
