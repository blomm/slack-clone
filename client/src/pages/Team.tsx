import React, { useState } from "react";
import {
  Message,
  Header,
  Container,
  Form,
  Input,
  Button,
} from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

const CREATE_TEAM = gql`
  mutation createTeam($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export const Team = () => {
  const history = useHistory();

  const [createTeam, { data, error, loading }] = useMutation(CREATE_TEAM, {
    onCompleted(data) {
      if (data && data.createTeam.ok && !data.createTeam.errors) {
        history.push(`/view-team/${data.createTeam.team.id}`);
      }
    },
    onError(err) {},
  });

  const [name, setName] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    createTeam({
      variables: {
        name,
      },
    });
  };

  return (
    <Container text>
      <Header as="h2">Create team</Header>
      <Form>
        <Form.Field>
          <Input
            value={name}
            onChange={handleChange}
            fluid
            placeholder="enter team name..."
          ></Input>
        </Form.Field>
        <Button content="Submit" onClick={handleSubmit}></Button>
      </Form>
      {loading ? <p>Loading...</p> : null}
      {error ? (
        <Message negative>
          <Message.Header>Unable to create team</Message.Header>

          {error.graphQLErrors && error.graphQLErrors.length ? (
            <p>{error.graphQLErrors[0].message}</p>
          ) : (
            <p>{error.message}</p>
          )}
        </Message>
      ) : null}
      {data && data.createTeam.ok && !data.createTeam.errors ? (
        <Message positive>
          <Message.Header>Team created successfully</Message.Header>
        </Message>
      ) : null}
    </Container>
  );
};
