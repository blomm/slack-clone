const bcrypt = require("bcrypt");
const { ApolloError } = require("apollo-server-express");
const auth = require("../../auth.js");

// we can use this function to wrap any errors into an
// error object and send back with a 200 response to be
// interpreted on the frontend (and avoid handingling GraphQL errors)
const formatErrors = (e) => {
  try {
    return e.errors.map((x) => {
      let { path, message } = x;
      return { path, message };
    });
  } catch (error) {
    return [{ path: "unknown", message: "something went wrong" }];
  }
};
// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allUsers: async (_parent, _args, { models, user }, _server) => {
      if (!user) throw new ApolloError("Not logged in", 401);

      return await models.user.findAll();
    },
    user: async (_parent, { id }, { models, user }, _server) => {
      if (!user) throw new ApolloError("Not logged in", 401);

      return await models.user.findOne({ where: { id } });
    },
  },
  Mutation: {
    login: async (
      _parent,
      { email, password },
      { models, auth_secret, refresh_secret },
      _server
    ) => {
      let user = await models.user.findOne({
        where: { email },
      });

      if (!user) throw new ApolloError(`Could not find email ${email}`, 404);

      // bcrypt compare
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new ApolloError("Password failed", 401);

      const { refreshToken, authToken } = auth.createTokens(
        user,
        refresh_secret,
        auth_secret
      );

      return { authToken, refreshToken };
    },
    register: async (
      _parent,
      args,
      { models, auth_secret, refresh_secret },
      _server
    ) => {
      try {
        const user = await models.user.create(args);

        const { refreshToken, authToken } = auth.createTokens(
          user,
          refresh_secret,
          auth_secret
        );

        return { ok: true, user, refreshToken, authToken };
      } catch (error) {
        throw new ApolloError(`error ${error}`, 404);

        //return { ok: false, errors: formatErrors(error) };
      }
    },
  },
};
