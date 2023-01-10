const { Router } = require("express");
const router = Router();
const Contenedor = require("../controllers/productsController");
const productos = new Contenedor("./controllers/productos.json");
const notFound = { error: "Producto no encontrado" };
const forbidden = { error: "Acceso no autorizado" };

/* ok: 200
    created: 201
    no content: 204
    bad request: 400
    forbidden: 403
    not found: 404
    internal server error: 500
    */

/* incorporo middleware con clave en el header para continuar */
const accessOk = (req, res, next) => {
    const key = req.headers.key;
    if (key == 1234) {
        next();
    } else {
        res.status(403).json(forbidden);
    }
};

router.get("/", async (req, res) => {
    console.log(`getAll req recibida con exito`);
    const arrayProductos = await productos.getAll();
    !arrayProductos && res.status(404).json(notFound);
    res.status(200).json(arrayProductos);
    const id = parseInt(req.params.id);
});

router.get("/:id", async (req, res) => {
    console.log(`getById req recibida con exito`);
    const id = parseInt(req.params.id);
    const producto = await productos.getById(id);
    !producto && res.status(404).json(notFound);
    res.status(200).json(producto);
});

router.post("/", accessOk, async (req, res) => {
    console.log(`post req recibida con exito`);
    const data = req.body;
    console.log(data);
    const nuevoProducto = await productos.save(data);
    !data && res.status(204).json(notFound);
    res.status(201).json(data);
});

router.put("/:id", accessOk, async (req, res) => {
    console.log(`put req recibida con exito`);
    const id = parseInt(req.params.id);
    const data = req.body;
    const productoEditado = await productos.modify(id, data);
    !productoEditado && res.status(404).json(notFound);
    res.status(200).json(productoEditado);
});

router.delete("/:id", accessOk, async (req, res) => {
    console.log(`delete req recibida con exito`);
    const id = parseInt(req.params.id);
    const producto = await productos.getById(id);
    const eliminarProducto = await productos.deleteById(id);
    !producto && res.status(404).json(notFound);
    res.status(200).json(producto);
});

module.exports = router;