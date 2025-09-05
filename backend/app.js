const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const authRoutes = require("./routes/authRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);

app.use((req, res, next) => {
  const err = new AppError(`Cannot find ${req.method} ${req.originalUrl}`, 404);
  next(err);
});

app.use(errorHandler);

module.exports = app;
