import { useState, useEffect } from "react";
import { Person } from "./model";
import { usePeopleQuery } from "./query";
import "./people.css";
import { PersonForm } from "../peopleform/PersonForm.component";
import { PeopleTable } from "../peopletable/PeopleTable.component";

export function People() {
  const { data: fetchedPeople, loading, error } = usePeopleQuery();
  const [people, setPeople] = useState<Person[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (fetchedPeople) {
      setPeople(fetchedPeople);
    }
  }, [fetchedPeople]);

  const handleAddPerson = (newPerson: {
    name: string;
    show: string;
    actor: string;
    dob: string;
    movies: string;
  }) => {
    const newPersonWithId: Person = {
      ...newPerson,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
      movies: newPerson.movies.split(",").map((title) => ({
        title: title.trim(),
        released: "",
      })),
    };

    setPeople((prev) => [...prev, newPersonWithId]);
    window?.alert("Person added successfully!");
  };

  if (loading) return <p>Fetching People...</p>;
  if (error || !people) return <h2>Oops! Looks like something went wrong!</h2>;

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Add Person</button>
      )}
      {showForm && (
        <PersonForm
          onAddPerson={handleAddPerson}
          onCloseForm={() => setShowForm(false)}
          onBackToList={() => setShowForm(false)}
        />
      )}
      {!showForm && <PeopleTable people={people} />}
    </div>
  );
}
