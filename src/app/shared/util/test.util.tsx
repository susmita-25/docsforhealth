import { ReactElement, ReactNode } from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { AxiosProvider } from "../context";

interface DefaultTestProvidersProps {
  children: ReactNode;
}

const DefaultTestProviders = ({ children }: DefaultTestProvidersProps) => (
  <AxiosProvider>{children}</AxiosProvider>
);

export const renderWithProviders = (ui: ReactElement) =>
  render(<DefaultTestProviders>{ui}</DefaultTestProviders>);

export const waitForLoading = async (loadingText = "Fetching") =>
  waitForElementToBeRemoved(() => screen.getByText(`${loadingText}...`));

export const sortTable = () => {
  let table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("peopleTable") as HTMLTableElement | null;
  if (!table) return;

  switching = true;
  dir = "asc";

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];

      if (
        dir === "asc" &&
        x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()
      ) {
        shouldSwitch = true;
        break;
      }
      if (
        dir === "desc" &&
        x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()
      ) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode?.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else if (switchcount === 0 && dir === "asc") {
      dir = "desc";
      switching = true;
    }
  }
};

export const filterTable = () => {
  const input =
    (
      document.getElementById("myInput") as HTMLInputElement | null
    )?.value.toUpperCase() || "";
  const table = document.getElementById(
    "peopleTable",
  ) as HTMLTableElement | null;
  if (!table) return;
  const tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      const txtValue = td.textContent || td.innerText;
      tr[i].style.display =
        txtValue.toUpperCase().indexOf(input) > -1 ? "" : "none";
    }
  }
};
