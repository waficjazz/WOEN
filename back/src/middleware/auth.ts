const jwt = require("jsonwebtoken");

const auth = (req: any, res: any, next: any) => {
  const header = req.headers.authorization;
  const Token = header && header.split(" ")[1];
  if (Token === undefined) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (Token !== undefined) {
    jwt.verify(
      Token,
      "JazzPriavteKey",
      (
        err: any,
        decodedToken: {
          userId: any;
        }
      ) => {
        if (err) {
          return next(new Error("You are not authorized to perform this action"));
        }
        req.id = decodedToken.userId;
        next();
      }
    );
  }
};

exports.auth = auth;
