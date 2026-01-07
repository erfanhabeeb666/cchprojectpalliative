import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMaps } from "./common/MapsProvider";
import axios from "axios";

// Modal Component for Submitting Report
const ProcedureModal = ({ visit, procedures, consumables, onClose, onSubmit }) => {
  const [selectedProcedure, setSelectedProcedure] = useState([]);
  const [selectedConsumables, setSelectedConsumables] = useState([]);
  const [status, setStatus] = useState("COMPLETED");
  const [notes, setNotes] = useState("");

  const getConsumableQty = (id) => {
    const item = selectedConsumables.find((c) => c.consumableId === id);
    return item ? item.quantity : "";
  };

  const handleConsumableChange = (id, quantity) => {
    setSelectedConsumables((prev) => {
      const existing = prev.find((c) => c.consumableId === id);
      if (existing) {
        return prev.map((c) =>
          c.consumableId === id ? { ...c, quantity: quantity } : c
        );
      } else {
        return [...prev, { consumableId: id, quantity: quantity }];
      }
    });
  };

  const handleSubmit = async () => {
    if (status !== "CANCELLED" && !selectedProcedure.length) {
      alert("Please select at least one procedure");
      return;
    }

    try {
      const procsToSend = status === "CANCELLED" ? [] : selectedProcedure;
      const consumablesToSend = status === "CANCELLED"
        ? []
        : selectedConsumables.filter((c) => c.quantity > 0);

      await onSubmit(visit.id, procsToSend, consumablesToSend, status, notes);
      onClose();
    } catch (err) {
      alert("Failed to submit visit");
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="form-container" style={{
        background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
        width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h3 className="text-xl font-bold mb-4">Submit Visit Report</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => {
              const val = e.target.value;
              setStatus(val);
              if (val === "CANCELLED") {
                setSelectedProcedure([]);
                setSelectedConsumables([]);
              }
            }}
            className="input-field"
          >
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {status !== "CANCELLED" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Procedures</label>
            <div className="bg-gray-50 p-3 rounded border border-gray-200" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {procedures.map((procedure) => (
                <div key={procedure.procedureId} className="flex items-center mb-2 last:mb-0 hover:bg-gray-100 p-1 rounded cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id={`proc-${procedure.procedureId}`}
                    checked={selectedProcedure.includes(String(procedure.procedureId))}
                    onChange={(e) => {
                      const id = String(procedure.procedureId);
                      if (e.target.checked) {
                        setSelectedProcedure([...selectedProcedure, id]);
                      } else {
                        setSelectedProcedure(selectedProcedure.filter((p) => p !== id));
                      }
                    }}
                    style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                  />
                  <label
                    htmlFor={`proc-${procedure.procedureId}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer flex-1"
                  >
                    {procedure.procedureName}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1 italic">* Select all procedures performed during this visit.</p>
          </div>
        )}

        {status !== "CANCELLED" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Consumables Used</label>
            <div className="bg-gray-50 p-2 rounded border border-gray-200" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {consumables.map((consumable) => (
                <div key={consumable.id} className="flex items-center justify-between mb-2">
                  <span className="text-sm">
                    {consumable.name} <span className="text-gray-400 text-xs">(Stock: {consumable.stockQuantity})</span>
                  </span>
                  {consumable.stockQuantity > 0 ? (
                    <input
                      type="number"
                      min="0"
                      max={consumable.stockQuantity}
                      value={getConsumableQty(consumable.id)}
                      placeholder="Qty"
                      onChange={(e) =>
                        handleConsumableChange(
                          consumable.id,
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      className="input-field"
                      style={{ width: '80px', padding: '0.25rem 0.5rem', marginBottom: 0 }}
                    />
                  ) : (
                    <span className="text-xs text-red-400">Out of stock</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            rows={4}
            placeholder="Add any notes about the visit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', width: '100%' }}>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
          >
            Submit Report
          </button>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ flex: 1, height: '38px', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Map Modal Component
const LocationModal = ({ coords, onClose }) => {
  const { isLoaded } = useMaps();

  if (!coords) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="form-container" style={{
        background: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)',
        width: '100%', maxWidth: '800px'
      }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Patient Location</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {!navigator.onLine && (
          <p className="text-yellow-600 mb-2">
            You are offline — map cannot be loaded.
          </p>
        )}

        {isLoaded && navigator.onLine ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px', borderRadius: '8px' }}
            center={{ lat: coords.lat, lng: coords.lng }}
            zoom={14}
          >
            <Marker position={{ lat: coords.lat, lng: coords.lng }} />
          </GoogleMap>
        ) : (
          <div className="p-4 bg-gray-100 rounded text-center">
            Latitude: {coords.lat}, Longitude: {coords.lng}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="btn btn-outline">Close</button>
        </div>
      </div>
    </div>
  );
};

const TodaysVisit = () => {
  const [assignedVisits, setAssignedVisits] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchAssignedVisits();
    fetchProcedures();
    fetchConsumables();
  }, []);

  const fetchAssignedVisits = async () => {
    setLoading(true);
    setError("");
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setError("No JWT token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}volunteer/assigned-visits`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch assigned visits");

      const data = await response.json();
      setAssignedVisits(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchProcedures = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) return;

    try {
      const response = await fetch(`${apiUrl}volunteer/procedures`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProcedures(data);
      }
    } catch (err) {
      console.error("Error fetching procedures", err);
    }
  };

  const fetchConsumables = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) return;

    try {
      const response = await fetch(`${apiUrl}volunteer/consumables`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setConsumables(data);
      }
    } catch (err) {
      console.error("Error fetching consumables", err);
    }
  };

  const handleModalOpen = (visit) => {
    setSelectedVisit(visit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedVisit(null);
    setIsModalOpen(false);
  };

  const openLocation = (visit) => {
    const lat = visit?.latitude ?? visit?.patientLatitude;
    const lng = visit?.longitude ?? visit?.patientLongitude;
    if (lat == null || lng == null) {
      alert("No location available for this patient");
      return;
    }
    if (!navigator.onLine) {
      alert("You are offline — map cannot be loaded now.");
      return;
    }
    setLocationCoords({ lat: Number(lat), lng: Number(lng) });
    setIsLocationOpen(true);
  };

  const openInGoogleMaps = (visit) => {
    const lat = visit?.latitude ?? visit?.patientLatitude;
    const lng = visit?.longitude ?? visit?.patientLongitude;
    if (lat == null || lng == null) {
      alert("No location available for this patient");
      return;
    }
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleProcedureSubmit = async (visitId, procedureIds, consumables, status, notes) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) return;

    try {
      const response = await fetch(`${apiUrl}volunteer/submit-report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitId,
          procedureIds,
          consumables,
          status,
          notes,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit visit");

      alert("Visit submitted successfully");
      fetchAssignedVisits();
    } catch (err) {
      alert("Failed to submit visit");
    }
  };

  return (
    <div className="todays-visits-page">
      <h2 className="mb-4">Today's Visits</h2>

      {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded border border-red-200">{error}</div>}

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading visits...</div>
      ) : assignedVisits.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-400 mb-2">
            <i className="fas fa-calendar-check fa-3x"></i>
          </div>
          <p className="text-lg text-gray-600">No visits assigned for today.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="main-table" style={{ width: '100%', marginBottom: 0, minWidth: '1000px' }}>
            <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Patient Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Volunteer Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Visit Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Submitted By</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedVisits.map((visit) => (
                <tr key={visit.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{visit.visitCode}</td>
                  <td style={{ padding: '1rem' }}>{visit.patientName}</td>
                  <td style={{ padding: '1rem' }}>{visit.volunteerName}</td>
                  <td style={{ padding: '1rem' }}>
                    {visit.visitDate
                      ? new Date(visit.visitDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: visit.status === 'COMPLETED' ? 'var(--primary-light)' : '#fef3c7',
                      color: visit.status === 'COMPLETED' ? 'var(--primary-dark)' : 'var(--warning-color)'
                    }}>
                      {visit.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{visit.submittedBy || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="flex gap-2 flex-wrap">
                      {visit.status === "PENDING" && (
                        <button
                          onClick={() => handleModalOpen(visit)}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                        >
                          Submit Report
                        </button>
                      )}
                      {((visit.latitude ?? visit.patientLatitude) != null) && ((visit.longitude ?? visit.patientLongitude) != null) && (
                        <>
                          <button
                            onClick={() => openLocation(visit)}
                            className="btn btn-outline"
                            title="View Map"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <i className="fas fa-map-marker-alt"></i>
                          </button>
                          <button
                            onClick={() => openInGoogleMaps(visit)}
                            className="btn btn-outline"
                            title="Open Google Maps"
                            style={{ padding: '0.25rem 0.5rem' }}
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Report Modal */}
      {isModalOpen && selectedVisit && (
        <ProcedureModal
          visit={selectedVisit}
          procedures={procedures}
          consumables={consumables}
          onClose={handleModalClose}
          onSubmit={handleProcedureSubmit}
        />
      )}

      {/* Map Modal */}
      {isLocationOpen && locationCoords && (
        <LocationModal
          coords={locationCoords}
          onClose={() => setIsLocationOpen(false)}
        />
      )}
    </div>
  );
};

export default TodaysVisit;
