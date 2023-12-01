const express = require("express");
const session = require('cookie-session');
const cors = require("cors");

const app = express();

app.use(cors());


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

// Use async/await here
(async () => {
  try {
    await db.mongoose.connect(`mongodb+srv://AOL:nfSu7JKMy2QZRGxa@aol2.6jfhck3.mongodb.net/AOL_db`);
    console.log("Successfully connect to MongoDB.");
    initial();
  } catch (err) {
    console.error("Connection error", err);
    process.exit(1); // Exit with an error code
  }
})();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AOL application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requestsa
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  const count = await Role.estimatedDocumentCount();

  if (count === 0) {
    try {
      await new Role({
        name: "user"
      }).save();
      console.log("added 'user' to roles collection");

      await new Role({
        name: "moderator"
      }).save();
      console.log("added 'moderator' to roles collection");

      await new Role({
        name: "admin"
      }).save();
      console.log("added 'admin' to roles collection");
    } catch (err) {
      console.log("error", err);
    }
  }
}
