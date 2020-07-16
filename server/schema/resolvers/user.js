const bcrypt = require("bcrypt");
const { ApolloError } = require("apollo-server-express");
const auth = require("../../auth.js");
const formatErrors = require("../formatErrors");
const { authenticated } = require("../guards/auth-guard");

// Provide resolver functions for your schema fields
module.exports = {
  User: {
    teams: (_parent, _args, { models, user }, _server) =>
      models.sequelize.query(
        "select * from teams as team join user_team as member on team.id = member.team_id where member.user_id = ?",
        {
          replacements: [user.id],
          model: models.team,
        }
      ),
  },
  Query: {
    allUsers: authenticated(
      async (_parent, _args, { models, user }, _server) => {
        return await models.user.findAll();
      }
    ),
    me: authenticated(async (_parent, _args, { models, user }, _server) => {
      return await models.user.findOne({ where: { id: user.id } });
    }),
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
        return { ok: false, errors: formatErrors(error) };
      }
    },
  },
};
