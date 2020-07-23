import { DirectMessages } from "./DirectMessages";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import Header from "../layout/Header";
import SendMessage from "../layout/SendMessage";
import { useMutation } from "@apollo/client";
import { CREATE_DIRECT_MESSAGE } from "../graphql/directMessages";

interface DirectMessageContainerProps extends RouteComponentProps {
  members: any;
}

export const DirectMessageContainer: React.FC<DirectMessageContainerProps> = ({
  members,
  match,
}) => {
  const [createMessage] = useMutation(CREATE_DIRECT_MESSAGE);

  const teamInt = parseInt((match.params as any).teamId, 10);
  const memberInt = parseInt((match.params as any).memberId, 10);
  const member = members.find((m) => m.id === memberInt)
    ? members.find((m) => m.id === memberInt)
    : members[0];
  return (
    <>
      <Header titletext={member.username} />
      <DirectMessages teamId={teamInt} recipientId={memberInt} />
      <SendMessage
        placeholder={member.username}
        messageSubmitted={async (data, e) => {
          await createMessage({
            variables: {
              text: data.messageInput,
              to: member.id,
              teamId: teamInt,
            },
          });
          // https://react-hook-form.com/api#reset
          e.target.reset();
        }}
      ></SendMessage>
    </>
  );
};
