const express = require("express");
const bp = require("body-parser");
const routers = require("./routers");
const Contenedor = require("./controllers/productsController");
const productos = new Contenedor("./controllers/productos.json");
const app = express();
const PORT = 3000;

/* middlewares incorporados */
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", routers);
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("formulario");
});

app.post("/", async (req, res) => {
    console.log(`post req recibida con exito`);
    const data = req.body;
    console.log(data);
    const nuevoProducto = await productos.save(data);
    !data && res.status(204).json(notFound);
    res.status(201).render("formulario", {});
});

const server = app.listen(PORT, () => {
    console.log(
        `Servidor http escuchando en el puerto ${server.address().port}`
    );
    console.log(`http://localhost:${server.address().port}`);
});
server.on("error", error => console.log(`Error en servidor: ${error}`));