import React, { useState } from "react";
import { Teams } from "../layout/Teams";
import { Channels } from "../layout/Channels";
import jwtDecode from "jwt-decode";
import { getAccessToken } from "../token";
import { AddChannelModal } from "../components/AddChannelModal";

export const SideBar = ({ currentTeam, teams }) => {
  const [channelModalOpen, setChannelModalOpen] = useState(false);

  let username;
  try {
    const { user } = jwtDecode(getAccessToken());
    username = user.username;
  } catch (error) {}

  // if theres no team with the given teamId, return the first team

  const handleAddChannel = () => {
    setChannelModalOpen(true);
  };

  const channelModalClosed = () => {
    setChannelModalOpen(false);
  };

  return (
    <>
      <Teams teams={teams}></Teams>
      <Channels
        team={currentTeam}
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
        teamId={currentTeam.id}
      />
    </>
  );
};
