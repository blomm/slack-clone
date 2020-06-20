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

      // create jwt
      const authToken = auth.createAuthToken(user, auth_secret);
      // combine the user's password with the refresh secret
      // so if they reset the password, the old refresh token
      // becomes invalid
      const passwordControlledRefreshToken = user.password + refresh_secret;
      const refreshToken = auth.createRefreshToken(
        user,
        passwordControlledRefreshToken
      );

      return { authToken, refreshToken };
    },
    register: async (
      _parent,
      { password, ...otherArgs },
      { models },
      _server
    ) => {
      try {
        if (password.length < 5 || password.length > 100) {
          return {
            ok: false,
            errors: [
              {
                path: "password",
                message:
                  "The password needs to be between 5 and 100 characters",
              },
            ],
          };
        }
        // hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.user.create({
          ...otherArgs,
          password: hashedPassword,
        });
        return { ok: true, user };
      } catch (error) {
        return { ok: false, errors: formatErrors(error) };
      }
    },
  },
};
