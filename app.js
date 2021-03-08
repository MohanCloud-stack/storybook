const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectdb = require("./config/db");
const passport = require("passport");

const session = require("express-session");
// load   config
dotenv.config({ path: "./config/config.env" });

require("./config/passport")(passport);

connectdb();
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// handlebars
app.engine(".hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

//passport  middle ware

app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes

app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
