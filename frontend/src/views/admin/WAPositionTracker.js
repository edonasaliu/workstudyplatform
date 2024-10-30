// src/views/admin/WAPositionTracker.js

import React, { useState } from 'react';
import { Container, Card, Form } from 'react-bootstrap'; // Removed 'Button' from the import
import * as XLSX from 'xlsx';


const WAPositionTracker = () => {
    const [studentData, setStudentData] = useState([]);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            setStudentData(data);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">WA Position Tracker</h1>
            <p className="text-muted text-center">
                Upload a CSV or Excel file with student information to view details here.
            </p>

            {/* File upload button */}
            <div className="text-center my-3">
                <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
            </div>

            {/* Display student information in a table */}
            {studentData.length > 0 && (
                <Table striped bordered hover responsive className="mt-4">
                    <thead>
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
                            <th>PaycomID</th>
                            <th>Contractor/M28</th>
                            <th>Notes</th>
                            <th>Merge Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData.map((student, index) => (
                            <tr key={index}>
                                <td>{student['Student ID']}</td>
                                <td>{student['Minerva Email']}</td>
                                <td>{student['Full Name']}</td>
                                <td>{student['Expected Grad Year']}</td>
                                <td>{student['WS Eligible or not']}</td>
                                <td>{student['Role']}</td>
                                <td>{student['Manager Name']}</td>
                                <td>{student['Paycom Manager']}</td>
                                <td>{student['Manager Email']}</td>
                                <td>{student['Department Name']}</td>
                                <td>{student['PaycomID']}</td>
                                <td>{student['contractor or M28 for N/As']}</td>
                                <td>{student['notes']}</td>
                                <td>{student['Merge status']}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default WAPositionTracker;
