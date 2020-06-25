const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../auth");
const config = require("../config");

module.exports = (server) => {
  //Register User
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        //Hash Password
        user.password = hash;
        //Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
    //AUth USer
    server.post("/auth", async (req, res, next) => {
      const { email, password } = req.body;

      try {
        //Authenticate User
        const user = await auth.authenticate(email, password);

        //Create Jwt
        const token = jwt.sign(user.toJson(), config.JWT_SECRET, {
          expiresIn: "15m",
        });
        const { iat, exp } = jwt.decode(token);
        //Respond with Token
        res.send({ iat, exp, token });
      } catch (err) {
        //User unauthorized
        return next(new errors.UnauthorizedError(err));
      }
    });
  });
};
