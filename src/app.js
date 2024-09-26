const express = require("express");
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignup } = require("./utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/authMddleware");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
    validateSignup(req);
    const encryptedPass = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptedPass,
    });
    console.log(user);
    await user.save();
    res.send("User added succesfully");
  } catch (error) {
    res.status(400).send("Error in saving the user " + error);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({ emailId });
    console.log(user);
    if(!user){
        throw Error("Invalid email/password")
    }
    await user.validatePassword(password);

    const token = await user.getJwt();
    res.cookie("token", token);
    res.send("User Login succesfully");
  } catch (error) {
    res.status(401).send("Unable to login " + error);
  }
});

app.get("/profile", userAuth, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

connectDB()
  .then(() => {
    console.log("connected to db succesfully");
    app.listen(3000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => console.log("error in connecting to db", err));
