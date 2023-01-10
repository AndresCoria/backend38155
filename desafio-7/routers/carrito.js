const { Router } = require("express");
const router = Router();
const Contenedor = require("../controllers/productsController");
const carritos = new Contenedor("./controllers/carritos.json");
const productos = new Contenedor("./controllers/productos.json");
const notFound = { error: "Producto no encontrado" };

/* ok: 200
    created: 201
    no content: 204
    bad request: 400
    forbidden: 403
    not found: 404
    internal server error: 500
    */

const numeros = "0123456789";
const letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numYLetras = numeros + letras;

router.post("/", async (req, res) => {
    console.log(`post req recibida con exito`);
    const carrito = {
        timestamp: Date.now(),
        productos: [],
    };
    const nuevoCarrito = await carritos.save(carrito);
    !nuevoCarrito && res.status(500).json(notFound);
    res.status(201).send("Carrito creado con exito");
});

router.post("/:id/productos", async (req, res) => {
    console.log(`post req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const idProducto = req.body.idProducto;
    const carrito = await carritos.getById(idCarrito);
    const carritoJson = carrito[0];
    const producto = await productos.getById(idProducto);
    const productoJson = producto[0];
    await carritoJson.productos.push(productoJson);
    await carritos.modify(idCarrito, carritoJson);
    res.status(201).send(carritoJson);
});

router.delete("/:id", async (req, res) => {
    console.log(`deleteById req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const carrito = await carritos.getById(idCarrito);
    const eliminarCarrito = await carritos.deleteById(idCarrito);
    !carrito && res.status(404).json(notFound);
    res.status(200).json(carrito);
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
    console.log(`deleteById req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const idProducto = parseInt(req.params.id_prod);
    const carrito = await carritos.getById(idCarrito);
    const carritoJson = carrito[0];
    let indexToDelete = -1;
    carritoJson.productos.forEach((producto, index) => {
        if (producto.id == idProducto) {
            indexToDelete = index;
        } else {
            res.status(404).json(notFound);
        }
    });
    if (indexToDelete >= 0) {
        carritoJson.productos.splice(indexToDelete, 1);
    }
    await carritos.modify(idCarrito, carritoJson);
    res.status(200).json(carritoJson);
});

router.get("/:id/productos", async (req, res) => {
    console.log(`getById req recibida con exito`);
    const idCarrito = parseInt(req.params.id);
    const carrito = await carritos.getById(idCarrito);
    !carrito && res.status(404).json(notFound);
    res.status(200).json(carrito[0].productos);
});

router.put("/:id", async (req, res) => {
    console.log(`put req recibida con exito`);
    const idProducto = parseInt(req.params.id);
    const data = req.body;
    const productoEditado = await productos.modify(idProducto, data);
    !productoEditado && res.status(404).json(notFound);
    res.status(200).json(productoEditado);
});

module.exports = router;