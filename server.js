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
  })
);
app.use(express.json());
// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api", router);
app.use(errorHandler);
(async () => {
  await database.connect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
