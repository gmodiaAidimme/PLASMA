import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { throwToast } from "../../lib/notifications";


function RestorePassword(props) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const recover_password = () => {
        setLoading(true);
        axios.post("/api/registro/request_password_reset", { email: email })
            .then((res) => {
                throwToast("Hecho", "Se ha enviado un correo electrónico a la dirección indicada con las instrucciones para restablecer la contraseña.", "success");
                props.setEstado("login");
            })
            .catch((err) => {
                if (err.response.status == 400) {
                    throwToast("Error", "No existe ningún usuario con el correo electrónico indicado.", "error");
                } else {
                    throwToast("Error", "Ha ocurrido un error al enviar al solicitar el cambio de contraseña.", "error");
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <p className="login-box-msg">¿Has olvidado tu contraseña? Restáurala fácilmente aquí.</p>

            <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} disabled={loading} />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-envelope"></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-primary btn-block" onClick={recover_password} disabled={loading}> Recuperar contraseña </button>
                </div>
            </div>

            <p className="mt-3 mb-1">
                <a className="pointer" onClick={() => props.setEstado("login")}>Iniciar sesión</a>
            </p>
            <p className="mb-0">
                <a className="text-center pointer" onClick={() => props.setEstado("register")}>No tengo cuenta</a>
            </p>
        </>
    )

}

export default RestorePassword;