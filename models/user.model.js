const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: String,
    password: String,
    fullname: String
});

const User = mongoose.model("User", UserSchema);

module.exports = {User};