import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

/**
 * Home Page Component
 * Landing page featuring Minerva background video and welcome message
 * 
 * @component
 * @returns {JSX.Element}
 */
const HomePage = () => {
    const navigate = useNavigate();

    // Minerva video configuration
    const videoId = 'Za-reDqXnco';
    const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=0&modestbranding=1`;

    // Custom styles for page elements
    const styles = {
        videoContainer: {
            position: 'relative',
            overflow: 'hidden',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000', // Fallback color while video loads
        },
        videoFrame: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '177.77777778vh', // 16:9 aspect ratio
            height: '100vh',
            minWidth: '100vw',
            minHeight: '56.25vw', // 16:9 aspect ratio
            pointerEvents: 'none', // Prevent video interaction
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        content: {
            position: 'relative',
            zIndex: 2,
            padding: '2rem',
            textAlign: 'center',
            color: 'white',
            maxWidth: '800px',
            margin: '0 auto',
        },
        title: {
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        },
        subtitle: {
            fontSize: '1.5rem',
            marginBottom: '2rem',
            fontWeight: '300',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        },
        button: {
            backgroundColor: '#f45d26',
            borderColor: 'transparent',
            padding: '0.8rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '50px',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(244, 93, 38, 0.3)',
            },
        },
    };

    return (
        // Main container for the landing page
        <div style={styles.videoContainer}>
            {/* Background Video */}
            <iframe
                src={youtubeEmbedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Minerva University Background"
                style={styles.videoFrame}
            />

            {/* Gradient Overlay */}
            <div style={styles.overlay}>
                {/* Content Container */}
                <Container style={styles.content}>
                    <Row className="justify-content-center">
                        <Col md={12}>
                            {/* Main Heading */}
                            <h1 style={styles.title}>
                                Welcome to Minerva's Work-Study Platform
                            </h1>
                            
                            {/* Subheading */}
                            <p style={styles.subtitle}>
                                Connect with opportunities that shape your future while contributing to our community
                            </p>
                            
                            {/* Call-to-Action Button */}
                            <Button
                                onClick={() => navigate('/login')}
                                style={styles.button}
                                className="shadow-lg"
                            >
                                Get Started <FaArrowRight />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default HomePage;