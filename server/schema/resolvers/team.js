const formatErrors = require("../formatErrors");
const { ApolloError } = require("apollo-server-express");
const { authenticated } = require("../guards/auth-guard");

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allTeams: authenticated((_parent, _args, { models, user }, _server) =>
      models.team.findAll({ where: { owner_id: user.id } })
    ),
    team: authenticated((_parent, { id }, { models }, _server) =>
      models.team.findOne({ where: { id } })
    ),
  },
  Team: {
    owner: (parent, _args, { models }, _server) =>
      models.user.findOne({ where: { id: parent.owner_id } }),
    channels: (parent, _args, { models }, _server) =>
      models.channel.findAll({ where: { team_id: parent.id } }),
    // users: (parent, _args, { models }, _server) =>
    //   models.user.findAll()
  },
  Mutation: {
    addUserToTeam: authenticated(
      async (_parent, { email, teamId }, { models, user }, _server) => {
        try {
          const userToAddPromise = models.user.findOne({ where: { email } });
          const teamToAddToPromise = models.team.findOne({
            where: { id: teamId },
          });

          const [userToAdd, teamToAddTo] = await Promise.all([
            userToAddPromise,
            teamToAddToPromise,
          ]);

          if (teamToAddTo.owner_id != user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: `Not authorised to add users to ${teamToAddTo.name}`,
                },
              ],
            };
          }
          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: `Could not find user with email: ${email}`,
                },
              ],
            };
          }

          const { user_id, team_id } = await models.user_team.create({
            userId: userToAdd.id,
            teamId,
          });
          return {
            ok: true,
            userTeam: { user_id, team_id },
          };
        } catch (error) {
          return { ok: false, errors: formatErrors(error) };
        }
      }
    ),
    createTeam: authenticated(
      async (_parent, args, { models, user }, _server) => {
        try {
          const newTeam = await models.team.create({
            ...args,
            owner_id: user.id,
          });
          await models.channel.create({
            name: "general",
            public: true,
            teamId: newTeam.id,
          });
          return {
            ok: true,
            team: newTeam,
          };
        } catch (error) {
          return {
            ok: false,
            errors: formatErrors(error),
          };
        }
      }
    ),
  },
};
