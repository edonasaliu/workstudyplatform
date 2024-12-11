import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Card,
  Badge
} from "react-bootstrap";
import CSVReader from "react-csv-reader";
import { FaTrash, FaPen, FaFileExport, FaUpload, FaSearch, FaPlus } from "react-icons/fa";

// API configuration
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Custom styles
const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "2rem",
  },
  header: {
    backgroundColor: "#f8f2f0", 
    borderRadius: "10px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    textAlign: "center", 
  },
  headerTitle: {
    color: "#2c3e50",
    fontSize: "2.5rem",
    fontWeight: "600",
    marginBottom: "0.5rem", 
  },
  headerSubtitle: {
    color: "#666",
    fontSize: "1.1rem",
    margin: 0,
  },
  card: {
    borderRadius: "8px",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    marginBottom: "1.5rem",
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
};

/**
 * Teams Overview Component
 * 
 * A comprehensive dashboard for managing teams at Minerva University.
 * Provides functionality for viewing, adding, editing, and deleting teams,
 * as well as importing/exporting data via CSV.
 */
const TeamsOverview = () => {
  // State declarations
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state with default values
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    email: "",
    maxStudents: "",
    contact: "",
    priority: "",
    recruitingFor: "",
  });

  // Stats state
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalManagers: 0,
    totalPositions: 0,
  });

  /**
   * Fetches teams data from the backend
   */
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/teams`);
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
          updateStats(data);
        } else {
          console.error("Failed to fetch teams:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  /**
   * Updates statistics based on teams data
   */
  const updateStats = (teamsData) => {
    const uniqueManagers = new Set(teamsData.map(team => team.manager)).size;
    const totalPositions = teamsData.reduce((sum, team) => sum + parseInt(team.maxStudents || 0), 0);
    
    setStats({
      totalTeams: teamsData.length,
      totalManagers: uniqueManagers,
      totalPositions: totalPositions,
    });
  };

  /**
   * Handles form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission for both adding and editing teams
   */
  const handleSubmit = async () => {
    if (!formData.name || !formData.manager || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${BASE_URL}/teams/${editIndex}`
        : `${BASE_URL}/teams`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      setTeams(prev => {
        const newTeams = isEditing
          ? prev.map(team => (team.id === editIndex ? data : team))
          : [...prev, data];
        updateStats(newTeams);
        return newTeams;
      });

      handleCloseModal();
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles team deletion
   */
  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/teams/${id}`, { 
        method: "DELETE",
        credentials: "include"
      });
      
      if (!response.ok) throw new Error("Failed to delete team");
      
      setTeams(prev => {
        const newTeams = prev.filter(team => team.id !== id);
        updateStats(newTeams);
        return newTeams;
      });
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens modal for adding/editing teams
   */
  const handleOpenModal = (team = null) => {
    if (team) {
      setFormData(team);
      setIsEditing(true);
      setEditIndex(team.id);
    } else {
      setFormData({
        name: "",
        manager: "",
        email: "",
        maxStudents: "",
        contact: "",
        priority: "",
        recruitingFor: "",
      });
      setIsEditing(false);
      setEditIndex(null);
    }
    setShowModal(true);
  };

  /**
   * Closes modal and resets form state
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      manager: "",
      email: "",
      maxStudents: "",
      contact: "",
      priority: "",
      recruitingFor: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  /**
   * Handles CSV file import
   */
  const handleFileUpload = async (data) => {
    setLoading(true);
    try {
      const importedTeams = data.map(row => ({
        name: row["Team Name"],
        manager: row["Manager"],
        email: row["Email"],
        maxStudents: row["Max Students"],
        contact: row["Contact"],
        priority: row["Priority"],
        recruitingFor: row["Recruiting For"],
      }));

      for (const team of importedTeams) {
        const response = await fetch(`${BASE_URL}/teams`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(team),
        });

        if (response.ok) {
          const data = await response.json();
          setTeams(prev => {
            const newTeams = [...prev, data];
            updateStats(newTeams);
            return newTeams;
          });
        }
      }
      alert("Teams imported successfully!");
    } catch (error) {
      console.error("Error importing teams:", error);
      alert("Failed to import teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles CSV export
   */
  const handleExport = () => {
    const csvData = teams.map(team => ({
      "Team Name": team.name,
      "Manager": team.manager,
      "Email": team.email,
      "Max Students": team.maxStudents,
      "Contact": team.contact,
      "Priority": team.priority,
      "Recruiting For": team.recruitingFor,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(csvData[0]).join(","),
        ...csvData.map(row => Object.values(row).join(","))
      ].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "teams.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    Object.values(team)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <Card style={styles.header}>
        <Card.Body>
          <h1 style={styles.headerTitle}>Teams Overview</h1>
          <p className="text-muted mb-0">Manage and track teams across departments</p>
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <h6 className="text-muted mb-2">Total Teams</h6>
              <h2>{stats.totalTeams}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <h6 className="text-muted mb-2">Total Managers</h6>
              <h2>{stats.totalManagers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <h6 className="text-muted mb-2">Total Positions</h6>
              <h2>{stats.totalPositions}</h2>
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
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "2.5rem", height: "45px", borderRadius: "8px" }}
                />
              </div>
            </Col>
            <Col md={6} className="d-flex justify-content-end gap-2">
              {/* Import CSV Button */}
              <CSVReader
                onFileLoaded={handleFileUpload}
                parserOptions={{ header: true }}
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
                onClick={handleExport}
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#22c55e",
                  borderColor: "transparent",
                }}
                disabled={loading}
              >
                <FaFileExport /> Export
              </Button>

              {/* Add New Team Button */}
              <Button
                variant="primary"
                onClick={() => handleOpenModal()}
                style={{
                  ...styles.actionButton,
                  backgroundColor: "#f45d26",
                  borderColor: "transparent",
                }}
                disabled={loading}
              >
                <FaPlus /> Add Team
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Teams Table */}
      <Card style={styles.table}>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr>
                <th>Team Name</th>
                <th>Manager</th>
                <th>Email</th>
                <th>Max Students</th>
                <th>Contact</th>
                <th>Priority</th>
                <th>Recruiting For</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">Loading...</td>
                </tr>
              ) : filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">No teams found</td>
                </tr>
              ) : (
                filteredTeams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.manager}</td>
                    <td>{team.email}</td>
                    <td>
                      <Badge bg="info">{team.maxStudents}</Badge>
                    </td>
                    <td>{team.contact}</td>
                    <td>
                      <Badge bg={team.priority === "High" ? "danger" : team.priority === "Medium" ? "warning" : "success"}>
                        {team.priority}
                      </Badge>
                    </td>
                    <td>{team.recruitingFor}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleOpenModal(team)}
                          disabled={loading}
                        >
                          <FaPen className="text-primary" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id)}
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
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Team" : "Add New Team"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Team Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter team name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="manager">
                  <Form.Label>Manager <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="Enter manager name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="maxStudents">
                  <Form.Label>Max Students</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    placeholder="Enter maximum number of students"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="contact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Enter contact information"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="">Select priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="recruitingFor">
              <Form.Label>Recruiting For</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="recruitingFor"
                value={formData.recruitingFor}
                onChange={handleChange}
                placeholder="Enter recruiting details"
              />
            </Form.Group>
          </Form>
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
            disabled={loading}
            style={{
              backgroundColor: "#f45d26",
              borderColor: "#f45d26"
            }}
          >
            {loading ? (
              "Saving..."
            ) : (
              isEditing ? "Save Changes" : "Add Team"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeamsOverview;
                      