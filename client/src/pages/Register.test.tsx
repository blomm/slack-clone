import React from "react";
import { REGISTER } from "../graphql/users";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  prettyDOM,
  act,
  waitForElement,
} from "@testing-library/react";
import { Register } from "./Register";
import { MockedProvider } from "@apollo/client/testing";
import TestRenderer from "react-test-renderer"; // ES6
import { debug } from "console";

// create the mock
let registerUser = false;
let mocks = [
  {
    request: {
      query: REGISTER,
      variables: {
        username: "test",
        email: "test@hotmail.com",
        password: "test",
      },
    },
    result: () => {
      registerUser = true;
      return {
        data: {
          ok: true,
          authToken: "fsdhjk",
          refreshToken: "fdsf",
        },
      };
    },
  },
];

it("should handle the useMutation", async () => {
  const { getByPlaceholderText, getByTestId, debug } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Register />
    </MockedProvider>
  );
  const usernameInput = getByPlaceholderText("Username") as HTMLInputElement;
  fireEvent.change(usernameInput, { target: { value: "test" } });
  expect(usernameInput.value).toBe("test");

  const emailInput = getByPlaceholderText("Email") as HTMLInputElement;
  fireEvent.change(emailInput, { target: { value: "test@hotmail.com" } });
  expect(emailInput.value).toBe("test@hotmail.com");

  const passwordInput = getByPlaceholderText("Password") as HTMLInputElement;
  fireEvent.change(passwordInput, { target: { value: "test" } });
  expect(passwordInput.value).toBe("test");

  const registerButton = getByTestId("submit-button");

  //await act(async () => {
  fireEvent.click(registerButton);
  //});

  await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response

  expect(registerUser).toBeTruthy();

  debug();
});
