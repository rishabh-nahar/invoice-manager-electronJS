// Importing modules
const { BrowserWindow, app, ipcMain, Notification } = require('electron');
const path = require('path');

// app in dev mode true or false
const isDev = !app.isPackaged;


function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 200,
    backgroundColor: "white",
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, './preload.js')
    }
  }) 

  win.loadURL('http://localhost:3000');
  // const indexPath = path.join(__dirname, 'index.html');
  // win.loadURL(`file://${indexPath}`);

  ipcMain.on('notifictaion',(event, notifictaion_message)=>{
      new Notification({
        title: "Apsara Ply Centre - Invoice Manager",
        body: notifictaion_message.message ? notifictaion_message.message : notifictaion_message.error
      }).show()
  })
}

app.whenReady().then(async ()=>{
  // mongodb+srv://rishabh:A$tro137@cluster0.quucr.mongodb.net

  try {
    createWindow();
  } catch (error) {
    console.error('Error Creating window', error);
  }

})



/* ==================== Database Communication ==================== */


let notifyFunction = (notificationTitle, notificationBody) => {
    new Notification({
        title: notificationTitle,
        body: notificationBody
    }).show()
}


// Database operation through IPC

// ===================== To add new client =====================
ipcMain.on('createClient', async (event, newClient) => {
try {
const { companyName, gstNo, contact, email } = newClient;

// Check if the company name is already used
const existingCompany = await findClientByCompanyName(companyName);
if (existingCompany) {
  console.log(`Existing ccompany: ${existingCompany}`);
  notifyFunction("Apsara Ply Centre", "Company name already exists");
  return event.reply('createClientResponse', { error: 'Company name already exists' });
}

// Check if the GST number is already used
const existingGST = await findClientByGST(gstNo);
if (existingGST) {
  notifyFunction("Apsara Ply Centre", "GST number already exists");
  return event.reply('createClientResponse', { error: 'GST number already exists' });
}

// Check if the contact number is already used
const existingContact = await findClientByContact(contact);
if (existingContact) {
  notifyFunction("Apsara Ply Centre", "Contact number already exists");
  return event.reply('createClientResponse', { error: 'Contact number already exists' });
}

// Check if the email address is already used
const existingEmail = await findClientByEmail(email);
if (existingEmail) {
  notifyFunction("Apsara Ply Centre", "Email address already exists");
  return event.reply('createClientResponse', { error: 'Email address already exists' });
}

// Create the client and send a success response back to the renderer process
createClient({ body: newClient }, {
  status: (code) => {
    console.log(`Create client - HTTP status code: ${code}`);

    event.reply('createClientResponse', { message: 'Client created successfully' });
    notifyFunction("Apsara Ply Centre", "New Client added to client list");

    return {
      json: (data) => console.log('Create client - Response:', data)
    };
  }
});


} catch (error) {
// Send an error response back to the renderer process
event.reply('createClientResponse', { error: `Failed to create client because ${error}` });
}
});


// ===================== To get all client details =====================
ipcMain.on('fetchAllClients', async (event) => {
try {
// Call the getAllClients function to fetch all clients
console.log('Fetching clients...');
const clients = await getAllClients();
console.log("Result: "+clients);
// Send the fetched clients back to the renderer process
event.reply('fetchAllClientResponse', { message: 'Clients fetched', clients });
} catch (error) {
// Send an error response back to the renderer process
event.reply('fetchAllClientResponse', { error: `Failed to fetch clients because, ${error.message}` });
}
});

// ===================== To delete client from ID =====================

ipcMain.on('deleteClient', async (event, clientId) => {
try {
// Call the deleteClient function with the clientId data
deleteClient({ body: clientId }, {
status: (code) => {
  console.log(`Delete client - HTTP status code: ${code}`);
  return {
  json: (data) => console.log('Delete client - Response:', data)
  };
}
})
// Send a success response back to the renderer process
event.reply('deleteClientResponse', { message: 'Client deleted successfully' });
notifyFunction("Apsara Ply Centre", "Client deleted successfully")
} catch (error) {
// Send an error response back to the renderer process
event.reply('deleteClientResponse', { error: 'Failed to delete client', reason: error});
}
});

