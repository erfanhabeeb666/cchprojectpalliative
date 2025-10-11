import React, { useState, useCallback, useMemo, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { useMaps } from "../common/MapsProvider";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const defaultCenter = { lat: 10.8505, lng: 76.2711 }; // Kerala

export default function PatientLocationPicker({ value, onChange }) {
  const [selected, setSelected] = useState(value || null);
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
  const { isLoaded } = useMaps();
  const autocompleteRef = useRef(null);

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
      <div className="mb-2">
        <Autocomplete
          onLoad={(ac) => (autocompleteRef.current = ac)}
          onPlaceChanged={() => {
            const place = autocompleteRef.current?.getPlace?.();
            if (!place || !place.geometry || !place.geometry.location) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const next = { lat, lng };
            setSelected(next);
            if (onChange) onChange(next);
          }}
        >
          <input
            type="text"
            placeholder="Search places..."
            className="w-full p-2 border rounded"
          />
        </Autocomplete>
      </div>
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
