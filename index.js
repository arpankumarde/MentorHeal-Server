const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server Online!");
});

app.use("/api/mail", require("./routes/sendMail"));

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
