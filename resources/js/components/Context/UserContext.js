import { createContext } from "react";

export const UserContext = createContext({
    user: null,
    avatar: null,
    permisos: []
});