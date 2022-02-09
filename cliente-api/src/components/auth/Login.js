import React, {useState, useContext} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import {withRouter} from 'react-router-dom';

//context
import {CRMContext} from '../../context/CRMContext';

function Login(props){

    //Auth y token
    const [auth, guardarAuth] = useContext(CRMContext);

    //state con losdatos  del formulario
    const [credenciales, guardarCredenciales] = useState({});


    //iniciar sesion en el servidor
    const iniciarSesion = async e => {
        e.preventDefault();

        //autentificar al usuario
         try {
            console.log("aqui")
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);

            console.log(respuesta);
            
            //extraer el token  y colocar en localstorage
            const {token}= respuesta.data;
            //es un lugar seguro
            localStorage.setItem('token', token);

            //colocar en el state
            guardarAuth({
                token,
                auth:true
            })

            //alerta
            Swal.fire(
                'Login Correcto',
                'Has iniciado sesion',
                'success'
            )

            //redireccionar
            props.history.push('/'); 

         } catch (error) {
             if(error.response){
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.mensaje
                })
             }else{
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'Hubo un error'
                })
             }
            
         }
    }

    //almacenar lo que el usuario escribe en el state
    const leerDatos = (e) =>{
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }

    return(
        <div className="login">
            <h2>Iniciar Sesión</h2>

            <div className="contenedor-formulario">
                <form
                    onSubmit={iniciarSesion}
                >

                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Email para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <div className="campo">
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesión"
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <input type="submit" value="Iniciar Sesión" className="btn btn-verde btn-block" />
                </form>
            </div>
        </div>        
    )
}

export default withRouter(Login);