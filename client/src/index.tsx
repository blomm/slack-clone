import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

import { ApolloClient } from "@apollo/client";
import { ApolloCache, InMemoryCache } from "@apollo/client/cache";
import { onError } from "@apollo/client/link/error";

import {
  ApolloProvider,
  ApolloLink,
  Observable,
  split,
  HttpLink,
} from "@apollo/client";

import "semantic-ui-css/semantic.min.css";
import { getAccessToken, setAccessToken } from "./token";

const request = async (operation) => {
  operation.setContext({
    headers: setHeaders(),
  });
};

const setHeaders = () => {
  let headers = {
    authorization: getAccessToken(),
  };
  const refresh = localStorage.getItem("REFRESH_TOKEN");
  if (refresh) {
    headers["x-refresh-token"] = refresh;
  }
  return headers;
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const readHeaderLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    if (headers) {
      const refreshToken = headers.get("x-refresh-token");
      const authToken = headers.get("x-token");
      if (refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", refreshToken);
      }
      if (authToken) {
        setAccessToken(authToken);
      }
    }

    return response;
  });
});

// const t = getAccessToken();
// console.log(`token is ${t}`);
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      // we may not have the access token available when user tries to create web-socket-link
      // in which case we'll need to use the refresh token and check this server side
      authToken: getAccessToken(),
      refreshToken: localStorage.getItem("REFRESH_TOKEN"),
    },
  },
});
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const getWebSocketLinks = () => {
  return ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    requestLink,
    //readHeaderLink,
    wsLink,
  ]);
};

const getHttpLinks = () => {
  return ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    requestLink,
    readHeaderLink,
    httpLink,
  ]);
};
// queries and mutations will go over HTTP as normal, but
// subscriptions will be done over the websocket transport.
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  getWebSocketLinks(),
  getHttpLinks()
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
