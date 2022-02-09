import React, { useEffect, useState, Fragment, useContext } from 'react';
import clienteAxios from '../../config/axios';
import DetallesPedido from './DetallesPedido';

//import context
import { CRMContext } from '../../context/CRMContext';

function Pedidos(props) {

    const [pedidos, guardarPedidos] = useState([]);

    //utilizar valores del context
    const [auth, guardarAuth] = useContext(CRMContext);

    useEffect(() => {
        if (auth.token !== '') {
            //query a la api
            const consultarAPI = async () => {
                try {
                    // obtener los pedidos
                    const resultado = await clienteAxios.get('/pedidos', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    guardarPedidos(resultado.data);

                } catch (error) {
                    //error con authorization
                    if (error.response.status = 500) {
                        props.history.push('/iniciar-sesion');
                    }
                }
            }
            consultarAPI();
        } else {
            props.history.push('/iniciar-sesion');
        }
    }, [pedidos]);

    //si el state esta como false
    if (!auth.auth) {
        props.history.push('/iniciar-sesion');
    }

    return (
        <Fragment>
            <h2>Pedidos</h2>
            <ul className="listado-pedidos">
                {pedidos.map(pedido => (
                    <DetallesPedido
                        key={pedido._id}
                        pedido={pedido}
                    />
                ))}
            </ul>
        </Fragment>
    )
}
export default Pedidos;