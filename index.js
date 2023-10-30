const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Routes/user.route");
const { doctorRouter } = require("./Routes/doctor.route");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "This is the home page" });
});

app.use("/users", userRouter);
app.use("/doctor", doctorRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
    console.log(`Server is running at port ${process.env.port}`);
  } catch (err) {
    console.log(err);
  }
});
