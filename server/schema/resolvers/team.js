const formatErrors = require("../formatErrors");
const { ApolloError } = require("apollo-server-express");
const { authenticated, isTeamOwner } = require("../guards/auth-guard");
const sequelize = require("sequelize");
const models = require("../../models");

// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    // we don't really need all teams query anymore because we get the teams via the M
    allTeams: authenticated((_parent, _args, { models, user }, _server) =>
      // models.Team.findAll({
      //   include: [{ model: models.User, where: { id: user.id } }],
      // })
      // raw query way
      models.sequelize.query(
        "select * from teams as team join user_team as member on team.id = member.team_id where member.user_id = ?",
        {
          replacements: [user.id],
          model: models.Team,
        }
      )
    ),
    ownedTeams: authenticated((_parent, _args, { models, user }, _server) =>
      models.Team.findAll({ where: { owner_id: user.id } })
    ),
    team: authenticated((_parent, { id }, { models }, _server) =>
      models.Team.findOne({ where: { id } })
    ),
  },
  Team: {
    owner: (parent, _args, { models }, _server) =>
      models.User.findOne({ where: { id: parent.owner_id } }),
    channels: (parent, _args, { models }, _server) =>
      models.Channel.findAll({ where: { team_id: parent.id } }),
    members: async (parent, _args, { models }, _server) => {
      return await models.User.findAll({
        include: [{ model: models.Team, where: { id: parent.id } }],
      });
    },
  },
  Mutation: {
    addUserToTeam: authenticated(
      isTeamOwner(
        async (_parent, { email, teamId }, { models, user }, _server) => {
          try {
            const userToAddPromise = models.User.findOne({ where: { email } });
            const teamToAddToPromise = models.Team.findOne({
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

            const { user_id, team_id } = await models.User_Team.create({
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
      )
    ),
    createTeam: authenticated(
      async (_parent, args, { models, user }, _server) => {
        try {
          const team = await models.sequelize.transaction(async () => {
            const newTeam = await models.Team.create({
              ...args,
              owner_id: user.id,
            });

            await models.Channel.create({
              name: "general",
              public: true,
              teamId: newTeam.id,
            });
            await models.User_Team.create({
              userId: user.id,
              teamId: newTeam.id,
            });
            return newTeam;
          });
          return {
            ok: true,
            team,
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
