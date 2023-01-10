const { Router } = require("express");
const productos = require("./productos");
const carrito = require("./carrito");

const router = Router();

router.use("/productos", productos);

router.use("/carrito", carrito);

module.exports = router;