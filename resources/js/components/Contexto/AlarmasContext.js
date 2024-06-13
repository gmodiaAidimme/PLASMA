import React from "react";

const AlarmasContext = React.createContext({
    alarmas: [],
    isLoading: false,
    setAlarmas: () => {},
})


export default AlarmasContext