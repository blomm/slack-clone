import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Teams } from "../layout/Teams";
import { Channels } from "../layout/Channels";
import { Container, Message } from "semantic-ui-react";
import jwtDecode from "jwt-decode";
import { getAccessToken } from "../token";

const GET_TEAMS = gql`
  {
    allTeams {
      id
      name
      owner {
        email
      }
      channels {
        id
        name
      }
    }
  }
`;

export const SideBar = ({ currentTeam }) => {
  const { loading, error, data } = useQuery(GET_TEAMS);

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

  let username;
  try {
    const { user } = jwtDecode(getAccessToken());
    username = user.username;
  } catch (error) {}

  return (
    <>
      <Teams
        teams={data.allTeams.map((t) => {
          return { id: t.id, letter: t.name.charAt(0).toUpperCase() };
        })}
      ></Teams>
      <Channels
        teamName={data.allTeams.find((t) => t.id == currentTeam).name}
        userName={username}
        users={[
          { id: 1, name: "slackbot" },
          { id: 2, name: "user 2" },
        ]}
        channels={data.allTeams.find((t) => t.id == currentTeam).channels}
      ></Channels>
    </>
  );
};
