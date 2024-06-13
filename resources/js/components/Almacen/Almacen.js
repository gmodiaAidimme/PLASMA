import React, { useState, useEffect } from "react";
import { TituloSeccion } from "../generales";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImagenModelo from "../Comun/ImagenModelo";


function AlmacenPlaceholder() {
    return (
        <>
            <div className="info-box selector-placeholder" id="selector-placeholder-1">
            </div>
            <div className="info-box selector-placeholder" id="selector-placeholder-2" >
            </div>
            <div className="info-box selector-placeholder" id="selector-placeholder-3">
            </div>
            <div className="info-box selector-placeholder" id="selector-placeholder-4">
            </div>
        </>
    )
}


function Almacen() {

    const [almacen, setAlmacen] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productos_visibles, setProductosVisibles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        axios.get("/api/almacen/stock")
            .then(response => {
                setAlmacen(response.data.productos);
                setProductosVisibles(response.data.productos);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const filtrarProductos = (e) => {
        const texto = e.target.value.toLowerCase();
        const productos_filtrados = almacen.filter(producto => {
            return producto.nombre.toLowerCase().includes(texto);
        });
        setProductosVisibles(productos_filtrados);
    }

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Almacén" />
            <section className="content">
                <div className="container" >
                    <div className="row">
                        <div className="col-md-12">
                            <input type="text" className="form-control" placeholder="Buscar producto..." onChange={filtrarProductos} />
                        </div>
                    </div>
                    <div className="row mt-3">
                        {isLoading ?
                            <>
                                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                    <AlmacenPlaceholder />
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                    <AlmacenPlaceholder />
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                    <AlmacenPlaceholder />
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                    <AlmacenPlaceholder />
                                </div>
                            </>
                            :
                            productos_visibles.map((producto) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 simple-enlargable" key={producto.id} onClick={() => navigate("/almacen/" + producto.id)}>
                                    <div className="info-box">
                                        <ImagenModelo imagen={ producto.imagen.split('/')[0] + "/mini-" + producto.imagen.split('/')[1]} clase="info-box-icon" modelo="producto"/>
                                        <div className="info-box-content">
                                            <span className="info-box-text">{producto.nombre}</span>
                                            <span className="info-box-number">{producto.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>

            </section>
        </div>

    )
}

export default Almacen;