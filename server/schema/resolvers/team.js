// Provide resolver functions for your schema fields
module.exports = {
  Query: {
    allTeams: (_parent, _args, { models }, _server) => models.team.findAll(),
    team: (_parent, { id }, { models }, _server) =>
      models.team.findOne({ where: { id } }),
  },
  Mutation: {
    createTeam: (_parent, args, { models, user }, _server) => {
      models.team.create({ ...args, owner_id: user.id });
    },
  },
};
