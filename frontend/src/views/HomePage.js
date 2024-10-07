import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// HomePage component that acts as the landing page of the application
const HomePage = () => {
    const navigate = useNavigate();

    // YouTube video ID to be used as a background video
    const videoId = 'Za-reDqXnco'; 

    // Construct the YouTube embed URL with parameters to control playback
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&modestbranding=1`;

    return (
        // Container for the full-screen background video and content overlay
        <div style={{ position: 'relative', overflow: 'hidden', width: '100vw', height: '100vh' }}>
            {/* Background video iframe */}
            <iframe
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Background Video"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '177.77777778vh', // Width set to maintain 16:9 aspect ratio
                    height: '100vh', // Full height of the viewport
                    objectFit: 'cover' // Ensure the video covers the full container
                }}
            ></iframe>
            {/* Dark overlay to enhance text contrast over the video */}
            <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}></div>
            {/* Content container placed above the video and overlay */}
            <Container style={{ position: 'relative', zIndex: 1 }}>
                {/* Vertically and horizontally centered row for text and button */}
                <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    <Col md={12} className="text-center">
                        {/* Main heading */}
                        <h1 className="display-3 fw-bold text-white">Welcome to the Minerva Work-Study Platform</h1>
                        {/* Subheading */}
                        <p className="lead text-white">Are you ready to get started?</p>
                        {/* Call-to-action button */}
                        <Button
                            style={{ backgroundColor: '#f45d26', borderColor: '#f45d26', color: 'white' }}
                            className="mt-3"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default HomePage;
