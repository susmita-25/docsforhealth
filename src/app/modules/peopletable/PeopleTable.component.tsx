import React from "react";
import { Person } from "../people/model";

interface PeopleTableProps {
  people: Person[];
}

export const PeopleTable: React.FC<PeopleTableProps> = ({ people }) => {
  const renderCells = ({ name, show, actor, dob, movies }: Person) => (
    <>
      <td>{name}</td>
      <td>{show}</td>
      <td>{actor}</td>
      <td>{dob}</td>
      <td>{movies.map((movie) => movie.title).join(", ")}</td>
    </>
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Show</th>
          <th>Actor/Actress</th>
          <th>Date of Birth</th>
          <th>Movies</th>
        </tr>
      </thead>
      <tbody>
        {people.map((person, index) => (
          <tr key={index} role={"row"}>
            {renderCells(person)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
