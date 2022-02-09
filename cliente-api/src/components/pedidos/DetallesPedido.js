import React from 'react';
import clienteAxios from '../../config/axios';
import Swal from "sweetalert2";
import { withRouter } from 'react-router-dom';




function DetallesPedido({ pedido, history }) {

    const EliminarPedido = (id) => {
        Swal.fire({
            title: 'Estas seguro ?',
            text: "Un Pedido eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                //eliminar en la rest api
                clienteAxios.delete(`/pedidos/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire(
                                'Eliminado!',
                                res.data.mensaje,
                                'success'
                            )
                        }
                    })
            }
            history.push('/pedidos');
        })
    };

    const { _id, cliente } = pedido;

    return (
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">ID: 0192019201291201</p>
                <p className="nombre">Cliente: {cliente.nombre} {cliente.apellido} </p>

                <div className="articulos-pedido">
                    <p className="productos">Artículos Pedido: </p>
                    <ul>
                        {pedido.pedido.map(articulos => (
                            <li key={pedido._id + articulos.producto._id}>
                                <p>Nombre: {articulos.producto.nombre} </p>
                                <p>Precio: ${articulos.producto.precio} </p>
                                <p>Cantidad: {articulos.cantidad}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="total">Total: ${pedido.total} </p>

            </div>
            <div className="acciones">
                <button type="button" onClick={() => EliminarPedido(_id)} className="btn btn-rojo btn-eliminar">
                    <i className="fas fa-times"></i>
                    Eliminar Pedido
                </button>
            </div>
        </li>
    )
}

export default withRouter(DetallesPedido);