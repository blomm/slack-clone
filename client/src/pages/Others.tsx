import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Message, Container } from "semantic-ui-react";

const GET_USERS = gql`
  {
    allUsers {
      id
      username
      email
    }
  }
`;

export const Others = () => {
  let { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    return (
      <Container text>
        <Message negative>
          <Message.Header>Unable to access data</Message.Header>

          {error.graphQLErrors[0] ? (
            <p>{error.graphQLErrors[0].message}</p>
          ) : (
            <p>{error.message}</p>
          )}
        </Message>
      </Container>
    );
  }

  return (
    <>
      <div>Here are the OTHER users</div>
      <ul>
        {data.allUsers.map((u: any, index: number) => (
          <li key={index}>{u.email}</li>
        ))}
      </ul>
    </>
  );
};
