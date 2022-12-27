const { Router } = require("express");
const router = Router();
const Contenedor = require("../../controllers/productsController.js");
const productos = new Contenedor("./controllers/productos.json");
const notFound = { error: "Producto no encontrado" };

/* ok: 200
    created: 201
    no content: 204
    bad request: 400
    not found: 404
    internal server error: 500
    */

router.get("/", async (req, res) => {
    const arrayProductos = await productos.getAll();
    res.render("formulario", {
        productos: arrayProductos,
        style: "formulario.css",
        title: "Productos con Handlebars",
    });
});

module.exports = router;