import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UpdateClientForm = () => {
  const { clientId } = useParams();
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [address_line2, setAddressLine2] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [gstNo, setGstNo] = useState('');

  const [clientNameWarning, setClientNameWarning] = useState('');
  const [companyNameWarning, setCompanyNameWarning] = useState('');
  const [addressWarning, setAddressWarning] = useState('');
  const [address_line2Warning, setAddressLine2Warning] = useState('');
  const [contactWarning, setContactWarning] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const [gstNoWarning, setGstNoWarning] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await window.electronAPI.getClientById(clientId);
        console.log(response);
        setClientName(response.clientName);
        setCompanyName(response.companyName);
        setAddress(response.address);
        setAddressLine2(response.address_line2);
        setContact(response.contact);
        setEmail(response.email);
        setGstNo(response.gstNo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClient();
  }, [clientId]);

  const validateInputs = () => {
    let isValid = true;

    setClientNameWarning('');
    setCompanyNameWarning('');
    setAddressWarning('');
    setAddressLine2Warning('');
    setContactWarning('');
    setEmailWarning('');
    setGstNoWarning('');
    
    if (clientName.length < 3) {
      setClientNameWarning('Name must be at least 3 characters');
      isValid = false;
    }

    if (companyName.length < 3) {
      setCompanyNameWarning('Company name must be at least 3 characters');
      isValid = false;
    }

    if (gstNo.length !== 15) {
      setGstNoWarning('GST number is not valid');
      isValid = false;
    }

    if (isNaN(Number(contact)) || contact.length !== 10 || !/^[6-9]/.test(contact)) {
      setContactWarning('Contact number must be a valid 10-digit number');
      isValid = false;
    }
    
    if (address.length <= 3 ) {
      setAddressWarning('Address is required');
      isValid = false;
    }
    if (address_line2.length <= 3) {
      setAddressWarning('Address is required');
      isValid = false;
    }

    return isValid;
  };

  const handleUpdateClient = () => {
    if (!validateInputs()) {
      return;
    }

    const updatedClient = {
      clientName,
      companyName,
      address,
      address_line2,
      contact,
      email,
      gstNo
    };

    window.electronAPI.updateClient(clientId, updatedClient);
  };

  return (
    <div className="update-client-form">
      <h2>Update Client Details</h2>
      <form>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            minLength={3}
            required
          />
          <small className='warning-text'>{clientNameWarning}</small>
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <small className='warning-text'>{companyNameWarning}</small>
        </div>
        <div>
          <label>Address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          <small className='warning-text'>{addressWarning}</small>
        </div>
        <div>
          <label>Address Line 2:</label>
          <input type="text" value={address_line2} onChange={(e) => setAddressLine2(e.target.value)} />
          <small className='warning-text'>{address_line2Warning}</small>
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            pattern="\d{10}"
            required
          />
          <small className='warning-text'>{contactWarning}</small>
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <small className='warning-text'>{emailWarning}</small>
        </div>
        <div>
          <label>GST No:</label>
          <input
            type="text"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
            pattern="[A-Za-z0-9]{15}"
            required
          />
          <small className='warning-text'>{gstNoWarning}</small>
        </div>
        <button type="button" onClick={handleUpdateClient}>Update Client Details</button>
      </form>
    </div>
  );
};

export default UpdateClientForm;
