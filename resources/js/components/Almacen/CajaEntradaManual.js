import React from "react";
import axios from "axios";
import { Caja } from "../generales";
import { throwToast} from "../../lib/notifications"

function CajaEntradaManual({ producto, setRegistro, setProducto }) {
    const handleEntrada = (e) => {
        e.preventDefault();
        const data = {
            producto_id: producto.id,
            cantidad: e.target.cantidad.value,
            notas: e.target.notas.value
        };
        axios.post("/api/almacen/entradaManual", data)
            .then((res) => {
                setProducto(res.data.producto);
                setRegistro(res.data.registro);
                throwToast("Entrada registrada", "Entrada manual guardada correctamente", "success");
                e.target.reset();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Caja titulo="Entrada manual" emoji="📥">
            <form onSubmit={handleEntrada}>
                <div className="form-group">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        id="cantidad"
                        name="cantidad"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notas">Notas</label>
                    <textarea
                        className="form-control"
                        id="notas"
                        name="notas"
                        rows="2"
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                    Registrar entrada
                </button>

            </form>
        </Caja>
    );
}

export default CajaEntradaManual;