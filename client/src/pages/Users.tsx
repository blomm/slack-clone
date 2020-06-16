import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_USERS = gql`
  {
    allUsers {
      email
    }
  }
`;

export const Users = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>error</p>;
  }

  console.log(data);
  return (
    <>
      <div>Here are the users</div>
      <ul>
        {data.allUsers.map((u: any, index: number) => (
          <li key={index}>{u.email}</li>
        ))}
      </ul>
    </>
  );
};
