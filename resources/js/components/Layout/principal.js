import React from "react"
import HomePage from "../Panel/HomePage"
import Configuracion from "../Configuracion/Configuracion"
import Perfil from "../Perfil/Perfil"
import Entrada from "../Entrada/Entrada"
import Historico from "../Historico/Historico"
import ListaOrdenFab from "../OF/ListaOrdenfab"
import PanelMaquina from "../Panel/PanelMaquina"
import Operarios from "../Operarios/Operarios"
import { Routes, Route } from "react-router-dom";
import DetallesOF from "../OF/DetallesOF"
import DetallesOperario from "../Operarios/DetallesOperario";
import Landing from "../Landing/Landing"
import Estadisticas from "../Estadisticas/Estadisticas"
import Presentacion from "../Presentacion/Presentacion"
import NuevaVista from "../Presentacion/NuevaVista"
import Ayuda from "../Ayuda/Ayuda"
import Proyectos from "../Proyectos/Selector/Proyectos"
import DetallesProyecto from "../Proyectos/Detalles/DetallesProyecto"
import Control from "../Control/Control"    
import Almacen from "../Almacen/Almacen"    
import Producto from "../Almacen/Producto"
import ConfUsuarios from "../Configuracion/Usuarios/ConfUsuarios"
import ConfMaquinas from "../Configuracion/Maquinas/ConfMaquinas"
import ConfHorarios from "../Configuracion/Horarios/ConfHorarios"
import ConfProductividad from "../Configuracion/Productividad/ConfProductividad"
import ConfAlarmas from "../Configuracion/Alarmas/ConfAlarmas"
import ConfPreferencias from "../Configuracion/Preferencias/ConfPreferencias"
import ConfStock from "../Configuracion/Stock/ConfStock"


function Principal() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/proyectos/:id" element={<DetallesProyecto />} />

            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/configuracion/usuarios" element={<ConfUsuarios />} />
            <Route path="/configuracion/maquinas" element={<ConfMaquinas />} />
            <Route path="/configuracion/horarios" element={<ConfHorarios />} />
            <Route path="/configuracion/productividad" element={<ConfProductividad />} />
            <Route path="/configuracion/alarmas" element={<ConfAlarmas />} />
            <Route path="/configuracion/preferencias" element={<ConfPreferencias />} />
            <Route path="/configuracion/stock" element={<ConfStock />} />

            <Route path="/perfil" element={<Perfil />} />

            <Route path="/entrada" element={<Entrada />} />
            <Route path="/entrada/:maq" element={<Entrada />} />
            
            <Route path="/operarios" element={<Operarios />} />
            <Route path="/operarios/:id" element={<DetallesOperario />} />
            
            <Route path="/panel/:maquina" element={<HomePage />} />
            <Route path="/panel_maquina" element={<PanelMaquina />} />
            
            <Route path="/historico" element={<Historico />} />
            
            <Route path="/of/:of" element={<DetallesOF />} />
            <Route path="/ofs" element={<ListaOrdenFab />} />
            
            <Route path="/estadisticas" element={<Estadisticas />} />

            <Route path="/presentacion" element={<Presentacion />} />

            <Route path="/nueva_vista" element={<NuevaVista/>}/>
            <Route path="/editarVista/:id_vista" element={<NuevaVista/>}/>

            <Route path="/control" element={<Control />} />

            <Route path="/ayuda" element={<Ayuda/>}/>

            <Route path="/almacen" element={<Almacen/>}/>
            <Route path="/almacen/:id" element={<Producto/>}/>
        </Routes>
    )
}

export default Principal