const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
var _ = require("lodash");
var jwt = require("jsonwebtoken");
var cors = require("cors");
const auth = require("./auth");
const help = require("./helpers");
const { success_response, failed_response,validatePassword } = require("./helpers");
const encryptPAss = help.hasPass;
const checkpass = help.checkPass;
const db = require("./db");
const User = require("./models/user");

require("dotenv").config();

console.log(process.env.PRIVATE_KEY);



// FUNCTIONS
app.use(cors());
app.use(express.json());

// INITIAL ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    name: "API IS WORKING",
  });
});

// SIGN UP

app.post("/signin", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let mobile = req.body.mobile;
  let confirmPass = req.body.confirm_password 

  // CHECK VALIDATION
  if (_.isEmpty(username)) {
    return res.status(400).json({
      status: false,
      message: "Please enter an Username ",
    });
  }
  if (_.isEmpty(password)) {
    return res.status(400).json({
      status: false,
      message: "Please enter a Password",
    });
  }

  if (validatePassword(password)) {
    return res.status(400).json({
      status: false,
      message: "Password should contain atleast some text , number and one special character",
    });
  }

  if (_.isEmpty(mobile)) {
    return res.status(400).json({
      status: false,
      message: "Please enter a Mobile Number",
    });
  }
  if (_.isEmpty(email)) {
    return res.status(400).json({
      status: false,
      message: "Please enter an Email",
    });
  }

  if (_.isEmpty(confirmPass)) {
    return res.status(400).json({
      status: false,
      message: "Confirm password is required",
    });
  }

  if(password !== confirmPass){
    return res.status(400).json({
      status: false,
      message: "Password and Confirm password must match.",
    });
  }

  //  Check if the user already exist
  try {
    console.log(email);
    verify_user = await User.findOne({ email: email });
    //console.log("EMAIL:", verify_user);

    if (!_.isEmpty(verify_user)) {
      message = "User already exists !";
      return res.status(400).json(failed_response(400, message, false));
    }

    if (verify_user !== null) {
      message = "User already exists !";
      return res.status(400).json(failed_response(400, message, false));
    }
  } catch (err) {
    message = "Db error";
    return res.status(400).json(failed_response(400, err.message, false));
  }

  // ENCRYPT PASSWORD
  let cryptPass = await encryptPAss(password);

  // USER OBJECT HERE
  const new_user = {
    username: username,
    password: cryptPass,
    mobile,
    email,
  };

  // CREATE NEW USER

  const user = new User(new_user);
  try {
    const newUser = await user.save();

    // GENERATE ACCESS TOKEN HERE
    jwt.sign(
      { email },
      process.env.PRIVATE_KEY,
      { expiresIn: "1h" },
      function (err, token) {
        if (!_.isEmpty(token)) {
          res
            .status(200)
            .json(
              success_response(
                200,
                "User registered successfully",
                { access_token: token, user_id: newUser?.id },
                true
              )
            );
        }

        if (err !== null) {
          res.status(400).json(failed_response(400, err.message, false));
        }
      }
    );
  } catch (err) {
    res.status(400).json(failed_response(400, err.message, false));
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  console.log(req.body);

  // GET CRETEDENTIALS

  let email = req.body.email;
  let password = req.body.password;

  // CHECK VALIDATION
  if (_.isEmpty(email)) {
    return res.status(400).json({
      status: false,
      message: "Please enter an email",
    });
  }
  if (_.isEmpty(password)) {
    return res.status(400).json({
      status: false,
      message: "Please enter a password",
    });
  }

  // CHECK IF THE USER EXIST
  let users = "";
  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (_.isEmpty(user)) {
      return res
        .status(400)
        .json(
          failed_response(
            400,
            "email is worng or user dosen't exists",
            false
          )
        );
    }

    users = user;
  } catch (err) {
    return res.status(400).json(failed_response(400, err.message, false));
  }

  if(_.isEmpty(users)){

    message = "User Dosent Exist"
    return res.status(400).json(failed_response(400, message, false));
  }

  // CHECHK PASS VALIDATION FROM DATABASE
  if (!checkpass(password, users.password)) {
    return res
      .status(400)
      .json(failed_response(400, "You have entered a wrong passsword", false));
  }

  // JWT LOGIN TOKEN GENERATION
  try {
    jwt.sign(
      { email },
      process.env.PRIVATE_KEY,
      { expiresIn: "1h" },
      function (err, token) {
        if (!_.isEmpty(token)) {
          return res
            .status(200)
            .json(
              success_response(
                200,
                "logged successfully",
                { token: token },
                true
              )
            );
        }

        if (err !== null) {
          return res.status(400).json(failed_response(400, err.message, false));
        }
      }
    );
  } catch (err) {
    return res.status(400).json(failed_response(400, err.message, false));
  }
});

app.post("/userdetails", auth, (req, res) => {
  return res.status(200).json(
    success_response(
      200,
      "USer logged in successfully",
      {
        email: req.user,
        user_id: req.user_id,
      },
      true
    )
  );
});

// SERVER ON

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
