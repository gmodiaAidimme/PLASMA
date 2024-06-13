import React from "react";
import { useNavigate } from "react-router-dom";

function CajaOpcion(props) {
    const navigate = useNavigate()

    return (
        <div className="info-box simple-enlargable" onClick={() => navigate(props.url)}>
            <span className="info-box-icon" style={{backgroundColor: "#1f5eb6"}}><i className={"icono-blanco fas fa-" + props.icono}></i></span>
            <div className="info-box-content">
                <span style={{ marginTop: 0 }} className="info-box-number cajainicial-valor">{props.subtitulo}</span>
            </div>
        </div>
    )
}

function Landing() {
    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <section className="content">
                <div className="container" >
                    <div className="image-container">
                        <img src="/dist/img/logo.svg" alt="logo plasma" className="logo-principal rotate" />
                    </div>
                    <div style={{marginTop:"5vh"}}>
                        <img src="/dist/img/cartelPlasma.svg" alt="cartel plasma" className="cartel-principal" />
                    </div>
                    {/* <div className="row"  style={{marginTop: '5vh'}}>
                        <div className="col-3">
                            <CajaOpcion subtitulo="Panel" color="secondary" url="/panel/0" icono="tachometer-alt" />
                        </div>
                        <div className="col-3">
                            <CajaOpcion subtitulo="Operarios" color="primary" url="/operarios" icono="users" />
                        </div>
                        <div className="col-3">
                            <CajaOpcion subtitulo="Órdenes" color="primary" url="/ofs" icono="rocket" />
                        </div>
                        <div className="col-3">
                            <CajaOpcion subtitulo="Histórico" color="primary" url="/historico" icono="calendar-day" />
                        </div>
                    </div> */}
                </div>
            </section>
        </div >
    )
}

export default Landing