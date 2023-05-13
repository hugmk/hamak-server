const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const config = require("../config");
const User = require("../models/users.model");

const JWT_SECRET = config.jwt.secret;

var controller = {
  signup: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      const userExists = await User.findOne({ email: email });
      if (userExists) {
        return res.status(400).send({ error: "Email already used" });
      }

      const usernameExists = await User.findOne({ username: username });
      if (usernameExists) {
        return res.status(400).send({ error: "Username already used" });
      }

      const hash = await argon2.hash(password);
      const user = new User({ username, email, password: hash });
      await user.save();

      const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
      res.send({ token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).send({ error: "Email or password incorrect" });
      }
  
      const pwMatch = await argon2.verify(user.password, password);
      if (!pwMatch) {
        return res.status(400).send({ error: "Email or password incorrect" });
      }
  
      const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
      res.send({ token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
};

module.exports = controller;
