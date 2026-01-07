import React, { useState, useEffect } from "react";
import AddConsumable from "./AddConsumable";
import axios from "axios";

const ConsumablePage = () => {
  const [consumableList, setConsumableList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState({}); // {id: qty}
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("jwtToken");

  // Pagination & search
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usage, setUsage] = useState([]);
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [usageError, setUsageError] = useState("");

  const fetchConsumables = async (pageNum = page, searchTerm = searchQuery) => {
    try {
      const response = await axios.get(`${apiUrl}admin/consumable/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: pageNum, size, search: searchTerm },
      });
      // Expecting a paginated response { content, number, totalPages }
      setConsumableList(response.data.content || []);
      if (typeof response.data.number === "number") setPage(response.data.number);
      if (typeof response.data.totalPages === "number") setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch consumables", err);
    }
  };

  useEffect(() => {
    fetchConsumables();
  }, []);

  // Refetch when search query changes (reset to first page)
  useEffect(() => {
    fetchConsumables(0, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleAddSuccess = () => {
    fetchConsumables(0, searchQuery);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this consumable?")) {
      try {
        await axios.delete(`${apiUrl}admin/consumable/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchConsumables(page, searchQuery);
      } catch (err) {
        console.error("Failed to delete consumable", err);
      }
    }
  };

  const handleStockUpdate = async (id, action) => {
    const qty = updateQuantity[id] || 0;
    if (qty <= 0) {
      alert("Enter a valid quantity");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}admin/consumable/${id}/${action}-stock`,
        {},
        {
          params: { quantity: qty },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchConsumables(page, searchQuery);
      setUpdateQuantity((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error(`Failed to ${action} stock`, err);
      alert(`Failed to ${action} stock`);
    }
  };

  const fetchUsage = async () => {
    try {
      setLoadingUsage(true);
      setUsageError("");
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await axios.get(`${apiUrl}admin/consumable/usage-summary`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setUsage(res.data || []);
    } catch (e) {
      console.error("Failed to fetch usage summary", e);
      setUsageError("Failed to load usage summary");
    } finally {
      setLoadingUsage(false);
    }
  };

  return (
    <div className="consumable-page">
      <div className="flex justify-between items-center mb-4">
        <h2>Consumables Management</h2>

        <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setActiveTab("manage")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: activeTab === "manage" ? "var(--primary-light)" : "transparent",
              color: activeTab === "manage" ? "var(--primary-dark)" : "var(--text-secondary)",
              fontWeight: activeTab === "manage" ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Manage
          </button>
          <button
            onClick={() => setActiveTab("usage")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: activeTab === "usage" ? "var(--primary-light)" : "transparent",
              color: activeTab === "usage" ? "var(--primary-dark)" : "var(--text-secondary)",
              fontWeight: activeTab === "usage" ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            Usage stats
          </button>
        </div>
      </div>

      {activeTab === "usage" && (
        <div className="card">
          <div className="flex items-end gap-4 mb-6 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 invisible">&nbsp;</label>
              <button
                className="btn btn-primary"
                onClick={fetchUsage}
                style={{
                  padding: '0 1rem',
                  fontSize: '0.875rem',
                  height: '41px',
                  minHeight: 'auto',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Show Usage
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Consolidated Consumable Usage</h3>
            {loadingUsage ? (
              <div className="text-gray-500">Loading usage statistics...</div>
            ) : usageError ? (
              <div className="text-red-500">{usageError}</div>
            ) : (
              <div style={{ overflow: 'hidden', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                <table className="main-table" style={{ width: '100%', marginBottom: 0 }}>
                  <thead style={{ backgroundColor: 'var(--background-color)' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Consumable</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Total Quantity Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!usage || usage.length === 0) ? (
                      <tr>
                        <td colSpan="2" style={{ textAlign: "center", padding: "16px", color: 'var(--text-secondary)' }}>No usage recorded in this period</td>
                      </tr>
                    ) : (
                      usage.map((u) => (
                        <tr key={u.consumableId} style={{ borderTop: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>{u.name}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>{u.totalQuantityUsed}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "manage" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search consumables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ maxWidth: '300px' }}
            />
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={() => fetchConsumables(0, searchQuery)}>
                <i className="fas fa-sync-alt"></i>
              </button>
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i> Add Consumable
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="modal-overlay" style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
              justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}>
              <div className="form-container" style={{
                background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)',
                width: '100%', maxWidth: '500px'
              }}>
                <AddConsumable onSuccess={handleAddSuccess} onCancel={() => setShowAddForm(false)} />
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="main-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--background-color)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>ID</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Consumable Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Quantity</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Update Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consumableList.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: 'var(--text-secondary)' }}>
                      No consumables available
                    </td>
                  </tr>
                ) : (
                  consumableList.map((consumable) => (
                    <tr key={consumable.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>{consumable.id}</td>
                      <td style={{ padding: '1rem' }}>{consumable.name}</td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>{consumable.stockQuantity}</td>
                      <td style={{ padding: '1rem' }}>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={updateQuantity[consumable.id] || ""}
                            onChange={(e) =>
                              setUpdateQuantity((prev) => ({
                                ...prev,
                                [consumable.id]: e.target.value,
                              }))
                            }
                            className="input-field"
                            style={{ width: "60px", padding: '0.25rem 0.5rem' }}
                          />
                          <button
                            onClick={() => handleStockUpdate(consumable.id, "add")}
                            className="btn btn-outline"
                            title="Add Stock"
                            style={{ padding: '0.25rem 0.5rem', color: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                          <button
                            onClick={() => handleStockUpdate(consumable.id, "subtract")}
                            className="btn btn-outline"
                            title="Subtract Stock"
                            style={{ padding: '0.25rem 0.5rem', color: 'var(--warning-color)', borderColor: 'var(--warning-color)' }}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleDelete(consumable.id)}
                          className="btn btn-outline"
                          title="Remove Consumable"
                          style={{ padding: '0.25rem 0.5rem', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              className="btn btn-outline"
              disabled={page === 0}
              onClick={() => fetchConsumables(page - 1, searchQuery)}
            >
              Previous
            </button>
            <span style={{ color: 'var(--text-secondary)' }}>
              Page {page + 1} of {totalPages}
            </span>
            <button
              className="btn btn-outline"
              disabled={page + 1 >= totalPages}
              onClick={() => fetchConsumables(page + 1, searchQuery)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConsumablePage;
