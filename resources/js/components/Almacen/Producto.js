import React, { useEffect, useState } from 'react';
import CajaInfoProducto from './CajaInfoProducto';
import CajaRegistroProducto from './CajaRegistroProducto';
import CajaEntradaManual from './CajaEntradaManual';
import axios from 'axios';
import { useParams } from 'react-router-dom';


import { TituloSeccion } from "../generales";

function Producto() {

    const { id } = useParams();

    const [producto, setProducto] = useState({});
    const [registro, setRegistro] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inicio, setInicio] = useState(new Date());
    const [fin, setFin] = useState(new Date());


    useEffect(() => {
        axios.post(`/api/almacen/getInfoProducto/${id}`, { inicio: inicio.toISOString().split('T')[0], fin: fin.toISOString().split('T')[0] })
            .then((res) => {
                setProducto(res.data.producto);
                setRegistro(res.data.registro);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [id, inicio, fin]);

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Stock de producto" />
            <section className="content">
                <div className="container">
                    {!isLoading &&
                        <div className="row">
                            <div className="col-md-4">
                                <CajaInfoProducto producto={producto} isLoading={isLoading} />
                                <CajaEntradaManual producto={producto} setRegistro={setRegistro} setProducto={setProducto} />
                            </div>
                            <div className="col-md-8">
                                <CajaRegistroProducto registro={registro} inicio={inicio} fin={fin} setInicio={setInicio} setFin={setFin}  />
                            </div>
                        </div>
                    }
                </div>
            </section>
        </div>
    );
}


export default Producto;
