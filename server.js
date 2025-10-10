require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./configs/database");
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

(async () => {
  await database.connect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
