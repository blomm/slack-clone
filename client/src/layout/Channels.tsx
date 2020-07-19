import styled from "styled-components";
import React from "react";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const ChannelsWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #52364e;
  color: #ffffff;
`;

const paddingLeft = "padding-left: 10px;";
const noPaddingLeft = "padding-left: 0px;";
const headerFontSize = "font-size: 16px;";

const ChannelHeader = styled.h1`
  margin-top: 10px;
  ${paddingLeft}
  ${headerFontSize}
`;

const ChannelSubHeader = styled.div`
  margin-top: 10px;
  ${paddingLeft}
`;

const ChannelList = styled.ul`
  margin: 0;
  list-style: none;
  ${noPaddingLeft}
`;

const ChannelListItem = styled.li`
  ${paddingLeft}
  &:hover {
    background-color: #362233;
  }
`;

const green = {
  color: "#38978d",
};

const Bubble = ({ on = true }) => {
  return on ? <span style={green}>&#9679;</span> : <span>&#9675;</span>;
};

interface ChannelProps {
  team: Team;
  user: any;
  onAddChannelClick: any;
  onInvitePeopleClick: any;
}

interface Team {
  id: number;
  owner: any;
  members: any[];
  name: string;
  channels: any[];
}

export const Channels: React.FC<ChannelProps> = ({
  team,
  user,
  onAddChannelClick,
  onInvitePeopleClick,
}) => {
  let isOwner = user.id === team.owner.id;
  return (
    <ChannelsWrapper>
      <ChannelHeader>{team.name}</ChannelHeader>
      <ChannelSubHeader>{user.userName}</ChannelSubHeader>
      <ChannelSubHeader>
        Channels{" "}
        {isOwner ? (
          <Icon
            onClick={() => onAddChannelClick(true)}
            name="add circle"
          ></Icon>
        ) : null}
      </ChannelSubHeader>
      <ChannelList>
        {team.channels.map((channel, i) => (
          <Link to={`/view-team/${team.id}/chan/${channel.id}`} key={i}>
            <ChannelListItem># {channel.name}</ChannelListItem>
          </Link>
        ))}
      </ChannelList>
      <ChannelSubHeader>Direct messages</ChannelSubHeader>
      <ChannelList>
        {team.members.map((member, i) =>
          member.id !== user.id ? (
            <Link to={`/view-team/${team.id}/dm/${member.id}`} key={i}>
              <ChannelListItem key={i}>
                <Bubble on={false} /> {member.username}
              </ChannelListItem>
            </Link>
          ) : null
        )}
      </ChannelList>
      {isOwner ? (
        <div style={{ paddingLeft: 10 }}>
          <a href="#invite-people" onClick={() => onInvitePeopleClick(true)}>
            + Invite People
          </a>
        </div>
      ) : null}
    </ChannelsWrapper>
  );
};
