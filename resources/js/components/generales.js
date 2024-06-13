import React from 'react'

export function BoxHeader({ emoji, titulo, tools = "" }) {
    return (
        <div className="card-header">
            <h3 className="card-title">
                {emoji} {titulo}
            </h3>
            <div className='card-tools'>
                {tools}
            </div>
        </div>
    )
}

function ImagenUsuario() {
    try {
        return (<img src={"/dist/img/user" + this.props.usuario_id + ".png"} className={this.props.clase} alt="Foto de perfil" />)
    }
    catch (error) {
        return (<img src="/dist/img/generic_user.png" className={this.props.clase} alt="Foto de perfil" />)
    }
}

export function TituloSeccion(props) {
    return (
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">{props.titulo}</h1>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item active">{props.titulo}</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Caja({ titulo, emoji, children, tools, footer = "" }) {
    return (
        <div className="card">
            <BoxHeader titulo={titulo} emoji={emoji} tools={tools} />
            <div className="card-body">
                {children}
            </div>
            {
                footer !== "" ?
                    <div className='card-footer'>
                        {footer}
                    </div>
                    :
                    null
            }
        </div>
    )
}

export function Modal(props) {
    return (
        <div className="modal fade show" tabIndex={-1} style={{ paddingRight: "17px", display: "block" }} role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{props.titulo}</h4>
                        <button type="button" className="close" onClick={props.hideModal} data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">x</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                    {
                        props.footer ?
                            <div className="modal-footer justify-content-between">
                                <button type="button" className="btn btn-default" onClick={props.hideModal} data-dismiss="modal">Cancelar</button>
                                <button type="button" className={"btn btn-" + props.tipo} id="btn-delete" onClick={props.handleAction}>{props.accion}</button>
                            </div> :
                            null
                    }
                </div>
            </div>
        </div>
    )
}

export default ImagenUsuario;
