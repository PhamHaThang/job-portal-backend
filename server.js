require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./configs/database");
const router = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  optionsSuccessStatus: 200
}));

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api", router);
app.use(errorHandler);
(async () => {
  await database.connect();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Accessible from Android emulator at http://10.0.2.2:${PORT}`);
  });
})();
module.exports = app;
