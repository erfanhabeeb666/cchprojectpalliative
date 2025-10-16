import React, { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const MapsContext = createContext({ isLoaded: false });

export const MapsProvider = ({ children }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });
  return (
    <MapsContext.Provider value={{ isLoaded }}>
      {children}
    </MapsContext.Provider>
  );
};

export const useMaps = () => useContext(MapsContext);
