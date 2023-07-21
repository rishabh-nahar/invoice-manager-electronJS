import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Function to filter invoices based on search term
    const filterInvoices = (invoices, searchTerm) => {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
      return invoices.filter((invoice) => {
        const invoiceNumber = invoice.invoice_number.toLowerCase();
        const companyName = invoice.companyName.toLowerCase();
        return invoiceNumber.includes(lowercasedSearchTerm) || companyName.includes(lowercasedSearchTerm);
      });
    };

    const fetchInvoices = async () => {
      try {
        const invoiceList = await window.electronAPI.requestAllInvoices();
        const filteredInvoices = filterInvoices(invoiceList.rows, searchTerm);
        setInvoices(filteredInvoices || []);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      }
    };
    fetchInvoices();
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="invoice-list">
      <h2 className="invoice-list__title">Invoices</h2>
      <div className="invoice-list__upper-conainer">
        <input
          type="text"
          placeholder="Search by invoice number or company name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {invoices.length === 0 ? (
        <p className="invoice-list__message">No invoices found.</p>
      ) : (
        <table className="invoice-list__table">
          <thead>
            <tr>
              <th className="invoice-list__table-header">Invoice Number</th>
              <th className="invoice-list__table-header">Invoice Date</th>
              <th className="invoice-list__table-header">Company Name</th>
              <th className="invoice-list__table-header">Invoice Amount</th>
              <th className="invoice-list__table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="invoice-list__table-row">
                        <td className="invoice-list__table-data">{invoice.invoice_number}</td>
                        <td className="invoice-list__table-data">{invoice.date}</td>
                        <td className="invoice-list__table-data">{invoice.companyName}</td>
                        <td className="invoice-list__table-data">&#8377; {invoice.grand_total.toLocaleString()}</td>
                        <td className="invoice-list__table-data">
                          <Link to = {`/updateinvoice/${invoice.invoice_number}`} >
                            View
                          </Link>
                        </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceList;
