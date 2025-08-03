import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  let links = [];
  
  // Add dashboard link for all authenticated users
  links.push({ to: '/dashboard', label: 'Dashboard' });
  
  // Add role-specific links
  if (role === 'client') {
    links.push(
      { to: '/client', label: 'Client Dashboard' }
    );
  } else if (role === 'freelancer') {
    links.push(
      { to: '/freelancer', label: 'Freelancer Dashboard' },
      { to: '/freelancer/awarded', label: 'My Awarded Jobs' }
    );
  } else if (role === 'admin') {
    links.push(
      { to: '/admin', label: 'Admin Panel' },
      { to: '/client', label: 'Client Features' },
      { to: '/freelancer', label: 'Freelancer Features' }
    );
  }
  
  // Add common links
  links.push(
    { to: '/', label: 'Home' },
    { to: '/profile', label: 'Profile' }
  );
  
  const location = useLocation();
  return (
    <aside className="sidebar">
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={location.pathname === link.to ? 'active' : ''}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;