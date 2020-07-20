import styled from "styled-components";
import { Input, Form } from "semantic-ui-react";
import React from "react";
import { useForm } from "react-hook-form";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

export default ({ placeholder, messageSubmitted }) => {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = messageSubmitted;

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
            placeholder={`Message #${placeholder}`}
          />
        </Form.Field>
      </Form>
    </SendMessageWrapper>
  );
};
