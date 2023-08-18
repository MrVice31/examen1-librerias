const express = require("express");
const usuarios = require("./usuarios");
const libros = require("./libros");
const sucursales = require("./sucursales");

const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Corriendo en el puerto: ${PORT}`);
});

app.use("/", usuarios);
app.use("/", sucursales);
app.use("/", libros);
