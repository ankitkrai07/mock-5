const express = require("express");
const userRouter = express.Router();
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRouter.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  try {
    if (password === confirmPassword) {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(400).send({ msg: "Something went wrong" });
        }
        if (hash) {
          const user = new UserModel({
            email,
            password: hash,
            confirmPassword: hash,
          });
          await user.save();
          res.status(200).send({ msg: "Registration has been done!" });
        }
      });
    } else {
      res.status(400).send({ msg: "password dosent match" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          res.status(200).send({
            msg: "Login Successful",
            token: jwt.sign({ userID: user._id }, "masai"),
          });
        } else {
          res.status(400).send({ msg: "Invalid Credentials" });
        }
      });
    }
  } catch (error) {
    res.status(400).send("Wrong Credentials");
  }
});

module.exports = { userRouter };
