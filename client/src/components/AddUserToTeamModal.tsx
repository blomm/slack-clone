import React from "react";
import { Form, Message, Input, Modal, Button } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/react-hooks";
import { GET_TEAMS } from "../graphql/teams";
// import { CREATE_CHANNEL } from "../graphql/channels";
import { ADD_USER_TO_TEAM } from "../graphql/teams";

// interface TeamsResponse {
//   allTeams: {
//     id: number;
//     channels: {
//       id: number;
//       name: string;
//     }[];
//   }[];
// }

export const AddUserToTeamModal = ({ open, handleClose, teamId }) => {
  // working with custom component ui make react-hook-form a bit more tricky
  // please see: https://react-hook-form.com/get-started#WorkwithUIlibrary
  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = ({ email }) => {
    addUserToTeam({
      variables: { email, teamId },
    });
  };
  const handleChange = (e) => {
    setValue("email", e.target.value);
  };
  React.useEffect(() => {
    register({ name: "email" }); // custom register react
  }, [register]);
  const [addUserToTeam, { loading, error, data }] = useMutation(
    ADD_USER_TO_TEAM,
    {
      onCompleted: ({ addUserToTeam }: any) => {
        if (addUserToTeam.ok) handleClose(false);
      },
      onError: (err: any) => {
        console.log("error: " + err);
      },
    }
  );

  return (
    <Modal open={open}>
      <Modal.Header>Add user to team</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <Input
              onChange={handleChange}
              name="email"
              fluid
              placeholder="enter user email..."
            ></Input>
          </Form.Field>
          <Form.Group widths="equal">
            <Button
              fluid
              content="Cancel"
              onClick={() => handleClose(false)}
            ></Button>
            <Button fluid content="Add User"></Button>
          </Form.Group>
        </Form>
        {data && data.addUserToTeam.errors ? (
          <Message
            error
            list={data.addUserToTeam.errors.map((err) => err.message)}
          />
        ) : null}
      </Modal.Content>
    </Modal>
  );
};
