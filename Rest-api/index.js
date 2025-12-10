global.__basedir = __dirname;
require("dotenv").config();
const dbConnector = require("./config/db");
const apiRouter = require("./router");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./utils");

dbConnector()
  .then(() => {
    const express = require("express");
    const app = express();

    // CORS
    app.use(
      cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Cookies
    app.use(cookieParser(process.env.COOKIESECRET || "SoftUni"));

    // Load express config (json parsing, static)
    require("./config/express")(app);

    // Routes
    app.use("/api", apiRouter);

    // Error handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
  })
  .catch(console.error);
