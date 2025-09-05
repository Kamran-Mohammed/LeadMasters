const express = require("express");
const Question = require("../models/questionModel");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.get("/", async (req, res) => {
  const questions = await Question.find();
  res.json({ status: "success", data: questions });
});

module.exports = router;
