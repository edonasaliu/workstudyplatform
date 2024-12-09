import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup } from "react-bootstrap";
import { CSVLink } from "react-csv"; // For CSV Export
import CSVReader from "react-csv-reader"; // For CSV Import
import { FaPen, FaTrash, FaPlus, FaFileExport, FaUpload } from "react-icons/fa"; // Icons
import axios from "axios"; // For API calls

const BASE_URL = "http://localhost:8080"; // Adjust the port if necessary


const WSPositionTracker = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${BASE_URL}/ws-position-tracker`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        console.error("Failed to fetch WS Tracker entries:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching WS Tracker entries:", error);
    }
  };
  

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ws-position-tracker`);
        console.log("Fetching from:", `${BASE_URL}/ws-position-tracker`);
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };
    
  
    fetchPositions();
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
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${BASE_URL}/ws-position-tracker/${editingId}`
      : `${BASE_URL}/ws-position-tracker`;
    try {
      console.log("Sending data:", formData); // Log the formData being sent
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Response data:", data); // Log the backend response
      setEntries((prev) =>
        isEditing
          ? prev.map((e) => (e.id === editingId ? data : e))
          : [...prev, data]
      );
      setShowModal(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving position:", error);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/ws-position-tracker/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete WS Tracker entry");
      }
  
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting WS Tracker entry:", error);
    }
  };
  

const handleImport = async (data) => {
  // Ensure the data matches the required structure
  const formattedData = data.map((row) => ({
    student_id: row[0] || "",
    minerva_email: row[1] || "",
    full_name: row[2] || "",
    expected_grad_year: row[3] || "",
    ws_eligible: row[4] === "Yes",
    role: row[5] || "",
    manager_name: row[6] || "",
    paycom_manager: row[7] || "",
    manager_email: row[8] || "",
    department_name: row[9] || "",
    paycom_id: row[10] || "",
    contractor_status: row[11] || "",
    notes: row[12] || "",
    merge_status: row[13] || "",
  }));

  try {
    // Save each entry to the backend
    for (const entry of formattedData) {
      const response = await fetch(`${BASE_URL}/ws-position-tracker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        console.error(`Failed to save entry:`, entry, await response.text());
        continue;
      }

      const savedEntry = await response.json();
      // Update frontend state after saving each entry
      setEntries((prev) => [...prev, savedEntry]);
    }

    alert("Data imported successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
    alert("Failed to import data. Please try again.");
  }
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
              inputId="csv-upload"
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
                border: "none",
              }}
            >
              <FaFileExport />
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
            <Button 
              variant="primary" 
              onClick={handleSubmit} 
              style={{ backgroundColor: "#f45d26", borderColor: "#f45d26" }}
            >
              {isEditing ? "Save Changes" : "Add Entry"}
            </Button>

          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default WSPositionTracker;
