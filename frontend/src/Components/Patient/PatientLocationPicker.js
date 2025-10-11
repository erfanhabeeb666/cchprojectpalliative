import React, { useState, useCallback, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = { lat: 10.8505, lng: 76.2711 }; // Kerala

export default function PatientLocationPicker({ value, onChange }) {
  const [selected, setSelected] = useState(value || null);
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  const onMapClick = useCallback((event) => {
    const next = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    setSelected(next);
    if (onChange) onChange(next);
  }, [onChange]);

  const mapCenter = useMemo(() => selected || defaultCenter, [selected]);

  if (isOffline) {
    return (
      <div className="p-3 border rounded bg-yellow-50 text-yellow-800">
        You are offline — location selection is optional.
      </div>
    );
  }

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={selected ? 12 : 8}
        onClick={onMapClick}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
      <div className="text-sm text-gray-600 mt-2">
        {selected ? (
          <span>Selected: {selected.lat.toFixed(6)}, {selected.lng.toFixed(6)}</span>
        ) : (
          <span>Click on the map to select patient location (optional)</span>
        )}
      </div>
    </div>
  );
}
