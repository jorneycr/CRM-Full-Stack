import React, { useState, useEffect, Fragment } from 'react'
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import {withRouter} from "react-router-dom";
import Spinner from '../layout/Spinner';


function EditarProducto(props) {

    //obtener id de los productos
    const { id } = props.match.params;

    //producto
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    })

      // archivo = state, guardarArchivo = setState
      const [archivo, guardarArchivo] = useState('');

    //cuando el componente carga
    useEffect(() => {

        //consultar la api para traer el producto a editar
        const consultarAPI = async () => {
            const productoConsulta = await clienteAxios.get(`/productos/${id}`);
            guardarProducto(productoConsulta.data);
        }

        consultarAPI();
    }, [])

    //editar un producto en la base de datos
    const editarProducto = async e =>{
        e.preventDefault();

         //crear un formdata
         const formData = new FormData();
         formData.append('nombre', producto.nombre);
         formData.append('precio', producto.precio);
         formData.append('imagen', archivo)
         try {
             const res = await clienteAxios.put(`/productos/${id}`, formData,{
                 headers:{
                     'Content-Type' : 'multipart/form-data'
                 }
             });
             //lanzar una alerta
             if(res.status ===200){
                 Swal.fire(
                     'Editado correctamente',
                     res.data.mensaje,
                     'success'
                 )
             }
 
             //redireccionar
             props.history.push('/productos');
 
 
         } catch (error) {
             console.log(error);
             //lanzar alerta
             Swal.fire({
                 type:'error',
                 title: 'Hubo un error',
                 text:'Vuelva a intentarlo'
             })
         }
    }


    // leer los datos del formulario
    const leerInformacionProducto = e => {
        guardarProducto({
            // obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name]: e.target.value
        })
    }

    // coloca la imagen en el state
    const leerArchivo = e => {
        guardarArchivo(e.target.files[0]);
    }

    //extraer los valores del state
    const {nombre, precio, imagen} = producto;

    if(!nombre) return<Spinner/>

    return (
        <Fragment>
            <h2>Editar Producto</h2>

            <form
            onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        placeholder="Nombre Producto"
                        name="nombre"
                        defaultValue={nombre}
                        onChange={leerInformacionProducto}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        min="0.00"
                        step="0.01"
                        placeholder="Precio"
                        defaultValue={precio}
                        onChange={leerInformacionProducto}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    {imagen ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt="imagen" 
                        width="300"/>
                    ):null}
                    <input
                        type="file"
                        name="imagen"
                        onChange={leerArchivo}
                    />
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Editar Producto" />
                </div>
            </form>
        </Fragment>
    );
}

export default withRouter(EditarProducto);