import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Teams } from "../layout/Teams";
import { Channels } from "../layout/Channels";
import { Container, Message } from "semantic-ui-react";
import jwtDecode from "jwt-decode";
import { getAccessToken } from "../token";
import { AddChannelModal } from "../components/AddChannelModal";
import { GET_TEAMS } from "../graphql/teams";

export const SideBar = ({ currentTeam }) => {
  const { loading, error, data } = useQuery(GET_TEAMS);

  const [channelModalOpen, setChannelModalOpen] = useState(false);

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

  // if theres no team with the given teamId, return the first team
  const team = data.allTeams.find((t) => t.id == currentTeam)
    ? data.allTeams.find((t) => t.id == currentTeam)
    : data.allTeams[0];

  const handleAddChannel = () => {
    setChannelModalOpen(true);
  };

  const channelModalClosed = () => {
    setChannelModalOpen(false);
  };

  return (
    <>
      <Teams
        teams={data.allTeams.map((t) => {
          return { id: t.id, letter: t.name.charAt(0).toUpperCase() };
        })}
      ></Teams>
      <Channels
        team={team}
        userName={username}
        users={[
          { id: 1, name: "slackbot" },
          { id: 2, name: "user 2" },
        ]}
        onAddChannelClick={handleAddChannel}
      ></Channels>
      <AddChannelModal
        open={channelModalOpen}
        handleClose={channelModalClosed}
        teamId={team.id}
      />
    </>
  );
};
