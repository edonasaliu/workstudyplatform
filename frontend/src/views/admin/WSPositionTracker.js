import React, { useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { CSVLink } from "react-csv"; // For CSV Export
import CSVReader from "react-csv-reader"; // For CSV Import
import { FaPen, FaTrash, FaPlus, FaFileCsv, FaUpload } from "react-icons/fa"; // For icons

const WSPositionTracker = () => {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  const handleSubmit = () => {
    if (isEditing) {
      setEntries((prev) =>
        prev.map((entry, index) =>
          index === editingId ? { ...entry, ...formData } : entry
        )
      );
    } else {
      setEntries((prev) => [...prev, formData]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((_, index) => index !== id));
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
    setEntries(formattedData);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          padding: "20px",
          boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ marginBottom: "20px", color: "#333" }}>Actions</h3>
        <Button
          onClick={() => handleShowModal()}
          style={{
            width: "100%",
            backgroundColor: "#ff7700",
            border: "none",
            color: "white",
            padding: "10px",
            marginBottom: "15px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaPlus /> Add New Entry
        </Button>
        <Button
          style={{
            width: "100%",
            backgroundColor: "#ff7700",
            border: "none",
            color: "white",
            padding: "10px",
            marginBottom: "15px",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaFileCsv />
          <CSVLink
            data={entries}
            filename="ws_tracker.csv"
            style={{ textDecoration: "none", color: "white" }}
          >
            Export to CSV
          </CSVLink>
        </Button>
        <div>
          <CSVReader
            onFileLoaded={handleImport}
            parserOptions={{ header: false }}
            inputStyle={{
              width: "100%",
              backgroundColor: "#ff7700",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            label={
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaUpload /> Import CSV
              </span>
            }
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
          WS Position Tracker
        </h1>
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
            {entries.map((entry, index) => (
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
                      onClick={() => handleShowModal(entry, index)}
                    />
                    <FaTrash
                      style={{
                        color: "#dc3545",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      onClick={() => handleDelete(index)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isEditing ? "Edit Entry" : "Add New Entry"}
            </Modal.Title>
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
