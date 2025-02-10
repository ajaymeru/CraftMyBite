import React from 'react';
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} CraftMyBite. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
