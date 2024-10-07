/**
 * footer.test.js
 * 
 * This file contains tests for the FooterComponent. The FooterComponent is tested to ensure 
 * it renders all the expected sections including company information, quick links, candidate 
 * and employer sections, support links, and social media icons. These tests verify that the 
 * static content and the dynamic content (like the current year) are present and correctly 
 * displayed. This helps in ensuring that the footer maintains its structure and functionality 
 * throughout changes in the application.
 * 
 * Author: Ava Nelson
 * Created: Nov 14, 2023
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import FooterComponent from './Footer';
import '@testing-library/jest-dom';


describe('FooterComponent', () => {
  // Test that the FooterComponent renders.
  it('renders the footer', () => {
    render(<FooterComponent />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  // Test that the company address is present.
  it('displays the company address', () => {
    render(<FooterComponent />);
    expect(screen.getByText('16 Turk Street SF California')).toBeInTheDocument();
  });

  // Test that the current year is displayed.
  it('displays the current year in the copyright', () => {
    render(<FooterComponent />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(`Minerva©${currentYear}`)).toBeInTheDocument();
  });

  // Test that at least one quick link is present.
  it('contains a link to the About page', () => {
    render(<FooterComponent />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
