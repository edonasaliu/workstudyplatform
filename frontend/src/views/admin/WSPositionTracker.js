import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup } from "react-bootstrap";
import { CSVLink } from "react-csv"; // For CSV Export
import CSVReader from "react-csv-reader"; // For CSV Import
import { FaPen, FaTrash, FaPlus, FaFileCsv, FaUpload } from "react-icons/fa"; // Icons
import axios from "axios"; // For API calls

const WSPositionTracker = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch entries from the backend
  const fetchEntries = async () => {
    try {
      const response = await axios.get("/api/ws-position-tracker");
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching WS Tracker entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleShowModal = (entry = {}, id = null) => {
    setFormData(entry);
    setIsEditing(Boolean(id));
    setEditingId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormData({});
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    if (!formData.student_id || !formData.minerva_email || !formData.full_name) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/api/ws-position-tracker/${editingId}`, formData);
      } else {
        await axios.post(`/api/ws-position-tracker`, formData);
      }
      fetchEntries();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving data:", error.response || error);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/ws-position-tracker/${id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting WS Tracker entry:", error);
    }
  };

  const handleImport = (data) => {
    const formattedData = data.map((row) => ({
      student_id: row[0],
      minerva_email: row[1],
      full_name: row[2],
      expected_grad_year: row[3],
      ws_eligible: row[4] === "Yes",
      role: row[5],
      manager_name: row[6],
      paycom_manager: row[7],
      manager_email: row[8],
      department_name: row[9],
      paycom_id: row[10],
      contractor_status: row[11],
      notes: row[12],
      merge_status: row[13],
    }));
    setEntries((prev) => [...prev, ...formattedData]);
  };

  const filteredEntries = entries.filter((entry) =>
    Object.values(entry)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          WS Position Tracker
        </h1>
        <div className="d-flex align-items-center mb-4 justify-content-between">
          <InputGroup style={{ flex: 1, marginRight: "20px" }}>
            <Form.Control
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: "40px" }}
            />
          </InputGroup>
          <div className="d-flex">
            <CSVReader
              onFileLoaded={handleImport}
              parserOptions={{ header: false }}
              inputStyle={{ display: "none" }}
            />
            <label
              htmlFor="csv-upload"
              style={{
                backgroundColor: "#17a2b8",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaUpload /> Import CSV
            </label>
            <Button
              variant="info"
              onClick={() => {}}
              style={{
                backgroundColor: "#17a2b8",
                border: "none",
                height: "40px",
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <FaFileCsv />
              <CSVLink
                data={entries}
                filename="ws_tracker.csv"
                style={{ textDecoration: "none", color: "white" }}
              >
                Export CSV
              </CSVLink>
            </Button>
            <Button
              variant="primary"
              onClick={() => handleShowModal()}
              style={{
                backgroundColor: "#f45d26",
                borderColor: "transparent",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaPlus /> Add New Entry
            </Button>
          </div>
        </div>
        <Table
          striped
          bordered
          hover
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead style={{ backgroundColor: "#f2f2f2", color: "#333" }}>
            <tr>
              <th>Student ID</th>
              <th>Minerva Email</th>
              <th>Full Name</th>
              <th>Expected Grad Year</th>
              <th>WS Eligible</th>
              <th>Role</th>
              <th>Manager Name</th>
              <th>Paycom Manager</th>
              <th>Manager Email</th>
              <th>Department Name</th>
              <th>Paycom ID</th>
              <th>Contractor Status</th>
              <th>Notes</th>
              <th>Merge Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.student_id}</td>
                <td>{entry.minerva_email}</td>
                <td>{entry.full_name}</td>
                <td>{entry.expected_grad_year}</td>
                <td>{entry.ws_eligible ? "Yes" : "No"}</td>
                <td>{entry.role}</td>
                <td>{entry.manager_name}</td>
                <td>{entry.paycom_manager}</td>
                <td>{entry.manager_email}</td>
                <td>{entry.department_name}</td>
                <td>{entry.paycom_id}</td>
                <td>{entry.contractor_status}</td>
                <td>{entry.notes}</td>
                <td>{entry.merge_status}</td>
                <td>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <FaPen
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() => handleShowModal(entry, entry.id)}
                    />
                    <FaTrash
                      style={{
                        color: "#dc3545",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() => handleDelete(entry.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? "Edit Entry" : "Add New Entry"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {[
              "student_id",
              "minerva_email",
              "full_name",
              "expected_grad_year",
              "ws_eligible",
              "role",
              "manager_name",
              "paycom_manager",
              "manager_email",
              "department_name",
              "paycom_id",
              "contractor_status",
              "notes",
              "merge_status",
            ].map((field) => (
              <Form.Group controlId={field} key={field} className="mb-3">
                <Form.Label>{field.replace(/_/g, " ")}</Form.Label>
                {field === "ws_eligible" ? (
                  <Form.Check
                    type="checkbox"
                    name={field}
                    checked={!!formData[field]}
                    onChange={handleChange}
                  />
                ) : (
                  <Form.Control
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                  />
                )}
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? "Save Changes" : "Add Entry"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default WSPositionTracker;
