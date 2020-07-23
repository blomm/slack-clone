import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
} from "@testing-library/react";

import { Login } from "./Login";
import { MockedProvider } from "@apollo/client/testing";
import renderer from "react-test-renderer"; // ES6

import { LOGIN } from "../graphql/users";
import { setAccessToken } from "../token";

var localStorageMock = (function () {
  var store = {};
  return {
    getItem: function (key) {
      return store[key];
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key) {
      delete store[key];
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock("../token", () => ({
  setAccessToken: jest.fn(),
}));

// https://testing-library.com/docs/intro

let loginCalled = false;
let mocks = [
  {
    request: {
      query: LOGIN,
      variables: {
        email: "",
        password: "",
      },
    },
    result: () => {
      loginCalled = true;
      return {
        data: {
          authToken: "axr543wrer423",
          refreshToken: "rw78wrhj78",
        },
      };
    },
  },
];

// function wait(ms: number = 10): Promise<void> {
//   return new Promise((resolve) => {
//     return setTimeout(resolve, ms);
//   });
// }

it("should render loading state initially", async () => {
  const { getByTestId, debug } = render(
    <MockedProvider mocks={mocks} addTypename={true}>
      <Login />
    </MockedProvider>
  );
  const loginButton = getByTestId("login-submit");

  fireEvent.click(loginButton);
  await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response

  expect(loginCalled).toBeTruthy();
});
