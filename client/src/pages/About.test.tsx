import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { About } from "./About";

// https://testing-library.com/docs/intro

xit("should pass", () => {
  expect(true).toEqual(true);
});

xit("should render component", () => {
  const { container, asFragment } = render(<About />);
  expect(container.textContent).toBe("Hello from about");
});
