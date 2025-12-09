global.__basedir = __dirname;
require("dotenv").config();
const express = require("express");
const dbConnector = require("./config/db");
const apiRouter = require("./router");
const cors = require("cors");
const app = express();
const garage = require('./router/garage');
const cookieParser = require("cookie-parser"); // ✅ За да обработваме cookies
const { errorHandler } = require("./utils");
const { getAllTracks } = require("./controllers/trackController");


dbConnector()
  .then(() => {
    const app = express();
    
    require("./config/express")(app);
    
    // ✅ Конфигуриране на CORS за работа с cookies
    const corsOptions = {
      origin: process.env.CLIENT_URL || "http://localhost:5173", // 🔥 Променливо за фронтенда
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'] // ✅ Позволява изпращане на cookies
    };
    app.use(cors(corsOptions));

    app.use(cookieParser()); // ✅ За да можем да четем cookies

    app.use("/api", apiRouter);
    app.use('/api/garage', garage);
    
    

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
  })
  .catch(console.error);
