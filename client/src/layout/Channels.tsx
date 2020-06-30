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
  userName: string;
  users: any;
  onAddChannelClick: any;
}

interface Team {
  id: number;
  name: string;
  channels: any[];
}

export const Channels: React.FC<ChannelProps> = ({
  team,
  userName,
  users,
  onAddChannelClick,
}) => {
  return (
    <ChannelsWrapper>
      <ChannelHeader>{team.name}</ChannelHeader>
      <ChannelSubHeader>{userName}</ChannelSubHeader>
      <ChannelSubHeader>
        Channels <Icon onClick={onAddChannelClick} name="add circle"></Icon>
      </ChannelSubHeader>
      <ChannelList>
        {team.channels.map((c, i) => (
          <Link to={`/view-team/${team.id}/${c.id}`} key={i}>
            <ChannelListItem># {c.name}</ChannelListItem>
          </Link>
        ))}
      </ChannelList>
      <ChannelSubHeader>Direct messages</ChannelSubHeader>
      <ChannelList>
        {users.map((u, i) => (
          <ChannelListItem key={i}>
            <Bubble on={false} /> {u.name}
          </ChannelListItem>
        ))}
      </ChannelList>
    </ChannelsWrapper>
  );
};
