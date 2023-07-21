import React from 'react';
import DashboardCard from '../components/dashboardcard';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        <DashboardCard title="Total Invoices" value="10" />
        <DashboardCard title="Total Clients" value="5" />
        <DashboardCard title="Revenue" value="$5000" />
      </div>
    </div>
  );
};

export default Dashboard;
