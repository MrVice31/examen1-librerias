const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = express.Router();
const DB_URL =
  "mongodb+srv://MrVice31:Dragonzord2000@cluster0.90xjp7b.mongodb.net/Libreria?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL)
  .catch((err) => console.error("Error conectandose a la bd, mensaje:", err));
const usuarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  { collection: "Usuarios" }
);

usuarioSchema.plugin(uniqueValidator);
const Usuarios = mongoose.model("Usuarios", usuarioSchema);

router.get("/usuarios/all", async (req, res) => {
  try {
    const usuarios = await Usuarios.find().exec();
    res.status(200).json(usuarios);
  } catch (err) {
    console.log(err);
    res.status(500).send("Respuesta del servidor 500");
  }
});

router.post("/usuarios", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Usuarios({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "user",
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor codigo 500");
  }
});

router.put("/usuarios/:userId", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const updatedUser = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      role: req.body.role || "user",
    };

    const user = await Usuarios.findByIdAndUpdate(
      req.params.userId,
      updatedUser,
      {
        new: true,
      }
    );

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("No usuarios con este nombre");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error 500 en el servidor");
  }
});

router.delete("/usuarios/:id", async (req, res) => {
  try {
    const user = await Usuarios.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(200).json({
        message: `Se ha eliminado el usuario con id: ${req.params.id}`,
      });
    } else {
      res.status(404).send("No se ha encontrado usuario con este id");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error detectado 500");
  }
});

module.exports = router;
