const config = require("../config");
const mongoose = require("mongoose");

const url = config.mongoURI.local;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set("strictQuery", true);
mongoose.connect(url, options);

mongoose.connection.on("connecting", () => {
  console.log("Connecting");
});

mongoose.connection.on("error", () => {
  console.log("Connection error");
});

mongoose.connection.on("connected", () => {
  console.log("Connection to database successfully established");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected");
});

module.exports = mongoose.connection;
