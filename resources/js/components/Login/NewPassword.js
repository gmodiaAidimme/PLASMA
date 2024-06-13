import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { throwToast } from "../../lib/notifications";
import { useSearchParams } from "react-router-dom";


function NewPassword({ setEstado }) {
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [loading, setLoading] = useState(true);

    let [searchParams] = useSearchParams()
    let token = searchParams.get("token");

    useEffect(() => {
        setLoading(true);
        if (!token) {
            throwToast("Error", "Token inválido o caducado", "error");
            setEstado("login");
            return;
        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.get("/api/registro/check_password_reset_token/" + token)
                .then(response => {
                    setLoading(false);
                })
                .catch(error => {
                    throwToast("Error", "Token inválido o caducado", "error");
                    setEstado("login");
                })
        })
    }, [])

    const change_password = () => {
        if (password != password2) {
            throwToast("Error", "Las contraseñas no coinciden", "error");
            return;
        }

        setLoading(true);
        axios.post("/api/registro/change_password", { password: password, password_confirmation: password2, token: token })
            .then(response => {
                throwToast("Contraseña cambiada", "La contraseña se ha cambiado correctamente", "success");
                setEstado("login");
            })
            .catch(error => {
                throwToast("Error", "Ha ocurrido un error al cambiar la contraseña, inténtalo más tarde.", "error");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (

        <>
            <p className="login-box-msg">Elige una contraseña nueva.</p>

            <div className="input-group mb-3">
                <input type="password" className="form-control" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} value={password} disabled={loading} />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-key"></span>
                    </div>
                </div>
            </div>
            <div className="input-group mb-3">
                <input type="password" className="form-control" placeholder="Repite la contraseña" onChange={(e) => setPassword2(e.target.value)} value={password2} disabled={loading} />
                <div className="input-group-append">
                    <div className="input-group-text">
                        <span className="fas fa-key"></span>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-primary btn-block" onClick={change_password} disabled={loading}> Cambiar contraseña </button>
                </div>
            </div>

            <p className="mt-3 mb-1">
                <a className="pointer" onClick={() => setEstado("login")}>Iniciar sesión</a>
            </p>
            <p className="mb-0">
                <a className="text-center pointer" onClick={() => setEstado("register")}>No tengo cuenta</a>
            </p>
        </>
    )
}

export default NewPassword;