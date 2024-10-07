import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormControl, FormCheck, FormLabel, FormSelect } from 'react-bootstrap';
import JobDescriptionPage from './JobDescriptionPage'; // Component for displaying job details
import { useParams } from 'react-router';

/**
 * Component for editing an existing job posting.
 * It allows users to modify job details and submit the changes.
 */
function EditJobPage() {
    // State for holding job data and control for displaying job description
    const [jobData, setJobData] = useState({ hiring_semesters: [] });
    const [showJobDescription, setShowJobDescription] = useState(false);
    // Extract jobId from URL parameters
    const { jobId } = useParams();

    /**
     * Fetches job data based on jobId and updates the state.
     * @param {string} jobId - ID of the job to be fetched.
     */
    const fetchJobById = (jobId) => {
        fetch(`http://localhost:8080/jobs/${jobId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            // Convert the comma-separated string to an array
            const hiringSemesters = data.hiring_semesters.split(',');
            setJobData({ ...data, hiring_semesters: hiringSemesters });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    /**
     * Handles form submission for updating job details.
     * @param {Event} event - The form submission event.
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};

        // Process form data into a structured object
        formData.forEach((value, key) => {
            if (key === 'hiringSemester') {
                // Append hiring semesters as an array
                data[key] = (data[key] || []).concat([value]);
            } else {
                data[key] = value;
            }
        });

        const jsonData = JSON.stringify(data);

        // PUT request to update job data
        fetch(`http://localhost:8080/jobs/${jobId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData
        })
        .then(response => response.json())
        .then(data => {
            // Update job data in state and show job description
            const hiringSemesters = data.hiring_semesters.split(',');
            setJobData({ ...data, hiring_semesters: hiringSemesters });
            setShowJobDescription(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    // Fetch job data on component mount or jobId change
    useEffect(() => {
        fetchJobById(jobId);
    }, [jobId]);

    /**
     * Handles changes in hiring semesters checkboxes.
     * @param {Event} e - The checkbox change event.
     */
    const handleCheckboxChange = (e) => {
        if (e.target.checked) {
            // Add the checked semester to the array
            setJobData({ ...jobData, hiring_semesters: [...jobData.hiring_semesters, e.target.value] });
        } else {
            // Remove the unchecked semester from the array
            setJobData({ ...jobData, hiring_semesters: jobData.hiring_semesters.filter(semester => semester !== e.target.value) });
        }
    };

    return (
        <Container className="my-5">
            {!showJobDescription ? ( 
                <Form onSubmit={handleSubmit}>
                        {/* <FormLabel className="text-center mb-4" as="legend">Post a Work-Study Position</FormLabel> */}
                        <h1 class="header-spacing">Post a Work-Study Position</h1>
                        <FormGroup controlId="positionTitle" className="mb-3">
                            <FormLabel>Position Title*</FormLabel>
                            <FormControl defaultValue={jobData.title} type="text" name="positionTitle" id="positionTitle" placeholder="Enter Position Title" required />
                        </FormGroup>

                        <FormGroup controlId="department" className="mb-3">
                            <FormLabel>Department*</FormLabel>
                            <FormSelect defaultValue={jobData.department} name="department" id="department" required>
                                <option value="Other">Other</option> 
                                <option value="Admission">Admission</option>
                                <option value="Academics">Academics</option>
                                <option value="Student Services">Student Services</option>
                                <option value="Psych Lab">Psych Lab</option>
                                <option value="AI Lab">AI Lab</option>
                                <option value="Finance">Finance</option>
                                <option value="Ops">Ops</option>
                                <option value="Student Life">Student Life</option>
                                <option value="Admin">Admin</option>
                                <option value="CTD">CTD</option>
                                <option value="Advancement">Advancement</option>
                                <option value="Enrollment">Enrollment</option>
                                <option value="External relations">External relations</option>   
                            </FormSelect>
                        </FormGroup>

                        <FormGroup controlId="managerName" className="mb-3">
                            <FormLabel>Manager Name*</FormLabel>
                            <FormControl defaultValue={jobData.manager_name}
                                type="text"
                                name="managerName"
                                id="managerName"
                                placeholder="Enter Manager Name"
                                required />
                        </FormGroup>

                        <FormGroup controlId="managerEmail" className="mb-3">
                            <FormLabel>Manager Email*</FormLabel>
                            <FormControl defaultValue={jobData.manager_email}
                            type="email"
                            name="managerEmail"
                            id="managerEmail"
                            placeholder="Enter Manager Email"
                            required />
                        </FormGroup>


                        <FormGroup  className="mb-3">
                            <FormLabel>Hiring Semesters*</FormLabel>
                            <FormCheck
                            onClick={handleCheckboxChange}
                            checked={jobData.hiring_semesters.includes("Fall Semester")} type="checkbox" label="Fall Semester" name="hiringSemester" value="Fall Semester" />
                            <FormCheck onClick={handleCheckboxChange} checked={jobData.hiring_semesters.includes("Spring Semester")} type="checkbox" label="Spring Semester" name="hiringSemester" value="Spring Semester" />
                            <FormCheck onClick={handleCheckboxChange} checked={jobData.hiring_semesters.includes("Summer Semester")} type="checkbox" label="Summer Semester" name="hiringSemester" value="Summer Semester" />
                        </FormGroup>

                        <Row>
                            <Col>
                                <FormGroup controlId="minStudents" className="mb-3">
                                    <FormLabel>Min # of Students*</FormLabel>
                                    <FormControl defaultValue={jobData.min_students}                         
                                    type="number"
                                    name="minStudents"
                                    id="minStudents"
                                    placeholder="Enter Minimum Number of Students"
                                    required />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup controlId="maxStudents" className="mb-3">
                                    <FormLabel>Max # of Students*</FormLabel>
                                    <FormControl defaultValue={jobData.max_students}
                                    type="number"
                                    name="maxStudents"
                                    id="maxStudents"
                                    placeholder="Enter Maximum Number of Students"
                                    required />
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup controlId="roleLocation" className="mb-3">
                            <FormLabel>Role Location*</FormLabel>
                            <FormSelect defaultValue={jobData.role_location} name="roleLocation" id="roleLocation" required>
                                <option value="Virtual">Virtual</option>
                                <option value="San Francisco">San Francisco</option>
                                <option value="Seoul">Seoul</option>
                                <option value="Taipei">Taipei</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Buenos Aires">Buenos Aires</option>
                                <option value="London">London</option>
                                <option value="Berlin">Berlin</option>
                            </FormSelect>
                        </FormGroup>

                        <FormGroup controlId="typeOfWork" className="mb-3">
                            <FormLabel>Type of Work*</FormLabel>
                            <FormSelect defaultValue={jobData.type_of_work} name="typeOfWork" id="typeOfWork" required>
                                <option value="Other">Other</option>
                                <option value="Researching">Researching</option>
                                <option value="Crafting communications">Crafting communications</option>
                                <option value="Planning">Planning</option>
                                <option value="Analysing">Analysing</option>
                                <option value="Critiquing">Critiquing</option>
                                <option value="Teaching">Teaching</option>
                            </FormSelect>
                        </FormGroup>

                        <FormGroup controlId="prerequisites" className="mb-3">
                            <FormLabel>Prerequisites</FormLabel>
                            <FormControl defaultValue={jobData.prerequisites}
                                type="text"
                                name="prerequisites"
                                id="prerequisites"
                                placeholder="Enter any Prerequisites" />
                        </FormGroup>

                        <FormGroup controlId="briefDescription" className="mb-3">
                            <FormLabel>Brief Job Description*</FormLabel>
                            <FormControl defaultValue={jobData.brief_description} as="textarea" rows={2} name="briefDescription" id="briefDescription" placeholder="Enter 2 sentence job description" required />
                        </FormGroup>

                        <FormGroup controlId="moreDetails" className="mb-3">
                            <FormLabel>More Details</FormLabel>
                            <FormControl defaultValue={jobData.more_details} as="textarea" rows={4} name="moreDetails" id="moreDetails" placeholder="Enter more details about the position" />
                        </FormGroup>

                        <FormGroup controlId="applicationDeadline" className="mb-5">
                            <FormLabel>Application Deadline*</FormLabel>
                            <FormControl defaultValue={jobData.application_deadline}
                                type="text"
                                name="applicationDeadline"
                                id="applicationDeadline"
                                placeholder="Format: 06 September 2024"
                                required />
                        </FormGroup>

                        <div className="text-center mt-4"></div>
                        <Button variant="outline-secondary" type="reset" className="me-2">Reset</Button>
                        <Button variant="outline-primary" type="submit" style={{backgroundColor: '#f45d26', borderColor: '#f45d26', color: 'white'}}>Submit</Button>
                </Form>
            ) : (
                <JobDescriptionPage jobData={jobData} />
            )}
        </Container>
    );
}

export default EditJobPage;
