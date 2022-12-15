const jwt = require("jsonwebtoken");

export const getTokenId = (token: string) => {
  let userId: string = "";
  jwt.verify(
    token,
    "JazzPriavteKey",
    (
      err: any,
      decodedToken: {
        userId: any;
      }
    ) => {
      if (err) {
        return err;
      }
      userId = decodedToken.userId;
    }
  );
  return userId.toString();
};
