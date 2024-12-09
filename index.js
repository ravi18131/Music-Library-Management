const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
}));


//testing
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const userRoutes = require("./routes/userRoutes")
const trackRoutes = require("./routes/trackRoutes.js")
const favoriteRoutes = require("./routes/favoriteRoutes.js");
const artistRoutes = require('./routes/artistRoutes.js')
const albumRoutes = require('./routes/albumRoutes.js')

//Routes
app.use("/", userRoutes);
app.use("/tracks", trackRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/artists", artistRoutes)
app.use("/albums", albumRoutes)


//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully!");
    //Server
    app.listen(process.env.PORT, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;

