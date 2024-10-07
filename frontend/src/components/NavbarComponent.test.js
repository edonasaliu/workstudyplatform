/**
 * NavbarComponent.test.js
 * 
 * This test file contains tests for the NavbarComponent. It ensures that the NavbarComponent
 * renders correctly and includes the correct navigation links for the application. Since the
 * NavbarComponent uses NavLink components from react-router-dom for navigation, the tests
 * are wrapped within a Router to mimic the app's routing context. This setup allows for
 * the testing of navigation link presence and proper functioning within the component.
 * 
 * Author: Ava Nelson
 * Created: Nov 14, 2023
 * Last Modified: Nov 14, 2023
 */

import React from 'react'; // Import React for JSX support
import { render, screen } from '@testing-library/react'; // Import testing utilities
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router for wrapping the component
import NavbarComponent from './NavbarComponent'; // Import the NavbarComponent to be tested
import '@testing-library/jest-dom';

describe('NavbarComponent', () => {
  // Utility function to render the component within the Router context
  const renderNavbar = () =>
    render(
      <Router>
        <NavbarComponent />
      </Router>
    );

  // Test that the NavbarComponent renders without crashing
  it('renders the navbar', () => {
    renderNavbar();
    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument(); // Assert that the navbar is in the document
  });

  // Test that the Navbar contains a link to the Home page
  it('contains a link to the Home page', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument(); // Assert the Home link is present
  });

  // Test that the Navbar contains a link to the Find Job page
  it('contains a link to the Find Job page', () => {
    renderNavbar();
    expect(screen.getByText('Find Job')).toBeInTheDocument(); // Assert the Find Job link is present
  });

  // Test that the Navbar contains a link to the Employers page
  it('contains a link to the Employers page', () => {
    renderNavbar();
    expect(screen.getByText('Employers')).toBeInTheDocument(); // Assert the Employers link is present
  });

  // Test that the Navbar contains a link to the CTD Resources page
  it('contains a link to the CTD Resources page', () => {
    renderNavbar();
    expect(screen.getByText('CTD Resources')).toBeInTheDocument(); // Assert the CTD Resources link is present
  });
});
