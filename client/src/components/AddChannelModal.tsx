import React from "react";
import { Message, Form, Input, Modal, Button } from "semantic-ui-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
//import { GET_TEAMS } from "../graphql/teams";
import { ME } from "../graphql/users";
import { CREATE_CHANNEL } from "../graphql/channels";
import { useHistory } from "react-router-dom";

export const AddChannelModal = ({ open, handleClose, teamId }) => {
  const history = useHistory();
  // working with custom component ui make react-hook-form a bit more tricky
  // please see: https://react-hook-form.com/get-started#WorkwithUIlibrary
  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = ({ channelName }) => {
    createChannel({
      variables: { name: channelName, public: false, teamId },
      optimisticResponse: {
        __typename: "Mutation",
        createChannel: {
          __typename: "CreateChannelResponse",
          response: true,
          errors: [],
          channel: {
            __typename: "Channel",
            id: -1,
            public: false,
            name: channelName,
          },
        },
      },
      update: (proxy, { data: { createChannel } }) => {
        const { response, channel } = createChannel;
        if (!response) {
          return;
        }
        // Read the data from our cache for this query.
        let data = proxy.readQuery({ query: ME }) as any; // as TeamsResponse;
        //add the new channel to the team
        data.me.teams.find((t) => t.id === teamId).channels.push(channel);
        // Write our data back to the cache with the new channel in it
        proxy.writeQuery({
          query: ME,
          data,
        });
      },
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
      onCompleted: ({ createChannel }: any) => {
        if (createChannel) {
          handleClose(false);
          history.push(`/view-team/${teamId}/${createChannel.channel.id}`);
        }
      },
      onError: (err: any) => {
        console.log("error: " + err);
      },
    }
  );

  return (
    <Modal open={open}>
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
            <Button
              fluid
              type="button"
              content="Cancel"
              onClick={() => handleClose(false)}
            ></Button>
            <Button fluid content="Create"></Button>
          </Form.Group>
        </Form>
        {error && (
          <Message negative>
            <Message.Header>Unable to create channel</Message.Header>

            {error.graphQLErrors && error.graphQLErrors.length ? (
              <p>{error.graphQLErrors[0].message}</p>
            ) : (
              <p>{error.message}</p>
            )}
          </Message>
        )}
      </Modal.Content>
    </Modal>
  );
};
