
import React from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { TituloSeccion } from '../generales';

function AcItemAyuda(props) {
    return (
        <Accordion.Item eventKey={props.eventKey}>
            <Accordion.Header>{props.titulo}</Accordion.Header>
            <Accordion.Body>
                <video width="640" height="400" controls style={{position: "relative", left: "50%", transform: "translateX(-50%)"}}>
                    <source src={`/dist/video/${props.elemento}.mov`} type="video/mp4" />
                </video>
            </Accordion.Body>
        </Accordion.Item>
    )
}


function Ayuda() {

    return (
        <div className="content-wrapper" style={{ minHeight: '688.2px' }}>
            <TituloSeccion titulo="Ayuda" />
            <section className="content">
                <div className='container'>
                    <Accordion>
                        <AcItemAyuda eventKey="0" titulo="Panel" elemento="Panel" />
                        <AcItemAyuda eventKey="1" titulo="Entrada (modo MANUAL)" elemento="Entrada_manual" />
                        <AcItemAyuda eventKey="2" titulo="Entrada (modo AUTOMATICO)" elemento="Entrada_auto" />
                        <AcItemAyuda eventKey="3" titulo="Configuración" elemento="Configuración" />
                        <AcItemAyuda eventKey="4" titulo="Órdenes" elemento="Órdenes" />
                        <AcItemAyuda eventKey="5" titulo="Histórico" elemento="Historico" />
                        <AcItemAyuda eventKey="6" titulo="Presentación" elemento="Presentación" />
                    </Accordion>
                </div>
            </section>
        </div>
    )
}

export default Ayuda;