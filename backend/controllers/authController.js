const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const serialized = serialize("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRES_IN,
    path: "/",
  });
  res.setHeader("Set-Cookie", serialized);
  // console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  //we cant use the following line of code to create a new user because anyone an define their role as admin while defining the req.body
  // const newUser = await User.create(req.body);
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(new AppError("Email already in use", 400));
  }

  //here the user can only define the name, email, password
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
    // role: req.body.role,
  });

  // const url = `${process.env.FRONTEND_URL_DEV}/`;
  // console.log(url);

  // await new Email(newUser, url).sendWelcome();

  createAndSendToken(newUser, 201, res);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //check if the email and password exist
  if (!email || !password)
    return next(new AppError("Please enter email and paswword", 404));

  //check if the user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or pasword", 401));
  }

  //if everything is okay, create token and send response
  createAndSendToken(user, 200, res);
};

exports.logout = (req, res, next) => {
  // res.cookie("jwt", "dummytext", {
  //   expires: new Date(Date.now() + 1000),
  //   httpOnly: true,
  // });

  const serialized = serialize("jwt", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", serialized);

  // res.clearCookie("jwt");
  // console.log("cookie cleared");

  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user of this token no longer exists.", 401));
  }

  req.user = currentUser;

  next();
};

exports.checkIsLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);

  if (!token) {
    return next();
  }

  //verification of token:
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //check if the user of the token still exists:
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next();
  }

  req.user = currentUser;

  next();
};

exports.isLoggedIn = async (req, res, next) => {
  if (!req.user) {
    // return next(new AppError("Not Logged In", 401));
    return res.status(200).json({
      status: "success",
      user: null, // Instead of an error, return null
    });
  }
  res.status(200).json({
    status: "success",
    user: req.user,
  });
};
