var jwt = require("jsonwebtoken");
module.exports = {
  createAuthToken: (user, authSecret) => {
    //choose the payload fields
    const { id, email, username } = user;
    return jwt.sign({ user: { id, email, username } }, authSecret, {
      expiresIn: "15m",
    });
  },
  verifyAuthToken: (token, authSecret) => {
    return jwt.verify(token, authSecret);
  },
  createRefreshToken: (user, refreshSecret) => {
    //choose the payload fields
    const { id, email, username } = user;
    return jwt.sign({ user: { id, email, username } }, refreshSecret, {
      expiresIn: "7d",
    });
  },
};
