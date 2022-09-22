const mongoose = require("mongoose");
const consola = require("consola");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => consola.ready({ message: "CONNECTED TO DB", badge: true }))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
