import { DirectMessages } from "./DirectMessages";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Header from "../layout/Header";
import SendDirectMessage from "../layout/SendDirectMessage";

interface DirectMessageContainerProps extends RouteComponentProps {
  members: any;
}

export const DirectMessageContainer: React.FC<DirectMessageContainerProps> = ({
  members,
  match,
}) => {
  const teamInt = parseInt((match.params as any).teamId, 10);
  const memberInt = parseInt((match.params as any).memberId, 10);
  const member = members.find((m) => m.id === memberInt)
    ? members.find((m) => m.id === memberInt)
    : members[0];
  return (
    <>
      <Header titletext={member.username} />
      <DirectMessages teamId={teamInt} recipientId={memberInt} />
      <SendDirectMessage
        recipient={member}
        teamId={teamInt}
      ></SendDirectMessage>
    </>
  );
};
