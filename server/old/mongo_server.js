const express = require('express');
const mongoose = require('mongoose');
const Client = require('./model/clients')
const server_app = express();
const port = 8000;

// Create a new client
function createClient(req, res) {
    const { clientName, companyName, address, contact, email, gstNo } = req.body;
    const client = new Client({ clientName, companyName, address, contact, email, gstNo });

    client.save()
      .then(() => {
        res.status(201).json({ message: 'Client created successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: `Failed to create client: ${error}` });
      });
  }

  // Get all clients
  async function getAllClients() {
    client_data = await Client.find({}, '_id clientName companyName address contact email gstNo');
    console.log(client_data);
    return client_data;
  }
  
  // Get a single client
  function getClientById(req, res) {
    const clientId = req.params.id;

    Client.findById(clientId)
      .then((client) => {
        if (client) {
          res.status(200).json(client);
        } else {
          res.status(404).json({ error: 'Client not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to fetch client' });
      });
  }

  // Update a client
  function updateClient(req, res) {
    const clientId = req.params.id;
    const { clientName, companyName, address, contact, email, gstNo } = req.body;

    Client.findByIdAndUpdate(clientId, { clientName, companyName, address, contact, email, gstNo }, { new: true })
      .then((client) => {
        if (client) {
          res.status(200).json(client);
        } else {
          res.status(404).json({ error: 'Client not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to update client' });
      });
  }

  // Delete a client
  function deleteClient(req, res) {
    const clientId = req.params.id;

    Client.findByIdAndRemove(clientId)
      .then((client) => {
        if (client) {
          res.status(200).json({ message: 'Client deleted successfully' });
        } else {
          res.status(404).json({ error: 'Client not found' });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to delete client' });
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

