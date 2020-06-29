import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";

const TeamsWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362233;
  color: #ffffff;
`;

const TeamList = styled.ul`
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TeamListItem = styled.li`
  width: 40px;
  height: 40px;
  color: #ffffff;
  background-color: #616061;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 22px;
  &:hover {
    border-style: solid;
    border-width: thick;
    border-color: #767676;
  }
`;

interface TeamsProps {
  teams: any[];
}

export const Teams: React.FC<TeamsProps> = ({ teams }) => {
  return (
    <TeamsWrapper>
      <TeamList>
        {teams.map((t, i) => (
          <Link to={`/view-team/${t.id}`} key={i}>
            <TeamListItem>{t.letter}</TeamListItem>
          </Link>
        ))}
      </TeamList>
    </TeamsWrapper>
  );
};
