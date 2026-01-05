import React, { useEffect, useState } from "react";


const CreateNewVisit = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [step, setStep] = useState(1);

  const [patients, setPatients] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [visitDate, setVisitDate] = useState("");

  const [searchPatient, setSearchPatient] = useState("");
  const [searchVolunteer, setSearchVolunteer] = useState("");
  const [pagePatients, setPagePatients] = useState(0);
  const [pageVolunteers, setPageVolunteers] = useState(0);
  const [totalPagesPatients, setTotalPagesPatients] = useState(1);
  const [totalPagesVolunteers, setTotalPagesVolunteers] = useState(1);

  const jwtToken = localStorage.getItem("jwtToken");

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await fetch(
        `${apiUrl}admin/list-patients?page=${pagePatients}&size=5&search=${searchPatient}&aliveOnly=true`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load patients");
      const data = await res.json();
      setPatients(data.content);
      setTotalPagesPatients(data.totalPages);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch volunteers
  const fetchVolunteers = async () => {
    try {
      const res = await fetch(
        `${apiUrl}admin/list-volunteers?page=${pageVolunteers}&size=5&search=${searchVolunteer}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      if (!res.ok) throw new Error("Failed to load volunteers");
      const data = await res.json();
      setVolunteers(data.content);
      setTotalPagesVolunteers(data.totalPages);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (step === 1) fetchPatients();
  }, [pagePatients, searchPatient, step]);

  useEffect(() => {
    if (step === 2) fetchVolunteers();
  }, [pageVolunteers, searchVolunteer, step]);

  // Select/Deselect patients
  const togglePatientSelection = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Assign volunteer
  const handleAssign = async () => {
    if (!selectedPatients.length || !selectedVolunteer || !visitDate) {
      alert("Please complete all steps before confirming.");
      return;
    }

    try {
      const res = await fetch(`${apiUrl}admin/assign-volunteer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          volunteerId: selectedVolunteer,
          patientIds: selectedPatients,
          visitDate,
        }),
      });

      if (!res.ok) throw new Error("Failed to assign volunteer");

      alert("Volunteer assigned successfully!");
      setSelectedPatients([]);
      setSelectedVolunteer(null);
      setVisitDate("");
      setStep(1);
    } catch (err) {
      alert(err.message);
    }
  };

  // Progress bar steps
  const steps = ["Select Patients", "Select Volunteer", "Select Date", "Review & Confirm"];

  return (
    <div className="create-visit-page">
      <h2 className="mb-4">Create New Visit</h2>

      {/* Progress bar */}
      <div className="flex justify-between mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {steps.map((label, index) => {
          const isActive = index + 1 === step;
          const isCompleted = index + 1 < step;
          return (
            <div
              key={index}
              className="flex-1 text-center py-3 border-r border-gray-100 last:border-0 relative font-medium text-sm transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--primary-light)' : (isCompleted ? '#f0fdf4' : 'white'),
                color: isActive ? 'var(--primary-dark)' : (isCompleted ? 'var(--success-color)' : 'var(--text-secondary)'),
                fontWeight: isActive ? '700' : '500'
              }}
            >
              <div className="mb-1">Step {index + 1}</div>
              <div>{label}</div>
              {isCompleted && <i className="fas fa-check absolute top-2 right-2 text-xs"></i>}
            </div>
          );
        })}
      </div>

      <div className="card">
        {/* Step 1: Select Patients */}
        {step === 1 && (
          <section>
            <h3 className="text-lg font-bold mb-4">Step 1: Select Patients</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="input-field"
                style={{ maxWidth: '300px' }}
              />
            </div>

            <div style={{ overflow: 'hidden', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <table className="main-table" style={{ width: '100%', marginBottom: 0 }}>
                <thead style={{ backgroundColor: 'var(--background-color)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '60px' }}>Select</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Mobile</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedPatients.includes(p.id)}
                          onChange={() => togglePatientSelection(p.id)}
                          style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.mobileNumber}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{p.age}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-outline"
                  disabled={pagePatients === 0}
                  onClick={() => setPagePatients((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {pagePatients + 1} of {totalPagesPatients}
                </span>
                <button
                  className="btn btn-outline"
                  disabled={pagePatients + 1 >= totalPagesPatients}
                  onClick={() => setPagePatients((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>

              <div className="flex gap-4 items-center">
                <div className="text-sm text-gray-600">
                  {selectedPatients.length} patient(s) selected
                </div>
                <button
                  className="btn btn-primary"
                  disabled={!selectedPatients.length}
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Select Volunteer */}
        {step === 2 && (
          <section>
            <h3 className="text-lg font-bold mb-4">Step 2: Select Volunteer</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search volunteers..."
                value={searchVolunteer}
                onChange={(e) => setSearchVolunteer(e.target.value)}
                className="input-field"
                style={{ maxWidth: '300px' }}
              />
            </div>

            <div style={{ overflow: 'hidden', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <table className="main-table" style={{ width: '100%', marginBottom: 0 }}>
                <thead style={{ backgroundColor: 'var(--background-color)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '60px' }}>Select</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((v) => (
                    <tr key={v.id} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <input
                          type="radio"
                          name="volunteer"
                          checked={selectedVolunteer === v.id}
                          onChange={() => setSelectedVolunteer(v.id)}
                          style={{ width: '1.2rem', height: '1.2rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.name}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.phoneNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-outline"
                  disabled={pageVolunteers === 0}
                  onClick={() => setPageVolunteers((prev) => prev - 1)}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {pageVolunteers + 1} of {totalPagesVolunteers}
                </span>
                <button
                  className="btn btn-outline"
                  disabled={pageVolunteers + 1 >= totalPagesVolunteers}
                  onClick={() => setPageVolunteers((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>

              <div className="flex gap-2">
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="btn btn-primary"
                  disabled={!selectedVolunteer}
                  onClick={() => setStep(3)}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Select Date */}
        {step === 3 && (
          <section>
            <h3 className="text-lg font-bold mb-4">Step 3: Select Date</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Visit Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="input-field"
                style={{ maxWidth: '250px' }}
              />
            </div>

            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                disabled={!visitDate}
                onClick={() => setStep(4)}
              >
                Next
              </button>
            </div>
          </section>
        )}

        {/* Step 4: Review & Confirm */}
        {step === 4 && (
          <section>
            <h3 className="text-lg font-bold mb-4">Step 4: Review & Confirm Details</h3>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Patients Selected ({selectedPatients.length})</h4>
                <div className="bg-white p-3 rounded border border-gray-200">
                  {/* We need to show names, but we only have IDs in selectedPatients. 
                             Ideally we should store objects or re-fetch/lookup. 
                             For now, we can only display count accurately or names if they are in current page 'patients' array.
                             Better: Let's assume user just wants confirmation.
                          */}
                  {/* Trying to find names from valid pool if available, otherwise just ID count */}
                  <ul className="list-disc list-inside">
                    {selectedPatients.map(id => {
                      // Try to find name in currently loaded page, fallback to ID
                      const p = patients.find(pat => pat.id === id);
                      return <li key={id}>{p ? p.name : `Patient ID: ${id}`}</li>
                    })}
                  </ul>
                  {selectedPatients.length > patients.length && <p className="text-xs text-gray-400 mt-2 italic">*Only showing patients from current view. All {selectedPatients.length} are selected.</p>}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Assigned Volunteer</h4>
                <div className="bg-white p-3 rounded border border-gray-200 font-medium">
                  {volunteers.find((v) => v.id === selectedVolunteer)?.name || `Volunteer ID: ${selectedVolunteer}`}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Visit Date</h4>
                <div className="bg-white p-3 rounded border border-gray-200 font-medium">
                  {visitDate}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => setStep(3)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleAssign}>
                <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i> Confirm & Assign
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CreateNewVisit;