// ===================== To get client from ID =====================
ipcMain.on('getClientById', async (event, clientId) => {
try {


// Call the getClientById function with the clientId
console.log(`Getting your client details with id ${clientId} `);
const client = await getClientById(clientId);
// Send the fetched client back to the renderer process
event.reply('getClientByIdResponse', { message: 'Client fetched', client });
} catch (error) {
// Send an error response back to the renderer process
event.reply('getClientByIdResponse', { error: 'Failed to fetch client', reason: error });
}
});

// ===================== To update client details from ID =====================
ipcMain.on('updateClient', async (event, clientId, updatedClient) => {
try {

const { clientName, companyName, address, address_line2, contact, email, gstNo } = updatedClient;
console.log(companyName, gstNo, contact, email);
// Check if the company name is already used
const existingCompany = await findClientByCompanyNameForUpdate(companyName,clientId);
if (existingCompany) {
  console.log(`Existing ccompany: ${existingCompany}`);
  notifyFunction("Apsara Ply Centre", "Company name already exists");
  return event.reply('createClientResponse', { error: 'Company name already exists' });
}

// Check if the GST number is already used
const existingGST = await findClientByGSTForUpdate(gstNo,clientId);
if (existingGST) {
  notifyFunction("Apsara Ply Centre", "GST number already exists");
  return event.reply('createClientResponse', { error: 'GST number already exists' });
}

// Check if the contact number is already used
const existingContact = await findClientByContactForUpdate(contact,clientId);
if (existingContact) {
  notifyFunction("Apsara Ply Centre", "Contact number already exists");
  return event.reply('createClientResponse', { error: 'Contact number already exists' });
}

// Check if the email address is already used
const existingEmail = await findClientByEmailForUpdate(email,clientId);
if (existingEmail) {
  notifyFunction("Apsara Ply Centre", "Email address already exists");
  return event.reply('createClientResponse', { error: 'Email address already exists' });
}


// Perform the update operation using the clientId and updatedClient data
console.log(`Updating client details with id ${clientId}`);
updateClient(clientId, updatedClient);

// Send a success response back to the renderer process
event.reply('updateClientResponse', { message: 'Client updated successfully' });
  notifyFunction("Apsara Ply Centre", "Client details updated")



} catch (error) {
// Send an error response back to the renderer process
event.reply('updateClientResponse', { error: 'Failed to update client', reason: error });
notifyFunction("Apsara Ply Centre", "Failed to update client details")

}
});


// ===================== To create an invoice =====================
ipcMain.on('createInvoice', async (event, newInvoice) => {
try {
// Call the createInvoice function with the newInvoice data
console.log(await createInvoice({ body: newInvoice }, {
status: (code) => {
  console.log(`Create Invoice - HTTP status code: ${code}`);
  if(code === 201){
    event.reply('createInvoiceResponse', { message: 'Invoice created successfully' });
    notifyFunction("Apsara Ply Centre", "New Invoice created");
  }
  else{
    notifyFunction("Apsara Ply Centre", "Error Creating Invoice");
  }
  return {
    json: (data) => console.log('Create client - Response:', data)
  };
}
}))
// Send a success response back to the renderer process
event.reply('createInvoiceResponse', { message: 'Invoice created successfully' });
} catch (error) {
// Send an error response back to the renderer process
notifyFunction("Apsara Ply Centre", `Failed to create invoice: ${error}`);
event.reply('createInvoiceResponse', { error: `Failed to create invoice: ${error}` }); 
}
});

// ===================== To get all invoices =====================
ipcMain.on('getAllInvoices', async (event) => {
try {
// Call the getAllInvoices function to fetch all invoices
const invoices = await getAllInvoices();

// Send the fetched invoices back to the renderer process
event.reply('getAllInvoicesResponse', { message: 'Invoices fetched', invoices });
} catch (error) {
// Send an error response back to the renderer process
event.reply('getAllInvoicesResponse', { error: `Failed to fetch invoices: ${error}` });
}
});

// ===================== To get an invoice by ID =====================
ipcMain.on('getInvoiceByInvNumber', async (event, invoiceId) => {
try {
// Call the getInvoiceByInvNumber function with the invoiceId
const invoice = await getInvoiceByInvNumber(invoiceId);

// Send the fetched invoice back to the renderer process
event.reply('getInvoiceByInvNumberResponse', { message: 'Invoice fetched', invoice });
} catch (error) {
// Send an error response back to the renderer process
event.reply('getInvoiceByInvNumberResponse', { error: `Failed to fetch invoice: ${error}` });
}
});

