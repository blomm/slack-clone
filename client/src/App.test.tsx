import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

it("renders create team link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Create Team/i);
});
