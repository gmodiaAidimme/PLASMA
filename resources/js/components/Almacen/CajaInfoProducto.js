import React from "react";


function CajaInfoProducto({ producto, isLoading }) {

    return (

        <div className="card card-widget widget-user-2">
            <div className="widget-user-header">
                <div className="widget-user-image">
                    <img className="img-circle elevation-2" src={"/images/" + producto.imagen} alt="Imagen producto" />
                </div>
                <h3 className="widget-user-username">{producto.nombre}</h3>
                <h5 className="widget-user-desc">{producto.descripcion}</h5>
            </div>
            <div className="card-footer p-0">
                <ul className="nav flex-column">
                    {producto.stock_erp &&
                        <li className="nav-item">
                            <div className="nav-link">
                                Stock ERP <span className="float-right badge bg-primary">{producto.stock_erp}</span>
                            </div>
                        </li>
                    }
                    <li className="nav-item">
                        <div className="nav-link">
                            Stock fabricado <span className="float-right badge bg-secondary">{producto.stock}</span>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default CajaInfoProducto;