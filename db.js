const mongoose = require("mongoose");

const mongoConnection =
  "mongodb+srv://MrVice31:Dragonzord2000@cluster0.90xjp7b.mongodb.net/Libreria?retryWrites=true&w=majority";

mongoose
  .connect(mongoConnection)
  .catch((err) => console.error("Error de conexión a la base de datos:", err));

module.exports = mongoose;
