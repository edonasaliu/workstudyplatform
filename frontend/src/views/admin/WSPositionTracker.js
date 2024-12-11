import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, InputGroup, Card, Container, Row, Col, Badge } from "react-bootstrap";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";
import { FaPen, FaTrash, FaPlus, FaFileExport, FaUpload, FaSearch, FaFilter } from "react-icons/fa";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Custom styles
const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "2rem",
  },
  header: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },
  headerTitle: {
    color: "#2c3e50",
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "0",
  },
  statsCard: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
    transition: "transform 0.2s",
    cursor: "default",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  actionButton: {
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s",
  },
  table: {
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    fontWeight: "600",
  },
  searchBar: {
    position: "relative",
    marginBottom: "1.5rem",
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6c757d",
  },
  modal: {
    borderRadius: "10px",
  },
  modalHeader: {
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
    padding: "1.5rem",
  },
};

const WSPositionTracker = () => {
  // State declarations
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEntries: 0,
    activeStudents: 0,
    departments: 0,
  });

  // Fetch entries on component mount
  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/ws-position-tracker`);
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        } else {
          console.error("Failed to fetch entries:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Update stats when entries change
  useEffect(() => {
    if (entries.length > 0) {
      const departments = new Set(entries.map(entry => entry.department_name)).size;
      const activeStudents = entries.filter(entry => entry.ws_eligible).length;
      setStats({
        totalEntries: entries.length,
        activeStudents,
        departments,
      });
    }
  }, [entries]);

  // Handler functions
  const handleShowModal = (entry = {}, id = null) => {
    setFormData(entry);
    setIsEditing(Boolean(id));
    setEditingId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setFormData({});
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${BASE_URL}/ws-position-tracker/${editingId}`
        : `${BASE_URL}/ws-position-tracker`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      setEntries(prev =>
        isEditing
          ? prev.map(e => (e.id === editingId ? data : e))
          : [...prev, data]
      );
      
      handleCloseModal();
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/ws-position-tracker/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete entry");
        }

        setEntries(prev => prev.filter(entry => entry.id !== id));
      } catch (error) {
        console.error("Error deleting entry:", error);
        alert("Failed to delete entry. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleImport = async (data) => {
    setLoading(true);
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
      for (const entry of formattedData) {
        const response = await fetch(`${BASE_URL}/ws-position-tracker`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });

        if (response.ok) {
          const savedEntry = await response.json();
          setEntries(prev => [...prev, savedEntry]);
        }
      }
      alert("Data imported successfully!");
    } catch (error) {
      console.error("Error importing data:", error);
      alert("Failed to import data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter entries based on search query
  const filteredEntries = entries.filter((entry) =>
    Object.values(entry)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body style={{ textAlign: 'center' }}>
          <h1 style={styles.headerTitle}>Work Study Position Tracker</h1>
          <p className="text-muted mb-0">Manage and track work study positions across departments</p>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={styles.statsCard}>
            <Card.Body>
              <h6 className="text-muted mb-2">Total Entries</h6>
              <h2>{stats.totalEntries}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.statsCard}>
            <Card.Body>
              <h6 className="text-muted mb-2">Active Students</h6>
              <h2>{stats.activeStudents}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.statsCard}>
            <Card.Body>
              <h6 className="text-muted mb-2">Departments</h6>
              <h2>{stats.departments}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Actions Section */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <div style={styles.searchBar}>
                <FaSearch style={styles.searchIcon} />
                <Form.Control
                  type="text"
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "2.5rem", height: "45px", borderRadius: "8px" }}
                />
              </div>
            </Col>
            <Col md={6} className="d-flex justify-content-end gap-2">
              {/* Import CSV Button */}
              <CSVReader
                onFileLoaded={handleImport}
                parserOptions={{ header: false }}
                inputId="csv-upload"
                inputStyle={{ display: "none" }}
              />
              <label
                htmlFor="csv-upload"
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#6366f1",
                  color: "white",
                  margin: 0,
                }}
                className="btn"
              >
                <FaUpload /> Import
              </label>

              {/* Export CSV Button */}
              <Button
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#22c55e",
                  borderColor: "transparent",
                }}
              >
                <FaFileExport />
                <CSVLink
                  data={entries}
                  filename="ws_tracker.csv"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Export
                </CSVLink>
              </Button>

              {/* Add New Entry Button */}
              <Button
                variant="primary"
                onClick={() => handleShowModal()}
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#f45d26",
                  borderColor: "transparent",
                }}
              >
                <FaPlus /> Add Entry
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Data Table */}
      <Card style={styles.table}>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead style={styles.tableHeader}>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Grad Year</th>
                <th>Status</th>
                <th>Role</th>
                <th>Manager</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">Loading...</td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">No entries found</td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => (
                  <tr key={index} className="align-middle">
                    <td>{entry.student_id}</td>
                    <td>{entry.full_name}</td>
                    <td>{entry.minerva_email}</td>
                    <td>{entry.expected_grad_year}</td>
                    <td>
                      <Badge bg={entry.ws_eligible ? "success" : "secondary"}>
                        {entry.ws_eligible ? "Eligible" : "Not Eligible"}
                      </Badge>
                    </td>
                    <td>{entry.role}</td>
                    <td>{entry.manager_name}</td>
                    <td>{entry.department_name}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleShowModal(entry, entry.id)}
                          disabled={loading}
                        >
                          <FaPen className="text-primary" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          disabled={loading}
                        >
                          <FaTrash className="text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton style={styles.modalHeader}>
          <Modal.Title>{isEditing ? "Edit Entry" : "Add New Entry"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row>
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
              <Col md={field === "notes" ? 12 : 6} key={field}>
                <Form.Group className="mb-3">
                <Form.Label className="text-capitalize">
                    {field.replace(/_/g, " ")}
                  </Form.Label>
                  {field === "ws_eligible" ? (
                    <Form.Check
                      type="switch"
                      name={field}
                      checked={!!formData[field]}
                      onChange={handleChange}
                      label={formData[field] ? "Eligible" : "Not Eligible"}
                    />
                  ) : field === "notes" ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      name={field}
                      value={formData[field] || ""}
                      onChange={handleChange}
                      placeholder={`Enter ${field.replace(/_/g, " ")}`}
                    />
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseModal}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            style={{ backgroundColor: "#f45d26", borderColor: "#f45d26" }}
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Entry"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WSPositionTracker;