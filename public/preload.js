const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});

contextBridge.exposeInMainWorld('electronAPI', {
  
  requestAllClients: () => {
    // console.log("Requesting...");
    // Request all clients from the main process
    ipcRenderer.send('fetchAllClients');
    // console.log("Getting client details...");
    return new Promise((resolve, reject) => {
      ipcRenderer.on('fetchAllClientResponse', (event, clientData) => {
        // console.log(clientData);
        resolve(clientData.clients.rows);
      });
      // Handle any error response
      ipcRenderer.on('fetchAllClientResponse', (event, errorData) => {
        // console.log(errorData);
        reject(new Error(errorData.error));
      });

    });
  },

  createClient: (data) => {
    // console.log("Creating client...");
    ipcRenderer.send('createClient', data);
    ipcRenderer.on('createClientResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return String(response.error);
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },  

  deleteClient: (clientId) => {
    ipcRenderer.send('deleteClient', clientId)
    ipcRenderer.on('deleteClientResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return response.error;
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },



  updateClient: (clientId, updatedClient) => {
    // console.log("Updating client details...");
    ipcRenderer.send('updateClient', clientId, updatedClient);
    ipcRenderer.on('updateClientResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return response.error;
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },

  getClientById: (clientId) => {
    ipcRenderer.send('getClientById', clientId);
    // console.log("Getting client details...");
    return new Promise((resolve, reject) => {
      ipcRenderer.on('getClientByIdResponse', (event, response) => {
        if (response.error) {
          console.error(response.error + ". Reason:" + response.reason );
          reject(new Error(response.error));
        } else {
          // console.log(response.client);
          resolve(response.client);
        }
      });
    });
  },


  requestAllInvoices: () => {
    // Request all invoices from the main process
    ipcRenderer.send('getAllInvoices');
    // console.log("Getting invoice details...");
    return new Promise((resolve, reject) => {
      ipcRenderer.on('getAllInvoicesResponse', (event, invoiceData) => {
        resolve(invoiceData.invoices);
      });
      // Handle any error response
      ipcRenderer.on('getAllInvoicesResponse', (event, errorData) => {
        reject(new Error(errorData.error));
      });

    });
  },

  createInvoice: (data) => {
    // console.log("Creating invoice...");
    ipcRenderer.send('createInvoice', data);
    ipcRenderer.on('createInvoiceResponse', (event, response) => {
      if (response.error) { 
        console.error(response.error);
        return String(response.error);
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },

  deleteInvoice: (invoiceId) => {
    ipcRenderer.send('deleteInvoice', invoiceId)
    ipcRenderer.on('deleteInvoiceResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return response.error;
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },

  updateInvoice: (invoiceId, updatedInvoice) => {
    // console.log("Updating invoice details...");
    ipcRenderer.send('updateInvoice', invoiceId, updatedInvoice);
    ipcRenderer.on('updateInvoiceResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return response.error;
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },

  getInvoiceByInvNumber: (invoiceId) => {
    ipcRenderer.send('getInvoiceByInvNumber', invoiceId);
    // console.log("Getting invoice details...");
    return new Promise((resolve, reject) => {
      ipcRenderer.on('getInvoiceByInvNumberResponse', (event, response) => {
        if (response.error) {
          console.error(response.error + ". Reason:" + response.reason);
          reject(new Error(response.error));
        } else {
          console.log(response.invoice);
          resolve(response.invoice);
        }
      });
    });
  },

  requestAllInvoiceDetails: () => {
    // console.log("Requesting all invoice details...");
    // Request all invoice details from the main process
    ipcRenderer.send('getAllInvoiceDetails');
    // console.log("Getting invoice details...");
    return new Promise((resolve, reject) => {
      ipcRenderer.on('getAllInvoiceDetailsResponse', (event, invoiceDetailData) => {
        // console.log(invoiceDetailData);
        resolve(invoiceDetailData.invoiceDetails);
      });
      // Handle any error response
      ipcRenderer.on('getAllInvoiceDetailsResponse', (event, errorData) => {
        // console.log(errorData);
        reject(new Error(errorData.error));
      });

    });
  },

  createInvoiceDetail: (data) => {
    // console.log("Creating invoice detail...");
    ipcRenderer.send('createInvoiceDetail', data);
        ipcRenderer.on('createInvoiceDetailResponse', (event, response) => {
          if (response.error) {
            console.error(response.error);
            return String(response.error);
          } else {
            // console.log(response.message);
            return response.message;
          }
        });
  },

  deleteInvoiceDetail: (invoiceDetailId) => {
    ipcRenderer.send('deleteInvoiceDetail', invoiceDetailId)
    ipcRenderer.on('deleteInvoiceDetailResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return response.error;
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },

  updateInvoiceDetail: (invoiceDetailId, updatedInvoiceDetail) => {
    // console.log("Updating invoice detail...");
    ipcRenderer.send('updateInvoiceDetail', invoiceDetailId, updatedInvoiceDetail);
    ipcRenderer.on('updateInvoiceDetailResponse', (event, response) => {
      if (response.error) {
        console.error(response.error);
        return response.error;
      } else {
        // console.log(response.message);
        return response.message;
      }
    });
  },

  getInvoiceDetailsByInvoiceId: (invoiceId) => {
    ipcRenderer.send('getInvoiceDetailsByInvoiceId', invoiceId);
    // console.log("Getting invoice details...");
    return new Promise((resolve, reject) => {
      ipcRenderer.on('getInvoiceDetailsByInvoiceIdResponse', (event, response) => {
        if (response.error) {
          console.error(response.error + ". Reason:" + response.reason);
          reject(new Error(response.error));
        } else {
          // console.log(response.invoiceDetails);
          resolve(response.invoiceDetails);
        }
      });
    });
  },

  getLastInvoiceId: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send('getInvoiceLastId');
      ipcRenderer.on('getInvoiceLastIdResponse', (event, response) => {
        if (response.error) {
          console.error(response.error + '. Reason: ' + response.reason);
          reject(new Error(response.error));
        } else {
          // console.log('Last invoice ID:', response.lastId);
          resolve(response.lastId);
        }
      });
    });
  }

  
});