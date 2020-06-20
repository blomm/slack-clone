// we are using commonJS syntax below
// to instead use es6 with babel, follow this tutorial
// https://www.apollographql.com/blog/tutorial-building-a-graphql-server-cddaa023c035

const express = require("express");
const { ApolloServer, ApolloError } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const models = require("./models");
const auth = require("./auth.js");
const typeDefs = require("./schema/typeDefs.js");
const resolvers = require("./schema/resolvers.js");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const auth_secret = "fdskljfzrlkdsjf";
const refresh_secret = "rewuiuryeiwofds";
const cors = require("cors");

const server = new ApolloServer({
  schema,
  // attach anything needed to the context
  context: ({ req, res }) => {
    // if there's no auth header, return without the user details
    if (!req.headers || !req.headers.authorization)
      return { models, auth_secret, req, res };

    const token = req.headers["authorization"] || "";

    const payload = auth.verifyAuthToken(token, auth_secret);

    if (!payload) throw new ApolloError("Unable to verify token", 401);
    // add the user payload to the context
    return {
      models,
      auth_secret,
      refresh_secret,
      user: payload,
    };
  },
});

const app = express();
server.applyMiddleware({
  app,
  cors: { origin: "http://localhost:3000", credentials: true },
});

// pass { force: true } to sync if we want to recreate
// all the tables
models.sequelize.sync().then(app.listen({ port: 4000 }));
// app.listen({ port: 4000 }, () =>
//   console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
// );
