const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

module.exports = model("User", userSchema);
