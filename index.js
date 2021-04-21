require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const products = require("./routes/products.router");
const carts = require("./routes/carts.router");
const users = require("./routes/users.router");
const wishlists = require("./routes/wishlists.router");
const routeNotFoundHandler = require("./middlewares/route-not-found.middlerware");
const allErrorsHandler = require("./middlewares/all-errors-handler.middleware");
const initializeConnectionToDb = require("./db/db.connect");


const app = express();

app.use(bodyParser.json())
app.use(cors());

const port = 3000;

initializeConnectionToDb();

app.get("/", (req,res)=>{
  console.log("i was here")
  res.send("Welcome to the U&I store");
})

app.use("/products", products);
app.use("/wishlists", wishlists);
app.use("/carts", carts);
app.use("/users", users);

/**
 * 404 Route Handler
 * Note: Do Not Move. This should be the last route.
 */
app.use(routeNotFoundHandler);

/**
 * Error Handler
 * Note: Do Not Move.
 */
app.use(allErrorsHandler);


app.listen( process.env.PORT || port, () => {
    console.log(`server started`)
  })