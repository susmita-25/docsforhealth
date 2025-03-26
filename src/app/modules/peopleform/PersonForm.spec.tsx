import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { PersonForm } from "./PersonForm.component";

// Mock function for testing
const renderPersonForm = (onAddPerson = vi.fn()) => {
  render(<PersonForm onAddPerson={onAddPerson} onCloseForm={vi.fn()} />);
  return onAddPerson;
};

describe("PersonForm", () => {
  test("renders input fields and submit button", () => {
    renderPersonForm();

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Show")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Actor/Actress")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Movies (comma-separated)"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Add Person")).toBeInTheDocument();
  });

  test("calls onAddPerson with correct data on submit", async () => {
    const mockAddPerson = renderPersonForm();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Show"), "Super Show");
    await user.type(screen.getByPlaceholderText("Actor/Actress"), "Jane Doe");
    await user.type(
      screen.getByPlaceholderText("Movies (comma-separated)"),
      "Movie 1, Movie 2",
    );

    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: "1990-01-01" },
    });

    await user.click(screen.getByText("Add Person"));

    // Adjusted expectation to ignore additional fields
    expect(mockAddPerson).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        show: "Super Show",
        actor: "Jane Doe",
        dob: "1990-01-01",
        movies: [
          {
            released: "Unknown",
            title: "Movie 1",
          },
          {
            released: "Unknown",
            title: "Movie 2",
          },
        ],
      }),
    );
  });

  test("clears input fields after submission", async () => {
    renderPersonForm();
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Name"), "Jane Smith");
    await user.type(screen.getByPlaceholderText("Show"), "Awesome Show");
    await user.type(screen.getByPlaceholderText("Actor/Actress"), "Actor Name");
    await user.type(
      screen.getByPlaceholderText("Movies (comma-separated)"),
      "Movie A, Movie B",
    );

    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: "2000-05-15" },
    });

    await user.click(screen.getByText("Add Person"));

    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Show")).toHaveValue("");
    expect(screen.getByPlaceholderText("Actor/Actress")).toHaveValue("");
    expect(screen.getByPlaceholderText("Movies (comma-separated)")).toHaveValue(
      "",
    );
    expect(screen.getByLabelText("Date of Birth")).toHaveValue("");
  });
});
