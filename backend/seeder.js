const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/questionModel");
const questions = require("./data/questions");

dotenv.config({ path: ".env" });

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB Connected...");

    // Clear old data
    await Question.deleteMany();

    // Insert new data
    await Question.insertMany(questions);

    console.log("Questions inserted successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
