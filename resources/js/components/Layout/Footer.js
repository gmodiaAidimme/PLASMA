import React from "react"

function Footer() {
    return (
        <footer className="main-footer" style={{maxHeight: "60px"}}>
            <strong>Copyright &copy; 2021 <a href="https://www.aidimme.es/">AIDIMME</a>.</strong>
            Todos los derechos reservados.
            <div className="float-right d-none d-sm-inline-block">
                <b>Version</b> 2.0.0
            </div>
        </footer>
    )
}

export default Footer