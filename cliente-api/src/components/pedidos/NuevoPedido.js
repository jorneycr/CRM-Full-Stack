import React, { useState, useEffect, Fragment, useContext } from 'react';
import clienteAxios from '../../config/axios';
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';

//import context
import { CRMContext } from '../../context/CRMContext';

const NuevoPedido = (props) => {

    //utilizar valores del context
    const [auth, guardarAuth] = useContext(CRMContext);

    //extraer ID de cliente
    const { id } = props.match.params;

    //state
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() => {
        //obtener el cliente
        const consultarAPI = async () => {
            //consultar cliente actual
            const resultado = await clienteAxios.get(`/clientes/${id}`);
            guardarCliente(resultado.data);
        }

        //llamar a la api
        consultarAPI();

        //actualizar4 el total a pagar
        actualizarTotal();

    }, [productos]);

    const buscarProducto = async e => {
        e.preventDefault();

        //obtener los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);

        //sino hay resultados una alerta, contrario agregarlo al state
        if (resultadoBusqueda.data[0]) {
            let productoResultado = resultadoBusqueda.data[0];
            //agregar la llave  "producto" (copia)
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;
            // console.log(productoResultado);

            //ponerlo en el state
            guardarProductos([...productos, productoResultado]);
        } else {
            //no hay resultados
            Swal.fire({
                type: 'error',
                title: 'No Resultados',
                text: 'No hay resultados'
            })
        }
    }

    //almacenar una busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda(e.target.value);
    }

    const restarProductos = (i) => {
        // console.log('uno menos..',i);
        //copiar el arreglo original de productos
        const todosProductos = [...productos];

        //validar si esta en 0 no puede ir mas alla
        if (todosProductos[i].cantidad === 0) return;

        //decremento
        todosProductos[i].cantidad--;

        //almacenar en el state
        guardarProductos(todosProductos);

    }


    const aumentarProductos = (i) => {
        //copiar el arreglo para no mutar el original
        const todosProductos = [...productos];

        //incorrecto
        todosProductos[i].cantidad++;

        //almacenar en el state
        guardarProductos(todosProductos);
    }

    //eliminar un producto del state
    const eliminarProductoPedido = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id);
        console.log(todosProductos);
        guardarProductos(todosProductos);
    }

    //actualiza el total a pagar
    const actualizarTotal = () => {
        //si el arreglo de productos es igual a 0: el total es 0
        if (productos.length === 0) {
            guardarTotal(0);
            return;
        }

        //calcular el nuevo total
        let nuevoTotal = 0;

        //recorrer todos los productos, sus cantidades y precios
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

        //almacena el total
        guardarTotal(nuevoTotal);

    }

    //alamcena el pedido e la bd
    const realizarPedido = async e =>{
        e.preventDefault();

        //extraer el id
        const {id} = props.match.params;

        //construir el objeto
        const pedido ={
            "cliente": id,
            "pedido":productos,
            "total":total
        }
        // console.log(pedido);
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`,pedido);

        //leer resultado
        if(resultado.status===200){
            //alerta de todo bien
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        }else{
            //alerta de error
            Swal.fire({
                type: 'error',
                title: 'Hubo un Error',
                text: 'Vuelve a intentarlo'
            })
        }

        //redireccionar
        props.history.push('/pedidos');
    }

    //verificar si el usuario esta autenticado o no
    if (!auth.auth && (localStorage.getItem('token') === auth.token)) {
        props.history.push('/iniciar-sesion');
    }

    return (
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                <p>Telefono: {cliente.telefono}</p>
            </div>

            <FormBuscarProducto
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />
            <ul className="resumen">

                {productos.map((producto, index) => (
                    <FormCantidadProducto
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        aumentarProductos={aumentarProductos}
                        eliminarProductoPedido={eliminarProductoPedido}
                        index={index}
                    />
                ))}

            </ul>
            <p className="total">Total a pagar: <span>{total}</span></p>

            {total > 0 ? (
                <form
                    onSubmit={realizarPedido}
                >
                    <input
                        type="submit"
                        className="btn btn-verde btn-block"
                        value="Realizar Pedido"
                    />
                </form>
            ) : null}

        </Fragment>
    );
}

export default withRouter(NuevoPedido);