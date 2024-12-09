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
} from "react-bootstrap";
import CSVReader from "react-csv-reader";
import { FaTrash, FaPen, FaFileExport, FaUpload } from "react-icons/fa";

const BASE_URL = "http://localhost:8080";

const TeamsOverview = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    manager: "",
    email: "",
    maxStudents: "",
    contact: "",
    priority: "",
    recruitingFor: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch teams from the backend
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:8080/teams");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched teams:", data);
          setTeams(data);
        } else {
          console.error("Failed to fetch teams:", response.statusText);
        
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.manager || !formData.email || !formData.priority) {
        alert("Please fill in all required fields.");
        return;
      }
  
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${BASE_URL}/teams/${editIndex}`
        : `${BASE_URL}/teams`;
  
      const token = localStorage.getItem("authToken"); // Replace with your token retrieval method
      console.log("Token being sent:", token); // Debug token
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session authentication
        body: JSON.stringify(formData),
      });
      
  
      if (!response.ok) {
        console.error("Response status:", response.status); // Debug response status
        throw new Error(`API responded with status: ${response.status}`);
      }
  
      const data = await response.json();
  
      setTeams((prev) =>
        isEditing
          ? prev.map((team) => (team.id === editIndex ? data : team))
          : [...prev, data]
      );
  
      setFormData({
        name: "",
        manager: "",
        email: "",
        maxStudents: "",
        contact: "",
        priority: "",
        recruitingFor: "",
      });
  
      setShowModal(false);
      setIsEditing(false);
      setEditIndex(null);
    } catch (error) {
      console.error("Error saving team:", error);
      alert("Failed to save team. Please try again.");
    }
  };
  
  

  const handleDeleteTeam = async (id) => {
    try {
      const response = await fetch(`/teams/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete team");
      setTeams((prev) => prev.filter((team) => team.id !== id));
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleOpenModal = (team = null) => {
    if (team) {
      setFormData(team); // Populate the form with the selected team's data
      setIsEditing(true); // Set editing mode
      setEditIndex(team.id); // Set the team's id as the edit index
    } else {
      // Reset the form for adding a new team
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
    setShowModal(true); // Show the modal
  };
  

  const filteredTeams = teams.filter((team) =>
    Object.values(team).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleFileUpload = (data) => {
    // Map CSV data to match backend structure
    const importedTeams = data.map((row) => ({
      name: row["Team Name"],
      manager: row["Manager"],
      email: row["Email"],
      maxStudents: row["Max Students"],
      contact: row["Contact"],
      priority: row["Priority"],
      recruitingFor: row["Recruiting For"],
    }));

    // Save to the backend
    importedTeams.forEach(async (team) => {
      try {
        const response = await fetch("/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(team),
        });
        if (response.ok) {
          const data = await response.json();
          setTeams((prev) => [...prev, data]);
        }
      } catch (error) {
        console.error("Error importing team:", error);
      }
    });
  };

  const handleExport = () => {
    const csvData = teams.map((team) => ({
      "Team Name": team.name,
      Manager: team.manager,
      Email: team.email,
      "Max Students": team.maxStudents,
      Contact: team.contact,
      Priority: team.priority,
      "Recruiting For": team.recruitingFor,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [Object.keys(csvData[0]).join(","), ...csvData.map((row) => Object.values(row).join(","))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "teams.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container fluid className="my-5" style={{ maxWidth: "95%" }}>
      <h2 className="text-center mb-4">Teams Overview</h2>
      <div className="d-flex align-items-center mb-4" style={{ gap: "20px" }}>
        <InputGroup style={{ flex: 1 }}>
          <Form.Control
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ height: "40px" }}
          />
        </InputGroup>
        <div className="d-flex" style={{ gap: "10px" }}>
          <CSVReader
            onFileLoaded={handleFileUpload}
            parserOptions={{ header: true }}
            inputId="csv-upload"
            inputStyle={{ display: "none" }}
          />
          <label
            htmlFor="csv-upload"
            style={{
              backgroundColor: "#17a2b8",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              height: "40px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaUpload /> Import CSV
          </label>
          <Button
            variant="info"
            onClick={handleExport}
            style={{
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              height: "40px",
              display: "flex",
              borderRadius: "10px",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaFileExport /> Export CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            style={{
              backgroundColor: "#f45d26",
              borderColor: "transparent",
              height: "40px",
              display: "flex",
              borderRadius: "10px",
              alignItems: "center",
            }}
          >
            Add New Team
          </Button>
        </div>
      </div>
      <Table striped bordered hover responsive className="table-sm">
        <thead className="thead-dark">
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
          {filteredTeams.map((team) => (
            <tr key={team.id}>
              <td>{team.name}</td>
              <td>{team.manager}</td>
              <td>{team.email}</td>
              <td>{team.maxStudents}</td>
              <td>{team.contact}</td>
              <td>{team.priority}</td>
              <td>{team.recruitingFor}</td>
              <td>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <FaPen
                    style={{
                      color: "#007bff",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                    onClick={() => handleOpenModal(team)}
                  />
                  <FaTrash
                    style={{
                      color: "#dc3545",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                    onClick={() => handleDeleteTeam(team.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Team" : "Add New Team"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="teamName">
                  <Form.Label>Team Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter team name"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="managerName">
                  <Form.Label>Manager</Form.Label>
                  <Form.Control
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="Enter manager's name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="maxStudents">
                  <Form.Label>Max Students</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    placeholder="Enter max students"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="contact">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter contact info"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                type="text"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                placeholder="Enter priority"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="recruitingFor">
              <Form.Label>Recruiting For</Form.Label>
              <Form.Control
                type="text"
                name="recruitingFor"
                value={formData.recruitingFor}
                onChange={handleChange}
                placeholder="Enter recruiting area"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#f45d26",
              borderColor: "transparent",
            }}
          >
            {isEditing ? "Save Changes" : "Add Team"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeamsOverview;
