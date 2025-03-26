import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { getPeople } from "../../../api-mocks/handlers/people.handler";
import { server } from "../../../api-mocks/server";
import { renderWithProviders, waitForLoading } from "../../shared/util";
import { People } from "./people.component";

const renderPeople = async () => {
  renderWithProviders(<People />);

  await waitForLoading("Fetching People");
};

describe("People", () => {
  test("renders", async () => {
    await renderPeople();

    expect(screen.getByRole("table")).toBeInTheDocument();
    // window.console.log(screen.getAllByRole("row"));
  });

  test("handles an error response", async () => {
    /**
     * The following can be changed if MSW is not being used
     */
    server.use(http.get(getPeople.info.path, () => HttpResponse.error()));
    /****************************************************************************/

    await renderPeople();

    expect(
      screen.getByRole("heading", {
        name: /Oops!.*went wrong!/i, // Case-insensitive partial match
      }),
    ).toBeInTheDocument();
  });

  test("displays an empty state", async () => {
    /**
     * HINT: You need to alter the response from the api
     * You can do so for this test
     */

    server.use(http.get(getPeople.info.path, () => HttpResponse.json([])));
    await renderPeople();

    await waitFor(async () =>
      expect((await screen.findAllByRole("row")).slice(1)).toHaveLength(0),
    );
  });

  test("should display 10 people by default", async () => {
    await renderPeople();

    // Ensure the table is rendered
    expect(screen.getByRole("table")).toBeInTheDocument();
    // window.setTimeout(3000);
    await waitFor(async () =>
      expect((await screen.findAllByRole("row")).slice(1)).toHaveLength(10),
    );
    // const rows = (await screen.findAllByRole("row")).slice(1);
    // window.console.log(rows);
    // expect((await screen.findAllByRole("row")).slice(1)).toHaveLength(10);
  });

  describe("Filtering", () => {
    test("should select the sort column", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      await user.click(screen.getByRole("columnheader", { name: "Name" }));

      await waitFor(async () =>
        expect(
          screen.getByRole("columnheader", { name: "Name" }),
        ).toHaveAttribute("aria-sort", "ascending"),
      );

      await waitFor(async () =>
        expect(
          within(screen.getAllByRole("row")[1]).getByText("Bernice Ryan"),
        ).toBeInTheDocument(),
      );

      // await user.click(screen.getByRole("columnheader", { name: "Name" }));
      // screen.getByRole("columnheader", { name: "Name" }),
      //   ).add("aria-sort", "descending");

      // await waitFor(async () =>
      //   expect(
      //     screen.getByRole("columnheader", { name: "Name" }),
      //   ).toHaveAttribute("aria-sort", "descending"),
      // );

      // await waitFor(async () =>
      //   expect(
      //     within(screen.getAllByRole("row")[1]).getByText("Veronica Blake"),
      //   ).toBeInTheDocument(),
      // );
    });

    test("should filter the list by peoples name", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      const searchInput = screen.getByRole("textbox", { name: /Search/i });
      expect(searchInput).toBeInTheDocument();

      await user.type(searchInput, "san");

      expect(screen.getAllByRole("row").slice(1)).toHaveLength(1);

      // expect(
      //   within(screen.getAllByRole("row")[1]).getByText(""),
      // ).toBeInTheDocument();

      expect(
        within(screen.getAllByRole("row")[2]).getByText("Sanford Gentry"),
      ).toBeInTheDocument();
    });
  });

  describe("Pagination", async () => {
    test("should update number of people displayed", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      await waitFor(async () =>
        expect(screen.getAllByRole("row").slice(1)).toHaveLength(10),
      );

      await waitFor(async () =>
        expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument(),
      );

      await user.selectOptions(screen.getByRole("combobox"), "15");

      await waitFor(async () =>
        expect(screen.getAllByRole("row").slice(1)).toHaveLength(15),
      );

      await waitFor(async () =>
        expect(screen.getByText("Showing 1-15 of 100")).toBeInTheDocument(),
      );

      await user.selectOptions(screen.getByRole("combobox"), "20");

      await waitFor(async () =>
        expect(screen.getByText("Showing 1-20 of 100")).toBeInTheDocument(),
      );

      await waitFor(async () =>
        expect(screen.getAllByRole("row").slice(1)).toHaveLength(20),
      );
    });

    test("should go the next page", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.getByText("Showing 11-20 of 100")).toBeInTheDocument();
    });

    test("should go the previous page", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.getByText("Showing 11-20 of 100")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Previous" }));

      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();
    });

    test("should go the last page, and not the next page", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Last" }));

      expect(screen.getByText("Showing 91-100 of 100")).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Last" })).toBeDisabled();
    });

    test("should go the first page, and not the previous page", async () => {
      const user = userEvent.setup();

      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();

      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Last" }));

      expect(screen.getByText("Showing 91-100 of 100")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "First" }));

      expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "First" })).toBeDisabled();
    });
  });
});
