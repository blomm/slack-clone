import React, { useState } from "react";
import { Teams } from "../layout/Teams";
import { Channels } from "../layout/Channels";
import jwtDecode from "jwt-decode";
import { getAccessToken } from "../token";
import { AddChannelModal } from "../components/AddChannelModal";
import { AddUserToTeamModal } from "../components/AddUserToTeamModal";

export const SideBar = ({ currentTeam, teams }) => {
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const [addUserToTeamModalOpen, setAddUserToTeamModalOpen] = useState(false);

  let user;
  try {
    user = jwtDecode(getAccessToken()).user;
    //username = user.username;
  } catch (error) {}

  // if theres no team with the given teamId, return the first team

  const handleAddChannel = (val: boolean) => {
    setChannelModalOpen(val);
  };

  const handleAddUserToTeam = (val: boolean) => {
    setAddUserToTeamModalOpen(val);
  };

  return (
    <>
      <Teams teams={teams}></Teams>
      <Channels
        team={currentTeam}
        user={user}
        users={[
          { id: 1, name: "slackbot" },
          { id: 2, name: "user 2" },
        ]}
        onAddChannelClick={handleAddChannel}
        onInvitePeopleClick={handleAddUserToTeam}
      ></Channels>
      <AddChannelModal
        open={channelModalOpen}
        handleClose={handleAddChannel}
        teamId={currentTeam.id}
      />
      <AddUserToTeamModal
        open={addUserToTeamModalOpen}
        handleClose={handleAddUserToTeam}
        teamId={currentTeam.id}
      ></AddUserToTeamModal>
    </>
  );
};
