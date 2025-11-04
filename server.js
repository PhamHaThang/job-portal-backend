require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./configs/database");
const router = require("./routes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://job-portal-frontend-gamma-three.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://10.0.2.2:5000",
  "*"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

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
