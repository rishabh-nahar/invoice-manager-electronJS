const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const server_app = express();
const port = 8000;

// Connect to the SQLite database
const db = new sqlite3.Database('./apsaraplycentre', (error) => {
  if (error) {
    console.error('Failed to open database:', error);
  } else {
    console.log('Database opened successfully');    
  }
});

// Create a new client
function createClient(req, res) {
  console.log("Adding client");
  const { clientName, companyName, address, contact, email, gstNo } = req.body;

  const query = `INSERT INTO clients (clientName, companyName, address, contact, email, gstNo) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [clientName, companyName, address, contact, email, gstNo];

  db.run(query, values, function (error) {
    if (error) {
      res.status(500).json({ error: `Failed to create client: ${error.message}` });
    } else {
      res.status(201).json({ message: 'Client created successfully' });
    }
  });
}

// Get all clients
function getAllClients(req, res) {
  const query = 'SELECT * FROM clients';

  db.all(query, function (error, rows) {
    if (error) {
      console.log({error: `Failed to fetch clients: ${error}` });
      // res.status(500).json({ error: `Failed to fetch clients: ${error}` });
    } else {
      console.log({status:'succes',rows});
      // res.status(200).json(rows); 
      return (({status:'succes',rows}))
    }
  });
}

// Get a single client
function getClientById(req, res) {
  const clientId = req.params.id;

  const query = 'SELECT * FROM clients WHERE id = ?';
  const values = [clientId];

  db.get(query, values, function (error, row) {
    if (error) {
      console.log({ error: 'Failed to fetch client' });
      // res.status(500).json({ error: 'Failed to fetch client' });
    } else if (row) {
      console.log({status:'succes',row});
      // res.status(200).json(row);
    } else {
      console.log({ error: 'Client not found' });
      // res.status(404).json({ error: 'Client not found' });
    }
  });
}

// Update a client
function updateClient(req, res) {
  const clientId = req.params.id;
  const { clientName, companyName, address, contact, email, gstNo } = req.body;

  const query = `UPDATE clients SET clientName = ?, companyName = ?, address = ?, 
                 contact = ?, email = ?, gstNo = ? WHERE id = ?`;
  const values = [clientName, companyName, address, contact, email, gstNo, clientId];

  db.run(query, values, function (error) {
    if (error) {
      res.status(500).json({ error: 'Failed to update client' });
    } else if (this.changes > 0) {
      res.status(200).json({ message: 'Client updated successfully' });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
}

// Delete a client
function deleteClient(req, res) {
  const clientId = req.params.id;

  const query = 'DELETE FROM clients WHERE id = ?';
  const values = [clientId];

  db.run(query, values, function (error) {
    if (error) {
      res.status(500).json({ error: 'Failed to delete client' });
    } else if (this.changes > 0) {
      res.status(200).json({ message: 'Client deleted successfully' });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
}

// Set up routes
server_app.post('/clients', createClient);
server_app.get('/clients', getAllClients);
server_app.get('/clients/:id', getClientById);
server_app.put('/clients/:id', updateClient);
server_app.delete('/clients/:id', deleteClient);

// Start the server
server_app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
};
