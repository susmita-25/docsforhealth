import { useState, useEffect } from "react";
import { Person } from "./model";
import { usePeopleQuery } from "./query";
import "./people.css";
import { PersonForm } from "../peopleform/PersonForm.component";
import { filterTable, sortTable } from "../../shared/util";

export function People() {
  const { data: fetchedPeople, loading, error } = usePeopleQuery();
  const [people, setPeople] = useState<Person[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // useEffect(() => {
  //   const startIdx = (currentPage - 1) * itemsPerPage;
  //   setPeople(fetchedPeople?.slice(startIdx, startIdx + itemsPerPage) || []);
  // }, [fetchedPeople, currentPage, itemsPerPage, people]); // Include people as a dependency
  useEffect(() => {
    if (fetchedPeople) {
      const startIdx = (currentPage - 1) * itemsPerPage;
      setPeople(fetchedPeople.slice(startIdx, startIdx + itemsPerPage));
    }
  }, [fetchedPeople, currentPage, itemsPerPage]);

  const totalPages = fetchedPeople
    ? Math.ceil(fetchedPeople.length / itemsPerPage)
    : 0;

  const handleAddPerson = (newPerson: Person) => {
    const personWithIdAndTimestamp: Person = {
      ...newPerson,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
    };

    // Update both fetchedPeople and people state
    const updatedPeople = [...people, personWithIdAndTimestamp];
    setPeople(updatedPeople);

    window.alert("Person added successfully!");
  };

  const changePage = (newPage: number) => setCurrentPage(newPage);

  if (loading && people.length === 0) return <p>Fetching People...</p>;
  if (error) return <h2>Oops! Something went wrong!</h2>;

  return (
    <div>
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Add Person</button>
      )}
      {showForm && (
        <PersonForm
          onAddPerson={handleAddPerson}
          onCloseForm={() => {
            setShowForm(false);
            setShowForm(false);
          }}
        />
      )}
      {!showForm && (
        <>
          <input
            type="text"
            aria-label="Search"
            id="myInput"
            placeholder="Search People"
            onKeyUp={filterTable}
          />
          <table id="peopleTable">
            <thead>
              <tr role="row">
                <th onClick={sortTable} aria-sort="ascending">
                  Name
                </th>
                <th>Show</th>
                <th>Actor/Actress</th>
                <th>Date of Birth</th>
                <th>Movies</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person, index) => (
                <tr key={index}>
                  <td>{person.name}</td>
                  <td>{person.show}</td>
                  <td>{person.actor}</td>
                  <td>{person.dob}</td>
                  <td>
                    {person.movies.map((movie) => movie.title).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={() => changePage(1)} disabled={currentPage === 1}>
              First
            </button>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Showing {currentPage * itemsPerPage - (itemsPerPage - 1)}-
              {currentPage * itemsPerPage} of {fetchedPeople?.length || 0}
            </span>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
            <select
              role="combobox"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
