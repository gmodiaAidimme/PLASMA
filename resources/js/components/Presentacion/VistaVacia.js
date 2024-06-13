import React from "react";

function VistaVacia(){
    return (
        <>

            <div className="container text-center viewnotfound" style={{ marginTop: '50px' }}>
                <div className="row">
                    <div className="col">
                        <i className="fas fa-exclamation-triangle fa-4x text-danger mb-3"></i>
                        <h3 className="text-danger mb-4">Esta vista no existe</h3>
                        <p className="lead mb-4">Parece que la página que buscas no está disponible. Por favor, accede al panel de vistas y carga otra.</p>
                        <button className="btn btn-primary btn-lg" onClick={() => window.location = '/presentacion'}>
                            Ir al Panel de Vistas
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VistaVacia;
