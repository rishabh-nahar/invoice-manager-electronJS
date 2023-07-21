import React, { useState } from 'react';


const CreateClient = () => {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNo, setGstNumber] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [email, setEmail] = useState('');

  const [clientNameWarning, setClientNameWarning] = useState('');
  const [companyNameWarning, setCompanyNameWarning] = useState('');
  const [gstNoWarning, setGstNumberWarning] = useState('');
  const [contactWarning, setContactWarning] = useState('');
  const [addressWarning, setAddressWarning] = useState('');
  const [addressLine2Warning, setAddressLine2Warning] = useState('');
  const [emailWarning, setEmailWarning] = useState('');



  const handleSubmit = (e) => {
    e.preventDefault();
        // Reset previous warnings
        setClientNameWarning('');
        setCompanyNameWarning('');
        setGstNumberWarning('');
        setContactWarning('');
        setAddressWarning('');
        setAddressLine2Warning('');
    
        // Validate input fields
        let isValid = true;
    
        if (clientName.length < 3) {
          setClientNameWarning('Name must be at least 3 characters');
          isValid = false;
        }
    
        if (companyName.length < 3) {
          setCompanyNameWarning('Company name must be at least 3 characters');
          isValid = false;
        }
    
        if (gstNo.length !== 15) {
          setGstNumberWarning('GST number is not valid');
          isValid = false;
        }
    
        if (isNaN(Number(contact)) || contact.length !== 10 || !/^[6-9]/.test(contact)) {
          setContactWarning('Contact number must be a valid 10-digit number');
          isValid = false;
        }
        
        if (address.length <= 3) {
          setAddressWarning('Address is required');
          isValid = false;
        }
        console.log(`isValid: ${isValid}`);
        if (!isValid) {
          return;
        }
    
        // Create a new client object
        const newClient = {
          companyName,
          clientName,
          gstNo,
          contact,
          address,
          addressLine2,
          email
        };
 
        // Perform any desired actions with the new client data (e.g., send to backend, update state)
        window.electronAPI.createClient(newClient);

        // Clear the form fields
        // setClientName('');
        // setCompanyName('');
        // setGstNumber('');
        // setContact('');
        // setAddress('');
        // setAddressLine2('');
        // setEmail('');
  };

  return (
    <div className="create-client">
      <h2>Create Client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client Name:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <small className='warning-text'>{clientNameWarning}</small>
        </div>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <small className='warning-text'>{companyNameWarning}</small>
        </div>
        <div>
          <label>GST Number:</label>
          <input
            type="text"
            value={gstNo}
            onChange={(e) => setGstNumber(e.target.value)}
            required
          />
          <small className='warning-text'>{gstNoWarning}</small>
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className='contact-field'
            required
          />
          <small className='warning-text'>{contactWarning}</small>
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {addressWarning}
        </div>
        <div>
          <label>Address Line 2:</label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            required
          />
          <small className='warning-text'>{addressLine2Warning}</small>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <small className='warning-text'>{emailWarning}</small>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateClient;
