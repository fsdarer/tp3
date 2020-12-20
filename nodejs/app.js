const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT ? process.env.PORT : 3001;
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://fsdarer:fsdarer2@cluster0.a2q9v.mongodb.net/myBooks?retryWrites=true&w=majority";

async function conectar() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a la base de datos metodo: mongoodb - async-await");
  } catch (e) {
    console.log(e);
  }
}
conectar();

const GeneroSchema = new mongoose.Schema({
  nombre: String,
});
const GeneroModel = mongoose.model("genero", GeneroSchema);

const PersonaSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  alias: String,
  email: String,
  telefono: String,
});
const PersonaModel = mongoose.model("persona", PersonaSchema);

const LibroSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  persona: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "persona",
  },
  genero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genero",
  },
});
const LibroModel = mongoose.model("libro", LibroSchema);

// API DE GENERO
app.get("/genero/:id", async (req, res) => {
  try {
    const unGenero = await GeneroModel.findById(req.params.id);

    console.log(unGenero);

    if (unGenero == undefined) {
      res.status(404).send("No existe un genero con el ID indicado");
      return;
    }

    res.status(200).send(unGenero);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
  res.status(200).send("respuesta get /genero");
});

app.get("/genero", async (req, res) => {
  try {
    const generos = await GeneroModel.find();

    console.log(generos);

    res.status(200).send(generos);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.post("/genero", async (req, res) => {
  try {
    if (!req.body.nombre) {
      throw new Error("No enviaste los datos necesarios");
    }
    const genero = {
      nombre: req.body.nombre,
    };

    const newGenero = await GeneroModel.create(genero);

    res.status(200).send(newGenero);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.delete("/genero/:id", async (req, res) => {
  try {
    const respuesta = await GeneroModel.findByIdAndDelete(req.params.id);

    res.status(200).send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.put("/genero/:id", async (req, res) => {
  try {
    if (!req.body.nombre) {
      throw new Error("Todos los campos son obligatorios");
    }
    const generoCambiado = await GeneroModel.findByIdAndUpdate(
      req.params.id,
      { nombre: req.body.nombre },
      { new: true }
    );

    res.status(200).send(generoCambiado);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

// API DE PERSONA

app.get("/persona/:id", async (req, res) => {
  try {
    const unaPersona = await PersonaModel.findById(req.params.id);

    console.log(unaPersona);

    res.status(200).send(unaPersona);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

//Para buscar persona por "Alias" ==> localhost:3001/persona?alias=Pepe

app.get("/persona", async (req, res) => {
  try {
    if (req.query.alias) {
      const buscarAlias = req.query.alias;
      const unAlias = await PersonaModel.find({ alias: buscarAlias });

      if (unAlias.length == 0) {
        throw new Error("No existen personas con ese ALIAS");
      }
      res.status(200).send(unAlias);
    }
    if (!req.query.alias) {
      const personas = await PersonaModel.find();
      res.status(200).send(personas);
    }
  } catch (error) {
    console.log(error);
    res.status(406).send("No existen personas con ese ALIAS");
  }
});

app.post("/persona", async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.apellido ||
      !req.body.alias ||
      !req.body.email ||
      !req.body.telefono
    ) {
      throw new Error("No enviaste los datos necesarios");
    }

    const persona = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      alias: req.body.alias,
      email: req.body.email,
      telefono: req.body.telefono,
    };
    const newPersona = await PersonaModel.create(persona);

    res.status(200).send(newPersona);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.delete("/persona/:id", async (req, res) => {
  try {
    const respuesta = await GeneroModel.findByIdAndDelete(req.params.id);

    res.status(200).send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.put("/persona/:id", async (req, res) => {
  try {
    if (!req.body.telefono) {
      throw new Error("Todos los campos son obligatorios");
    }
    const personaCambiada = await PersonaModel.findByIdAndUpdate(
      req.params.id,
      { telefono: req.body.telefono },
      { new: true }
    );

    res.status(200).send(personaCambiada);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

// API DE LIBRO

app.get("/libro/:id", async (req, res) => {
  try {
    const unLibro = await LibroModel.findById(req.params.id);

    console.log(unLibro);

    res.status(200).send(unLibro);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
  res.status(200).send("respuesta get /libro");
});
//Listar todos los libros

app.get("/Listarlibro", async (req, res) => {
  try {
    const libros = await LibroModel.find();

    console.log(libros);

    res.status(200).send(libros);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

//Para buscar libro por: "Nombre" ==> localhost:3001/libro?nombre=IT
//                       "Genero" ==> localhost:3001/libro?genero=Terror

app.get("/libro", async (req, res) => {
  try {
    if (req.query.nombre) {
      const libroPedido = req.query.nombre;
      const nombreLibro = await LibroModel.find({ nombre: libroPedido });

      if (nombreLibro.length == 0) {
        throw new Error("No existen libros con ese NOMBRE");
      }
      res.status(200).send(nombreLibro);
    }
    if (req.query.genero) {
      const generoPedido = req.query.genero;
      const genero = await GeneroModel.findOne({ nombre: generoPedido });

      if (genero == null) {
        throw new Error("No existe ese GENERO");
      }
      const libroGenero = await LibroModel.find({ genero: genero._id });
      if (libroGenero.length == 0) {
        throw new Error("No existen libros con ese GENERO");
      }
      res.status(200).send(libroGenero);
    }
  } catch (error) {
    console.log(error);
    res.status(406).send("No existen libros con esos datos");
  }
});

app.post("/libro", async (req, res) => {
  try {
    if (
      !req.body.nombre ||
      !req.body.descripcion ||
      !req.body.genero ||
      !req.body.persona
    ) {
      throw new Error("No enviaste los datos necesarios");
    }

    const personaExiste = await PersonaModel.findOne({ _id: req.body.persona });
    const generoExiste = await GeneroModel.findOne({ _id: req.body.genero });

    if (!personaExiste || !generoExiste) {
      throw new Error("no existe la persona y/o genero enviado");
    }
    const libro = {
      nombre: req.body.nombre,
      genero: req.body.genero,
      descripcion: req.body.descripcion,
      persona: req.body.persona,
    };

    const newLibro = await LibroModel.create(libro);

    res.status(200).send(newLibro);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.delete("/libro/:id", async (req, res) => {
  try {
    const respuesta = await LibroModel.findByIdAndDelete(req.params.id);

    res.status(200).send(respuesta);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.put("/libro/:id", async (req, res) => {
  try {
    if (!req.body.descripcion) {
      throw new Error("No enviaste los datos necesarios");
    }
    const libroCambiado = await LibroModel.findByIdAndUpdate(
      req.params.id,
      { descripcion: req.body.descripcion },
      { new: true }
    );

    res.status(200).send(libroCambiado);
  } catch (error) {
    console.log(error);
    res.status(406).send({ error: "algo falló" });
  }
});

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto 3001", port);
});
