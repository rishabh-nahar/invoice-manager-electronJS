import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo/text.png' 

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} width="100%" />
      </div>
      <ul className="sidebar-nav">
        <li>
          <Link to="/dashboard">
            Dashboard
            <i className="fa fa-home"></i>
          </Link>
        </li>
        <li>
          <Link to="/invoice">
            Invoice
            <i className="fa fa-file-text"></i>
          </Link>
        </li>
        <li>
          <Link to="/clients">
            Clients
            <i className="fa fa-users"></i>
          </Link>
        </li>
        <li>
          <Link to="/others">
            Others
            <i className="fa fa-cogs"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
