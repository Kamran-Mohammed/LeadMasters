const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get(
  "/isLoggedIn",
  authController.checkIsLoggedIn,
  authController.isLoggedIn
);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
