import React, {useState, useEffect} from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Comun/Loader";

function PermitedRoute() {
    const [tienePermiso, setTienePermiso] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const currentUrl = window.location.href;
    const url = currentUrl.split("/");
    
    useEffect(() => {
        axios.get(`/api/${url[3]}/checkPermiso`)
            .then(res => {
                if (res.status === 200) {
                    setTienePermiso(true);
                }
            })
            .catch(err => {
                setTienePermiso(false);
            })
            .finally(() => {
                setIsChecking(false);
            });

    }, []);

    if (isChecking) {
        return <Loader />
    }

    return (
        <>
            {
                tienePermiso ?
                    <Outlet /> :
                    <Navigate to="/login" />
            }
        </>
    )


}

export default PermitedRoute;