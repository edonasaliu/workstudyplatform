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

  const filteredTeams = teams.filter((team) =>
    Object.values(team).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleFileUpload = (data) => {
    const importedTeams = data.map((row) => ({
      name: row["Team Name"],
      manager: row["Manager"],
      email: row["Email"],
      maxStudents: row["Max Students"],
      contact: row["Contact"],
      priority: row["Priority"],
      recruitingFor: row["Recruiting For"],
    }));
    setTeams([...teams, ...importedTeams]);
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
            style={{
              height: "40px",
            }}
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
              padding: "1px 20px",
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
            onClick={() => setShowAddModal(true)}
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
                <Button
                  variant="light"
                  className="me-2"
                  onClick={() => handleOpenEditModal(team, index)}
                >
                  <FaPen />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteTeam(index)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding a new team */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Team</Modal.Title>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddTeam}
            style={{ backgroundColor: "#f45d26", borderColor: "transparent" }}
          >
            Add Team
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeamsOverview;
