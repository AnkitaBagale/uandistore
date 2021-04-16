const mongoose = require('mongoose');
require("dotenv").config();

const initializeConnectionToDb = async() =>{
    await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log("db connected"); 
}

module.exports = initializeConnectionToDb;
