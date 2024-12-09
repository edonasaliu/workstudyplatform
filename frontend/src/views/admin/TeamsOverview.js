import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { FaPen, FaTrash, FaUpload, FaFileCsv, FaPlus } from "react-icons/fa";
import { CSVLink } from "react-csv";
import CSVReader from "react-csv-reader";

const TeamsOverview = () => {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem("teams");
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    manager: "",
    email: "",
    maxStudents: "",
    contact: "",
    priority: "",
    recruitingFor: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Save teams to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const handleChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleAddTeam = () => {
    setTeams([...teams, newTeam]);
    setNewTeam({
      name: "",
      manager: "",
      email: "",
      maxStudents: "",
      contact: "",
      priority: "",
      recruitingFor: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteTeam = (index) => {
    const updatedTeams = teams.filter((_, i) => i !== index);
    setTeams(updatedTeams);
  };

  const handleEditTeam = () => {
    const updatedTeams = [...teams];
    updatedTeams[editIndex] = newTeam;
    setTeams(updatedTeams);
    setNewTeam({
      name: "",
      manager: "",
      email: "",
      maxStudents: "",
      contact: "",
      priority: "",
      recruitingFor: "",
    });
    setShowEditModal(false);
    setEditIndex(null);
  };

  const handleOpenEditModal = (team, index) => {
    setNewTeam(team);
    setEditIndex(index);
    setShowEditModal(true);
  };

  const handleImport = (data) => {
    const formattedData = data.map((row) => ({
      name: row[0],
      manager: row[1],
      email: row[2],
      maxStudents: row[3],
      contact: row[4],
      priority: row[5],
      recruitingFor: row[6],
    }));
    setTeams([...teams, ...formattedData]);
  };

  const filteredTeams = teams.filter((team) =>
    Object.values(team).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "#f9f9f9" }}>
      {/* Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="text-center mb-0">Teams Overview</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Import Button */}
          <CSVReader
            onFileLoaded={handleImport}
            parserOptions={{ header: false }}
            inputStyle={{
              width: "auto",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            label={
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <FaUpload /> Import CSV
              </span>
            }
          />

          {/* Export Button */}
          <Button variant="success" style={{ display: "flex", alignItems: "center" }}>
            <FaFileCsv style={{ marginRight: "5px" }} />
            <CSVLink data={teams} filename="teams_data.csv" style={{ textDecoration: "none", color: "white" }}>
              Export CSV
            </CSVLink>
          </Button>

          {/* Add Team Button */}
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: "flex", alignItems: "center", backgroundColor: "#f45d26", borderColor: "transparent" }}
          >
            <FaPlus style={{ marginRight: "5px" }} /> Add Team
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by Team Name, Manager, or Recruiting Area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      {/* Table */}
      <Table striped bordered hover responsive>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
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
          {filteredTeams.map((team, index) => (
            <tr key={index}>
              <td>{team.name}</td>
              <td>{team.manager}</td>
              <td>{team.email}</td>
              <td>{team.maxStudents}</td>
              <td>{team.contact}</td>
              <td>{team.priority}</td>
              <td>{team.recruitingFor}</td>
              <td>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  {/* Edit Button */}
                  <FaPen
                    style={{ cursor: "pointer", color: "#007bff" }}
                    onClick={() => handleOpenEditModal(team, index)}
                  />

                  {/* Delete Button */}
                  <FaTrash
                    style={{ cursor: "pointer", color: "#dc3545" }}
                    onClick={() => handleDeleteTeam(index)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Add Form Fields */}
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="teamName">
                  <Form.Label>Team Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newTeam.name}
                    onChange={handleChange}
                    placeholder="Enter team name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="managerName">
                  <Form.Label>Manager</Form.Label>
                  <Form.Control
                    type="text"
                    name="manager"
                    value={newTeam.manager}
                    onChange={handleChange}
                    placeholder="Enter manager's name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Other Fields */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTeam} style={{ backgroundColor: "#f45d26", borderColor: "transparent" }}>
            Add Team
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Reuse Add Modal Form */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditTeam} style={{ backgroundColor: "#f45d26", borderColor: "transparent" }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeamsOverview;