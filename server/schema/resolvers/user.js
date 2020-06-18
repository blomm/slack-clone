const bcrypt = require("bcrypt");

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
    allUsers: (_parent, _args, { models }, _server) => models.user.findAll(),
    user: (_parent, { id }, { models }, _server) =>
      models.user.findOne({ where: { id } }),
  },
  Mutation: {
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