// ===================== To update an invoice =====================
ipcMain.on('updateInvoice', async (event, invoiceId, updatedInvoice) => {
try {
// Call the updateInvoice function with the invoiceId and updatedInvoice data
await updateInvoice(invoiceId, updatedInvoice);

// Send a success response back to the renderer process
event.reply('updateInvoiceResponse', { message: 'Invoice updated successfully' });
notifyFunction("Apsara Ply Centre", "Invoice details updated");
} catch (error) {
// Send an error response back to the renderer process
event.reply('updateInvoiceResponse', { error: `Failed to update invoice: ${error}` });
notifyFunction("Apsara Ply Centre", "Failed to update invoice details");
}
});

// ===================== To delete an invoice =====================
ipcMain.on('deleteInvoice', async (event, invoiceId) => {
try {
// Call the deleteInvoice function with the invoiceId
await deleteInvoice(invoiceId);

// Send a success response back to the renderer process
event.reply('deleteInvoiceResponse', { message: 'Invoice deleted successfully' });
notifyFunction("Apsara Ply Centre", "Invoice deleted successfully");
} catch (error) {
// Send an error response back to the renderer process
event.reply('deleteInvoiceResponse', { error: 'Failed to delete invoice', reason: error });
}
});

// ===================== To get last Invoice ID =====================
ipcMain.on('getInvoiceLastId', async (event) => {
try {
// Call the getInvoiceLastId function to retrieve the last inserted ID
const lastId = await getInvoiceLastId();

// Send the lastId back to the renderer process
event.reply('getInvoiceLastIdResponse', { lastId });
} catch (error) {
// Send an error response back to the renderer process
event.reply('getInvoiceLastIdResponse', { error: 'Failed to retrieve last inserted ID', reason: error });
}
});


// ===================== To create an invoice detail =====================
ipcMain.on('createInvoiceDetail', (event, newInvoiceDetail) => {
try {
// Call the createInvoiceDetail function with the newInvoiceDetail data

console.log("Invoice Detail requesting function....");
createInvoiceDetail(newInvoiceDetail), {
status: (code) => {
  console.log(`Invoice details - HTTP status code: ${code}`);

  if(code === 201){
    event.reply('createInvoiceResponse', { message: 'Invoice created successfully' });
  }
  else{
    notifyFunction("Apsara Ply Centre", "Error Creating Invoice");
  }

  return {
    json: (data) => {
      console.log('Create Invoice - Response:', data)
      if(data.success === 'success'){
        notifyFunction("Apsara Ply Centre", "Invoice data added");
      }
    }
  };
}};

// Send a success response back to the renderer process
event.reply('createInvoiceDetailResponse', { message: 'Invoice detail created successfully' });
notifyFunction("Apsara Ply Centre", "New Invoice detail created");
} catch (error) {
// Send an error response back to the renderer process
event.reply('createInvoiceDetailResponse', { error: `Failed to create invoice detail: ${error}` });
}
});

// ===================== To get all invoice details =====================
ipcMain.on('getAllInvoiceDetails', async (event) => {
try {
// Call the getAllInvoiceDetails function to fetch all invoice details
const invoiceDetails = await getAllInvoiceDetails();

// Send the fetched invoice details back to the renderer process
event.reply('getAllInvoiceDetailsResponse', { message: 'Invoice details fetched', invoiceDetails });
} catch (error) {
// Send an error response back to the renderer process
event.reply('getAllInvoiceDetailsResponse', { error: `Failed to fetch invoice details: ${error}` });
}
});

// ===================== To get invoice details by invoice ID =====================
ipcMain.on('getInvoiceDetailsByInvoiceId', async (event, invoiceId) => {
try {
// Call the getInvoiceDetailsByInvoiceId function with the invoiceId
const invoiceDetails = await getInvoiceDetailsByInvoiceId(invoiceId);

// Send the fetched invoice details back to the renderer process
event.reply('getInvoiceDetailsByInvoiceIdResponse', { message: 'Invoice details fetched', invoiceDetails });
} catch (error) {
// Send an error response back to the renderer process
event.reply('getInvoiceDetailsByInvoiceIdResponse', { error: `Failed to fetch invoice details: ${error}` });
}
});

