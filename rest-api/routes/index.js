const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/clienteController");

const productosController = require("../controllers/productosController");

const pedidosController = require("../controllers/pedidosController");

const usuariosController = require("../controllers/usuariosController");

const urlController = require("../controllers/urlController");

//middleware para proteger las rutas
const auth = require("../middleware/auth");

module.exports = function () {
  /**Url */
  // crea una URL mas corta
  router.post("/url", urlController.addUrl);

  //obtiene la url
  router.get("/:code", urlController.getUrl);

  /**Clientes */
  //agregar los clientes via post
  router.post(
    "/clientes",
    // auth,
    clienteController.nuevoCliente
  );

  //obtener clientes
  router.get(
    "/clientes",
    // auth,
    clienteController.mostrarClientes
  );

  //muestra un cliente especifico
  router.get(
    "/clientes/:idCliente",
    // auth,
    clienteController.mostrarCliente
  );

  //actualizar cliente
  router.put(
    "/clientes/:idCliente",
    // auth,
    clienteController.actualizarCliente
  );

  //eliminar por cliente
  router.delete(
    "/clientes/:idCliente",
    // auth,
    clienteController.eliminarCliente
  );

  /**Productos */
  //nuevos productos
  router.post(
    "/productos",
    // auth,
    productosController.subirArchivo,
    productosController.nuevoProducto
  );

  //muestra todos los productos
  router.get(
    "/productos",
    // auth,
    productosController.mostrarProductos
  );

  //mostrar producto por id
  router.get(
    "/productos/:idProducto",
    // auth,
    productosController.mostrarProducto
  );

  //actualizar productos
  router.put(
    "/productos/:idProducto",
    // auth,
    productosController.subirArchivo,
    productosController.actualizarProducto
  );

  //eliminar producto
  router.delete(
    "/productos/:idProducto",
    // auth,
    productosController.eliminarProducto
  );

  router.post(
    "/productos/busqueda/:query",
    // auth,
    productosController.buscarProducto
  );

  /**Pedidos */
  //nuevo pedido
  router.post(
    "/pedidos/nuevo/:idUsuario",
    // auth,
    pedidosController.nuevoPedido
  );

  //mostrar nuevos pedidos
  router.get(
    "/pedidos",
    // auth,
    pedidosController.mostrarPedidos
  );

  //mostrar un pedido por su id
  router.get(
    "/pedidos/:idPedido",
    // auth,
    pedidosController.mostrarPedido
  );

  //actualizar pedidos
  router.put(
    "/pedidos/:idPedido",
    // auth,
    pedidosController.actualizarPedido
  );

  //eliminar un pedido por su id
  router.delete(
    "/pedidos/:idPedido",
    // auth,
    pedidosController.eliminarPedido
  );

  //Usuarios
  router.post(
    "/crear-cuenta",
    // auth,
    usuariosController.registrarUsuario
  );

  router.post("/iniciar-sesion", usuariosController.autenticarUsuario);

  return router;
};
