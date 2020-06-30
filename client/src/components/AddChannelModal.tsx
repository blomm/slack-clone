import React from "react";
import { Form, Input, Modal, Button } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const CREATE_CHANNEL = gql`
  mutation createChannel($name: String!, $teamId: Int!, $public: Boolean) {
    createChannel(name: $name, public: $public, teamId: $teamId)
  }
`;

export const AddChannelModal = ({ open, handleClose, teamId }) => {
  // working with custom component ui make react-hook-form a bit more tricky
  // please see: https://react-hook-form.com/get-started#WorkwithUIlibrary
  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = ({ channelName }) => {
    createChannel({
      variables: { name: channelName, public: false, teamId },
    });
  };
  const handleChange = (e) => {
    setValue("channelName", e.target.value);
  };
  React.useEffect(() => {
    register({ name: "channelName" }); // custom register react
  }, [register]);
  const [createChannel, { loading, error, data }] = useMutation(
    CREATE_CHANNEL,
    {
      onCompleted: (data: any) => {
        handleClose();
      },
      onError: (err: any) => {
        console.log("error: " + err);
      },
    }
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>Create channel</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <Input
              onChange={handleChange}
              name="channelName"
              fluid
              placeholder="enter channel name..."
            ></Input>
          </Form.Field>
          <Form.Group widths="equal">
            <Button fluid content="Cancel" onClick={handleClose}></Button>
            <Button fluid content="Create"></Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
