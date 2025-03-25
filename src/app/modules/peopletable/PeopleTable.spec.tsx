import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PeopleTable } from "./PeopleTable.component";
import { Person } from "../people/model";

const mockPeople: Person[] = [
  {
    id: "1",
    name: "John Doe",
    show: "Super Show",
    actor: "Jane Smith",
    dob: "1990-01-01",
    updatedAt: "2023-01-01",
    movies: [
      { title: "Movie A", released: "2020" },
      { title: "Movie B", released: "2021" },
    ],
  },
  {
    id: "2",
    name: "Alice Johnson",
    show: "Another Show",
    actor: "Bob Brown",
    dob: "1985-05-15",
    updatedAt: "2023-02-01",
    movies: [{ title: "Movie C", released: "2019" }],
  },
];

describe("PeopleTable Component", () => {
  test("renders table headers correctly", () => {
    render(<PeopleTable people={mockPeople} />);

    const headers = [
      "Name",
      "Show",
      "Actor/Actress",
      "Date of Birth",
      "Movies",
    ];
    headers.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  test("displays the correct number of rows", () => {
    render(<PeopleTable people={mockPeople} />);
    const rows = screen.getAllByRole("row");

    // 1 header row + mockPeople.length data rows
    expect(rows.length).toBe(mockPeople.length + 1);
  });

  test("renders each person's data correctly", () => {
    render(<PeopleTable people={mockPeople} />);

    mockPeople.forEach((person) => {
      expect(screen.getByText(person.name)).toBeInTheDocument();
      expect(screen.getByText(person.show)).toBeInTheDocument();
      expect(screen.getByText(person.actor)).toBeInTheDocument();
      expect(screen.getByText(person.dob)).toBeInTheDocument();

      // Check the concatenated movie titles for each person
      const movieTitles = person.movies.map((movie) => movie.title).join(", ");
      expect(screen.getByText(movieTitles)).toBeInTheDocument();
    });
  });

  test("renders no data when people array is empty", () => {
    render(<PeopleTable people={[]} />);
    const rows = screen.getAllByRole("row");

    // Only the header row should be present
    expect(rows.length).toBe(1);
  });
});
