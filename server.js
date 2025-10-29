require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./configs/database");
const router = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
// Routes

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
