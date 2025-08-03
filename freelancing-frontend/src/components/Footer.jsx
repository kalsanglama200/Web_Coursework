// src/components/Footer.jsx
import React from 'react'
import './Footer.css'

const Footer = () => (
  <footer className="footer">
    <div className="container">
      &copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.
    </div>
  </footer>
)

export default Footer