import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClient = (clientId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (confirmDelete) {
      window.electronAPI.deleteClient(clientId);
      setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("Start");
        const allClients = await window.electronAPI.requestAllClients();
        setClients(allClients);
      } catch (error) {
        console.log(`Failed to fetch clients: ${error.message}`);
      }
    };

    fetchClients();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = clients.filter((client) => {
    const { clientName, gstNo, contact, email } = client;
    const lowerCaseClientName = clientName ? clientName.toLowerCase() : '';
    const lowerCaseGstNo = gstNo ? gstNo.toLowerCase() : '';
    const lowerCaseContact = contact ? contact.toLowerCase() : '';
    const lowerCaseEmail = email ? email.toLowerCase() : '';

    return (
      lowerCaseClientName.includes(searchTerm.toLowerCase()) ||
      lowerCaseGstNo.includes(searchTerm.toLowerCase()) ||
      lowerCaseContact.includes(searchTerm.toLowerCase()) ||
      lowerCaseEmail.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="client-list">
      <h2>Clients</h2>
      <br />

      <div className="upper-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Link to="/createclient">
          <button className="add-client-button">
              <i className='fa fa-add'></i>&nbsp;  Add New Client
          </button>
        </Link>
      </div>

      <table className="client-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Company Name</th>
            <th>GST Number</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td title={client.clientName}>{client.clientName}</td>
              <td title={client.companyName}>{client.companyName}</td>
              <td title={client.gstNo}>{client.gstNo}</td>
              <td title={client.contact}>{client.contact}</td>
              <td title={client.email}>{client.email}</td>
              <td title= {client.address +", " +client.address_line2} className='truncate-line'>{client.address},{client.address_line2}</td>
              <td >
                <div  className="client-actions">
                    <button onClick={() => handleDeleteClient(client.id)}><i className='fa fa-trash'></i></button>
                    <Link to={`/updateclient/${client.id}`}>
                      <button><i className='fa fa-pencil'></i></button>
                    </Link>
                    <Link to={`/createinvoice/${client.id}`}>
                      <button><i className='fa fa-add'></i></button>
                    </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
