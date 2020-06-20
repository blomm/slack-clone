var jwt = require("jsonwebtoken");

const createRefreshToken = (user, refreshSecret) => {
  // choose the payload fields
  const { id, email, username } = user;
  const passwordRefreshToken = user.password + refreshSecret;

  return jwt.sign({ user: { id, email, username } }, passwordRefreshToken, {
    expiresIn: "7d",
  });
};

const createAuthToken = (user, authSecret) => {
  // choose the payload fields
  const { id, email, username } = user;
  return jwt.sign({ user: { id, email, username } }, authSecret, {
    expiresIn: "15m",
  });
};

module.exports = {
  verifyAuthToken: (token, authSecret) => {
    return jwt.verify(token, authSecret);
  },

  createTokens: (user, refreshSecret, authSecret) => {
    return {
      refreshToken: createRefreshToken(user, refreshSecret),
      authToken: createAuthToken(user, authSecret),
    };
  },
};
