import styled from "styled-components";
import { Input, Form } from "semantic-ui-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_DIRECT_MESSAGE } from "../graphql/directMessages";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

export default ({ recipient, teamId }) => {
  const [createMessage] = useMutation(CREATE_DIRECT_MESSAGE);
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data, e) => {
    await createMessage({
      variables: {
        text: data.messageInput,
        to: recipient.id,
        teamId,
      },
    });
    // https://react-hook-form.com/api#reset
    e.target.reset();
  };

  React.useEffect(() => {
    register({ name: "messageInput" }); // custom register
  }, []);

  const handleChange = (e) => {
    setValue("messageInput", e.target.value);
  };

  return (
    <SendMessageWrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Field>
          <Input
            name="messageInput"
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleSubmit(e);
              }
            }}
            fluid
            placeholder={`Message #${recipient.username}`}
          />
        </Form.Field>
      </Form>
    </SendMessageWrapper>
  );
};