// ===================== To update an invoice detail =====================
ipcMain.on('updateInvoiceDetail', async (event, invoiceDetailId, updatedInvoiceDetail) => {
try {
// Call the updateInvoiceDetail function with the invoiceDetailId and updatedInvoiceDetail data
await updateInvoiceDetail(invoiceDetailId, updatedInvoiceDetail);

// Send a success response back to the renderer process
event.reply('updateInvoiceDetailResponse', { message: 'Invoice detail updated successfully' });
notifyFunction("Apsara Ply Centre", "Invoice detail updated");
} catch (error) {
// Send an error response back to the renderer process
event.reply('updateInvoiceDetailResponse', { error: `Failed to update invoice detail: ${error}` });
notifyFunction("Apsara Ply Centre", "Failed to update invoice detail");
}
});

// ===================== To delete an invoice detail =====================
ipcMain.on('deleteInvoiceDetail', async (event, invoiceDetailId) => {
try {
// Call the deleteInvoiceDetail function with the invoiceDetailId
await deleteInvoiceDetail(invoiceDetailId);

// Send a success response back to the renderer process
event.reply('deleteInvoiceDetailResponse', { message: 'Invoice detail deleted successfully' });
notifyFunction("Apsara Ply Centre", "Invoice detail deleted successfully");
} catch (error) {
// Send an error response back to the renderer process
event.reply('deleteInvoiceDetailResponse', { error: 'Failed to delete invoice detail', reason: error });
}
});



/* ==================== Queries ==================== */
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// ==================== Connect to the SQLite database ====================
const db = new sqlite3.Database('./apsaraplycentre', (error) => {
  if (error) {
    console.error('Failed to open database:', error);
  } else {
    console.log('Database opened successfully');    
  }
});

// ==================== Create a new client ====================
function createClient(req, res) {

  console.log("Adding client");
  const { clientName, companyName, address, addressLine2, contact, email, gstNo } = req.body;

  const query = `INSERT INTO clients (clientName, companyName, address, address_line2, contact, email, gstNo) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [clientName, companyName, address, addressLine2, contact, email, gstNo];

  db.run(query, values, function (error) {
    if (error) {
      res.status(500).json({ error: `Failed to create client: ${error.message}` });
    } else {
      res.status(201).json({ message: 'Client created successfully' });
    }
  });
}

// ==================== Get all clients ====================
function getAllClients() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients';

    db.all(query, function (error, rows) {
      if (error) {
        console.log({ error: `Failed to fetch clients: ${error}` });
        reject(error);
      } else {
        console.log(rows);
        resolve({rows});
      }
    });
  });
}

// ==================== Get a single client by ID ====================
function getClientById(clientId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE id = ?';
    const values = clientId;
    console.log(values);
    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client' });
        reject(error);
      } else if (row) {
        console.log({ status: 'success', row });
        resolve(row);
      } else {
        console.log({ error: 'Client not found' });
        reject(new Error('Client not found'));
      } 
    });
  });
  return
}
// ==================== Update a client ====================
function updateClient(clientId, updatedClient) {
  return new Promise((resolve, reject) => {
    const { clientName, companyName, address, address_line2, contact, email, gstNo } = updatedClient;

    // Construct the SQL query to update the client
    const query = `UPDATE clients SET clientName = ?, companyName = ?, address = ?,  address_line2 = ?,
                   contact = ?, email = ?, gstNo = ? WHERE id = ?`;
    const values = [clientName, companyName, address, address_line2, contact, email, gstNo, clientId];

    // Execute the update query
    db.run(query, values, function (error) {
      if (error) {
        console.log({ error: 'Failed to update client' });
        reject(error);
      } else if (this.changes > 0) {
        console.log({ message: 'Client updated successfully' });
        resolve();
      } else {
        console.log({ error: 'Client not found' });
        reject(new Error('Client not found'));
      }
    });
  });
}

// ==================== Delete a client ====================
function deleteClient(req, res) {
  const clientId = req.body;

  const query = 'DELETE FROM clients WHERE id = ?';
  const values = [clientId];

  db.run(query, values, function (error) {
    if (error) {
      console.log({ error: 'Failed to delete client', reason: error });
      res.status(500).json({ error: 'Failed to delete client', reason: error });
    } else if (this.changes > 0) {
      console.log({ message: 'Client deleted successfully' });
      res.status(200).json({ message: 'Client deleted successfully' });
    } else {
      console.log({ error: 'Client not found' });
      res.status(404).json({ error: 'Client not found' });
    }
  });
}

// ==================== Find client by company name ====================
function findClientByCompanyName(companyName) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE companyName = ?';
    const values = [companyName];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by company name' });
        reject(true);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Find client by GST number ====================
function findClientByGST(gstNo) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE gstNo = ?';
    const values = [gstNo];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by GST number' });
        reject(true);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Find client by contact number ====================
function findClientByContact(contact) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE contact = ?';
    const values = [contact];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by contact number' });
        reject(true);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Find client by email address ====================
function findClientByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE email = ?';
    const values = [email];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by email address' });
        reject(true);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}


// ==================== Find client by company name ====================
function findClientByCompanyNameForUpdate(companyName, clientId) {
  return new Promise((resolve, reject) => {
    console.log("Searching Company name... ");
    const query = 'SELECT * FROM clients WHERE companyName = ? AND id <> ?';
    const values = [companyName, clientId];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by company name' });
        console.log(error);
        reject(true);
      } else if (row) {
        console.log(row);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Find client by GST number ====================
function findClientByGSTForUpdate(gstNo, clientId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE gstNo = ? AND id <> ?';
    const values = [gstNo, clientId];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by GST number' });
        reject(true);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Find client by contact number ====================
function findClientByContactForUpdate(contact, clientId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE contact = ? AND id <> ?';
    const values = [contact, clientId];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by contact number' });
        reject(true);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Find client by email address ====================
function findClientByEmailForUpdate(email, clientId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM clients WHERE email = ? AND id <> ?';
    const values = [email, clientId];

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch client by email address' });
        reject(error);
      } else if (row) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// ==================== Create a new invoice ====================
function createInvoice(req, res) {
  const { invoiceNumber, date, client_id, shippingAddress, total, grandTotal } = req.body;

  const query = `INSERT OR REPLACE INTO invoices (invoice_number, date, client_id, shipping_address, total, grand_total)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [invoiceNumber, date, client_id, shippingAddress, total, grandTotal];

  db.run(query, values, function (error) {
    if (error) {
      res.status(500).json({ error: `Failed to create invoice: ${error.message}` });
    } else {
      res.status(201).json({ message: 'Invoice created successfully' });
    }
  });
}

