const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: ".env" });

const app = require("./app");

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
  console.log("Database connection is successful");
});

const port = process.env.PORT || 5003;
const server = app.listen(port, (req, res) => {
  console.log(`app is running on port ${port}`);
});
