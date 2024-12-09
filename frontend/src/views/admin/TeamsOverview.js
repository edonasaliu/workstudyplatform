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

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTeam = () => {
    if (isEditing) {
      const updatedTeams = [...teams];
      updatedTeams[editIndex] = formData;
      setTeams(updatedTeams);
    } else {
      setTeams([...teams, formData]);
    }
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
  };

  const handleDeleteTeam = (index) => {
    const updatedTeams = teams.filter((_, i) => i !== index);
    setTeams(updatedTeams);
  };

  const handleOpenModal = (team, index) => {
    if (team) {
      setFormData(team);
      setIsEditing(true);
      setEditIndex(index);
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
            onClick={() => handleOpenModal(null, null)}
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
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <FaPen
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                  onClick={() => handleOpenModal(team, index)}
                />
                <FaTrash
                  style={{
                    color: "#dc3545",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                  onClick={() => handleDeleteTeam(index)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      </Table>

      {/* Modal for adding or editing a team */}
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
                    value={formData.manager}
                    onChange={handleChange}
                    placeholder="Enter manager's name"
                    required
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
                    required
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
                    required
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="priority">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="recruitingFor">
              <Form.Label>Recruiting For</Form.Label>
              <Form.Control
                type="text"
                name="recruitingFor"
                value={formData.recruitingFor}
                onChange={handleChange}
                placeholder="Enter recruiting area"
                required
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
            onClick={handleAddTeam}
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
