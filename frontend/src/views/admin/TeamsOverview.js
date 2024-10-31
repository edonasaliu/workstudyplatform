// src/views/admin/TeamsOverview.js
import React, { useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';

const TeamsOverview = () => {
    const [teams, setTeams] = useState([
        {
            name: 'Admissions',
            manager: 'John Doe',
            email: 'johndoe@example.com',
            maxStudents: 10,
            contact: 'jane.doe@admissions.minerva.edu',
            priority: 'First',
            recruitingFor: 'Admission/Enrollment'
        },
    ]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTeam, setNewTeam] = useState({
        name: '',
        manager: '',
        email: '',
        maxStudents: '',
        contact: '',
        priority: '',
        recruitingFor: ''
    });

    // Function to handle input changes for the form
    const handleChange = (e) => {
        setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
    };

    // Function to add a new team
    const handleAddTeam = () => {
        setTeams([...teams, newTeam]);
        setNewTeam({
            name: '',
            manager: '',
            email: '',
            maxStudents: '',
            contact: '',
            priority: '',
            recruitingFor: ''
        });
        setShowAddModal(false);
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Teams Overview</h2>
            <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)} 
                className="mb-4"
                style={{ backgroundColor: '#f45d26', borderColor: 'transparent' }}
            >
                Add New Team
            </Button>
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
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key={index}>
                            <td>{team.name}</td>
                            <td>{team.manager}</td>
                            <td>{team.email}</td>
                            <td>{team.maxStudents}</td>
                            <td>{team.contact}</td>
                            <td>{team.priority}</td>
                            <td>{team.recruitingFor}</td>
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

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="email">
                                    <Form.Label>Manager's Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={newTeam.email}
                                        onChange={handleChange}
                                        placeholder="Enter manager's email"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="maxStudents">
                                    <Form.Label>Max Students</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="number"
                                            name="maxStudents"
                                            value={newTeam.maxStudents}
                                            onChange={handleChange}
                                            placeholder="0"
                                            required
                                        />
                                        <InputGroup.Text>students</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="contact" className="mb-3">
                            <Form.Label>Contact Person</Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                value={newTeam.contact}
                                onChange={handleChange}
                                placeholder="Enter contact person"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="priority" className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                name="priority"
                                value={newTeam.priority}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select priority</option>
                                <option value="First">First</option>
                                <option value="Second">Second</option>
                                <option value="Third">Third</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="recruitingFor" className="mb-3">
                            <Form.Label>Recruiting For</Form.Label>
                            <Form.Select
                                name="recruitingFor"
                                value={newTeam.recruitingFor}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select area</option>
                                <option value="Admission">Admission</option>
                                <option value="Enrollment">Enrollment</option>
                                <option value="Bursar">Bursar</option>
                                <option value="Financial Aid">Financial Aid</option>
                                <option value="Payroll">Payroll</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddTeam}
                        style={{ backgroundColor: '#f45d26', borderColor: 'transparent' }}
                    >
                        Add Team
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default TeamsOverview;