// ==================== Get all invoices ====================
function getAllInvoices() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM invoices JOIN clients ON invoices.client_id = clients.id ';

    db.all(query, function (error, rows) {
      if (error) {
        console.log({ error: `Failed to fetch invoices: ${error}` });
        reject(error);
      } else {
        console.log(rows);
        resolve({ rows });
      }
    });
  });
}

// ==================== Get a single invoice by ID ====================
function getInvoiceByInvNumber(invoiceNumber) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM invoices WHERE invoice_number = ?';
    const values = invoiceNumber;

    db.get(query, values, function (error, row) {
      if (error) {
        console.log({ error: 'Failed to fetch invoice' });
        reject(error);
      } else if (row) {
        console.log({ status: 'success', row });
        resolve(row);
      } else {
        console.log({ error: 'Invoice not found' });
        reject(new Error('Invoice not found'));
      }
    });
  });
}

// ==================== Update an invoice ====================
function updateInvoice(invoiceId, updatedInvoice) {
  return new Promise((resolve, reject) => {
    const { invoiceNumber, date, client, shippingAddress, total, grandTotal } = updatedInvoice;

    const query = `UPDATE invoices SET invoice_number = ?, date = ?, client = ?, shipping_address = ?, total = ?, grand_total = ? WHERE id = ?`;
    const values = [invoiceNumber, date, client, shippingAddress, total, grandTotal, invoiceId];

    db.run(query, values, function (error) {
      if (error) {
        console.log({ error: 'Failed to update invoice' });
        reject(error);
      } else if (this.changes > 0) {
        console.log({ message: 'Invoice updated successfully' });
        resolve();
      } else {
        console.log({ error: 'Invoice not found' });
        reject(new Error('Invoice not found'));
      }
    });
  });
}

// ==================== Delete an invoice ====================
function deleteInvoice(req, res) {
  const invoiceId = req.body;

  const query = 'DELETE FROM invoices WHERE id = ?';
  const values = [invoiceId];

  db.run(query, values, function (error) {
    if (error) {
      console.log({ error: 'Failed to delete invoice', reason: error });
      res.status(500).json({ error: 'Failed to delete invoice', reason: error });
    } else if (this.changes > 0) {
      console.log({ message: 'Invoice deleted successfully' });
      res.status(200).json({ message: 'Invoice deleted successfully' });
    } else {
      console.log({ error: 'Invoice not found' });
      res.status(404).json({ error: 'Invoice not found' });
    }
  });
}

