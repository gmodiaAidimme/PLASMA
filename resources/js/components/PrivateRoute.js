import React, {useState, useEffect} from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Comun/Loader";

function PrivateRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        // console.log(isAuthenticated)
        axios.get("/api/registro/checkAuthenticated")
            .then(res => {
                // console.log(res);
                if (res.status === 200) {
                    setIsAuthenticated(true);
                }
            })
            .catch(err => {
                // console.log(err);
                if (err.response.status === 401) {
                    localStorage.removeItem("auth_token");
                }
                setIsAuthenticated(false);
            })
            .finally(() => {
                setIsAuthenticating(false);
            });

    }, []);

    if (isAuthenticating) {
        return <Loader />
    }

    return (
        <>
            {
                isAuthenticated ?
                    <Outlet /> :
                    <Navigate to="/login" />
            }
        </>
    )


}

export default PrivateRoute;