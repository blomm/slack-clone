var jwt = require("jsonwebtoken");
const { ApolloError } = require("apollo-server-express");

const createRefreshToken = (user, refreshSecret) => {
  // choose the payload fields
  const { id, email, username } = user;
  const passwordRefreshSecret = user.password + refreshSecret;

  return jwt.sign({ user: { id, email, username } }, passwordRefreshSecret, {
    expiresIn: "7d",
  });
};

const createAuthToken = (user, authSecret) => {
  // choose the payload fields
  // we don't want the password to go into the payload
  const { id, email, username } = user;
  return jwt.sign({ user: { id, email, username } }, authSecret, {
    expiresIn: "1d",
  });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  verifyToken: (token, secret) => {
    return verifyToken(token, secret);
  },

  refreshTokens: async (refreshToken, models, authSecret, refreshSecret) => {
    // decode the refresh token
    let payload = jwt.decode(refreshToken); //verifyToken(refreshToken, passwordRefreshSecret);
    //throw new ApolloError(`REFRESH_PAYLOAD ${payload}`, 401);
    let user = await models.user.findOne({
      where: { id: payload.user.id },
    });
    if (!user) {
      return {};
    }
    const refresh = createRefreshToken(user, refreshSecret);
    const auth = createAuthToken(user, authSecret);
    return {
      newRefreshToken: refresh,
      newAuthToken: auth,
    };
    // we can recreate tokens
    //return this.createTokens(user, passwordRefreshSecret, authSecret);
  },

  createTokens: (user, refreshSecret, authSecret) => {
    return {
      refreshToken: createRefreshToken(user, refreshSecret),
      authToken: createAuthToken(user, authSecret),
    };
  },
};
