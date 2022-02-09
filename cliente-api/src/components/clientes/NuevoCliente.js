import React, { Fragment, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';

//import context
import { CRMContext } from '../../context/CRMContext';


const NuevoCliente = ({ history }) => {

    //utilizar valores del context
    const [auth, guardarAuth] = useContext(CRMContext);

    //cliente= state, guardarCliente = funcion para guardar el state
    const [cliente, guardarCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    //leer los datos del formulario
    const actualizarState = e => {
        //alamcenar lo que el usuario escribe en el state
        guardarCliente({
            //obtener una copia del state actual
            ...cliente,
            [e.target.name]: e.target.value
        })
    }

    //agrega en la rest API un cliente nuevo
    const agregarCliente = e => {
        e.preventDefault();

        //enviar peticion
        clienteAxios.post('/clientes', cliente)
            .then(res => {
                //validar si hay errores de mongo
                if (res.data.code === 11000) {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error!',
                        text: 'Ese cliente ya se registro'
                    }
                    )
                } else {
                    Swal.fire(
                        'Se agrego el cliente!',
                        res.data.mensaje,
                        'success'
                    )
                }
                //redireccionar
                history.push('/');
            });

    }

    //validar el formulario
    const validarCliente = () => {
        //destructuring
        const { nombre, apellido, email, empresa, telefono } = cliente;

        //revisar que las propiedades del objeto tengan contenido
        let valido = !nombre.length || !apellido.length || !email.length
            || !empresa.length || !telefono.length;

        //return true o false
        return valido;
    }

    //verificar si el usuario esta autenticado o no
    if (!auth.auth && (localStorage.getItem('token') === auth.token)) {
        history.push('/iniciar-sesion');
    }

    return (
        <Fragment>
            <h2>Nuevo cliente</h2>

            <form
                onSubmit={agregarCliente}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre Cliente"
                        name="nombre"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text"
                        placeholder="Apellido Cliente"
                        name="apellido"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text"
                        placeholder="Empresa Cliente"
                        name="empresa"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email"
                        placeholder="Email Cliente"
                        name="email"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="tel"
                        placeholder="Teléfono Cliente"
                        name="telefono"
                        onChange={actualizarState}
                    />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Agregar Cliente"
                        disabled={validarCliente()}
                    />
                </div>

            </form>
        </Fragment>
    );
}
//High orden component (HOC), es una funcion que toma un componente y retorna un componente
export default withRouter(NuevoCliente);