// ==================== Create a new invoice detail ====================
function createInvoiceDetail(newInvoiceDetail) {
  return new Promise((resolve, reject) => {
    const { invoiceId, srNo, product, description, hsnCode, unit, pricePerUnit, quantity, totalPrice } = newInvoiceDetail;
    const query = `INSERT OR REPLACE INTO invoice_details (invoice_id, sr_no, product, description, hsn_code, unit, price_per_unit, quantity, total_price)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [invoiceId, srNo, product, description, hsnCode, unit, pricePerUnit, quantity, totalPrice];

    db.run(query, values, function (error) {
      if (error) {
        reject(`Error creating invoice detail: ${error}`);
      } else {
        resolve({message: "Invoice created", status: "success"});
      }
    });
  });
}

// ==================== Get all invoice details ====================
function getAllInvoiceDetails() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM invoice_details';

    db.all(query, function (error, rows) {
      if (error) {
        console.log({ error: `Failed to fetch invoice details: ${error}` });
        reject(error);
      } else {
        console.log(rows);
        resolve({ rows });
      }
    });
  });
}

// ==================== Get invoice details by invoice ID ====================
function getInvoiceDetailsByInvoiceId(invoiceId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM invoice_details WHERE invoice_id = ?';
    const values = [invoiceId];

    db.all(query, values, function (error, rows) {
      if (error) {
        console.log({ error: 'Failed to fetch invoice details' });
        reject(error);
      } else {
        console.log(rows);
        resolve(rows);
      }
    });
  });
}

// ==================== Update an invoice detail ====================
function updateInvoiceDetail(invoiceDetailId, updatedInvoiceDetail) {
  return new Promise((resolve, reject) => {
    const { invoiceId, srNo, product, description, hsnCode, unit, pricePerUnit, totalPrice } = updatedInvoiceDetail;

    const query = `UPDATE invoice_details SET invoice_id = ?, sr_no = ?, product = ?, description = ?, hsn_code = ?,
                   unit = ?, price_per_unit = ?, total_price = ? WHERE id = ?`;
    const values = [invoiceId, srNo, product, description, hsnCode, unit, pricePerUnit, totalPrice, invoiceDetailId];

    db.run(query, values, function (error) {
      if (error) {
        console.log({ error: 'Failed to update invoice detail' });
        reject(error);
      } else if (this.changes > 0) {
        console.log({ message: 'Invoice detail updated successfully' });
        resolve();
      } else {
        console.log({ error: 'Invoice detail not found' });
        reject(new Error('Invoice detail not found'));
      }
    });
  });
}

// ==================== Delete an invoice detail ====================
function deleteInvoiceDetail(req, res) {
  const invoiceDetailId = req.body;

  const query = 'DELETE FROM invoice_details WHERE id = ?';
  const values = [invoiceDetailId];

  db.run(query, values, function (error) {
    if (error) {
      console.log({ error: 'Failed to deleteinvoice detail', reason: error });
      res.status(500).json({ error: 'Failed to delete invoice detail', reason: error });
    } else if (this.changes > 0) {
      console.log({ message: 'Invoice detail deleted successfully' });
      res.status(200).json({ message: 'Invoice detail deleted successfully' });
    } else {
      console.log({ error: 'Invoice detail not found' });
      res.status(404).json({ error: 'Invoice detail not found' });
    }
  });
}

// ==================== Get Invoice Last Id ====================
function getInvoiceLastId() {
  return new Promise((resolve, reject) => {

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
    const currentYear = currentDate.getFullYear();


    // Construct the query to filter data for the current month and year
    const query = `SELECT * FROM invoices WHERE strftime('%Y', date) = '${currentYear}' ORDER BY ROWID DESC LIMIT 1`;

    db.get(query, function (error, row) {
      if (error) {
        reject(`Failed to retrieve last inserted ID: ${error.message}`);
      } else {
        if(row){
          const lastId = row.invoice_number || 'INV000';
          console.log(lastId);
          resolve(lastId);
        }
        else{
          resolve(0)
        }
      }
    });
  });
}
