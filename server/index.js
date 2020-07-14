// we are using commonJS syntax below
// to instead use es6 with babel, follow this tutorial
// https://www.apollographql.com/blog/tutorial-building-a-graphql-server-cddaa023c035

const http = require("http");
const express = require("express");
const { ApolloServer, ApolloError } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const models = require("./models");
const auth = require("./auth.js");
const typeDefs = require("./schema/typeDefs.js");
const resolvers = require("./schema/resolvers.js");
var jwt = require("jsonwebtoken");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const auth_secret = "fdskljfzrlkdsjf";
const refresh_secret = "rewuiuryeiwofds";

const cors = require("cors");
const { refreshTokens } = require("./auth.js");

const server = new ApolloServer({
  schema,
  subscriptions: {
    path: "/subscriptions",
    // keepAlive: <Number>
    // onConnect: <Function>
    // onDisconnect: <Function></Function>
  },
  // attach anything needed to the context
  context: async ({ req, res, connection }) => {
    // web socket have a connection property
    // and will come through here, we wont have set the
    // access token yet, so we'll need to use the refreshToken
    // and check that it is valid
    if (connection) {
      const refresh_token = connection.context.refreshToken;
      const token = connection.context.authToken;

      console.log(`refresh: ${refresh_token} and auth: ${token}`);

      let payload = {};
      try {
        if (token) {
          payload = jwt.verify(token, auth_secret);
        } else if (refresh_token) {
          let decoded_refresh = jwt.decode(refresh_token);
          let user = await models.user.findOne({
            where: { id: decoded_refresh.user.id },
          });
          const passwordRefreshSecret = user.password + refresh_secret;
          payload = auth.verifyToken(refresh_token, passwordRefreshSecret);
        }
      } catch (error) {
        throw new ApolloError(
          `Error in verifying token for websocket. ${JSON.stringify(error)}`,
          401
        );
      }

      //let payload = jwt.verify(token, auth_secret);

      // add the user payload to the context
      return {
        models,
        auth_secret,
        refresh_secret,
        user: payload.user,
      };
    } else {
      // if there's no authorization header, and no
      // refresh token, return without the user details
      // throw new ApolloError("Unable to get auth token", 401);
      const refresh_token = req.headers["x-refresh-token"];
      const token = req.headers["authorization"];

      // if we don't have auth or refresh token, then pass through without user
      if (!refresh_token && !token) {
        return { models, auth_secret, req, res };
      }

      // if we have refresh token, but no auth token then validate and attempt to create new tokens
      if (refresh_token && !token) {
        return refresh(res, refresh_token);
      }

      try {
        // verify will throw an error
        let payload = jwt.verify(token, auth_secret);

        // add the user payload to the context
        return {
          models,
          auth_secret,
          refresh_secret,
          user: payload.user,
        };
      } catch (error) {
        // errors when verifying auth-token will come in here
        if (error.name === "TokenExpiredError") {
          return refresh(res, refresh_token);
        } else {
          throw new ApolloError("Error in verifying token: " + error, 401);
        }
      }
    }
  },
});

const refresh = async (res, refresh_token) => {
  const { newRefreshToken, newAuthToken } = await auth.refreshTokens(
    refresh_token,
    models,
    auth_secret,
    refresh_secret
  );

  let payload = auth.verifyToken(newAuthToken, auth_secret);

  res.set({
    "Access-Control-Expose-Headers": "x-token, x-refresh-token", // The frontEnd can read refreshToken
    "x-token": newAuthToken,
    "x-refresh-token": newRefreshToken,
  });

  return {
    models,
    auth_secret,
    refresh_secret,
    user: payload.user,
  };
};

const app = express();
server.applyMiddleware({
  app,
  cors: { origin: "http://localhost:3000", credentials: true },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = 4000;

// pass { force: true } to sync if we want to recreate
// all the tables
models.sequelize.sync().then(
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  })
);

// const pubsub = new PubSub();
// module.exports = {
//   pubsub,
// };
// app.listen({ port: 4000 }, () =>
//   console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
// );
