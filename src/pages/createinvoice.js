import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchableInput from '../components/searchableinputs';

const CreateInvoice = () => {
  const { clientId } = useParams();

  const today = new Date().toISOString().substr(0, 10); // Get today's date in the format "YYYY-MM-DD"

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [date, setDate] = useState(today);
  const [companyName, setCompanyname] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const addItem = () => {
    const newSrNo = items.length + 1;
    setItems([...items, { srNo: newSrNo, product: '', description: '', hsnCode: '', unit: '', pricePerUnit: 0.0, quantity: 1, totalPrice: 0.0 }]);
  };

  function makeThreeDigit(num) {
    const numStr = num.toString();
    const numLength = numStr.length;
  
    if (numLength === 1) {
      return `00${numStr}`;
    } else if (numLength === 2) {
      return `0${numStr}`;
    }
  
    return numStr;
  }
  

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientDetails = await window.electronAPI.getClientById(clientId);
        let newInvoiceNumber = 1;
        try {
          const lastInvoiceId = await window.electronAPI.getLastInvoiceId() ;
          if(lastInvoiceId){
              console.log("LastId: ",lastInvoiceId);
              newInvoiceNumber =  parseInt(lastInvoiceId.slice(3,6)) + 1;
            }
        } catch (error) {
            console.log("Unable to fetch Last ID");
        }
          setInvoiceNumber('INV'+ makeThreeDigit( newInvoiceNumber ) );

        setCompanyname(`${clientDetails.companyName}`);
        setToAddress(`${clientDetails.address},\n${clientDetails.address_line2}`);
        setShippingAddress(`${clientDetails.address},\n${clientDetails.address_line2}`)
        addItem();
      } catch (error) {
        console.error('Failed to fetch client:', error);
      }
    };
    fetchClient();
  }, [clientId]);

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    calculateTotal(updatedItems);
    
    // Update the product value of the next item
    if (index < updatedItems.length) {
      const nextProduct = updatedItems[index].product;
      const nextHsnCode = updatedItems[index].hsnCode;
      const nextUnit = updatedItems[index].unit;
      handleItemProductChange(index, { option: nextProduct, hsnCode: nextHsnCode, unit: nextUnit });
    }
  };

  const calculateTotal = (updatedItems) => {
    let total = 0;
    updatedItems.forEach((item) => {
      total += item.totalPrice;
    });
    setTotal(Math.round(total));
  };

  const handleItemProductChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].product = value?.option;
    updatedItems[index].hsnCode = value?.hsnCode;
    updatedItems[index].unit = value?.unit;
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    const totalPrice = Number(updatedItems[index].quantity) * Number(updatedItems[index].pricePerUnit);
    updatedItems[index].totalPrice = totalPrice;

    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleInvoiceNumberChange = (e) => {
    setInvoiceNumber(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleToAddressChange = (e) => {
    setToAddress(e.target.value);
  };


  const renderItems = () => {
    return items.map((item, index) => (
      <tr key={index}>
        <td>
          {item.srNo}
        </td>
        <td>
          <SearchableInput 
              value={item.product}
              onValueChange={(value) => handleItemProductChange(index, value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.description}
            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={item.hsnCode}
            onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)}
          />
        </td>
        <td>
          <input type="text" value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} />
        </td>
        <td>
          <input
            type="number"
            className='no-splin-bttn'
            value={item.pricePerUnit}
            onChange={(e) => handleItemChange(index, 'pricePerUnit', e.target.value)}
          />
        </td>
        <td>
          <input
            type="number"
            className='no-splin-bttn'
            value={item.quantity}
            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
          />
        </td>
        <td>
          <input
            type="number"
            className='no-splin-bttn'
            value={item.totalPrice}
            onChange={(e) => handleItemChange(index, 'totalPrice', e.target.value)}
          />
        </td>
        <td>
          {index !== 0 && (<button onClick={() => removeItem(index)}>Remove</button>)}
          {/* {index === 0 && (<button disabled={true} >Remove</button>)} */}
        </td>
      </tr>
    ));
  };
  

  const handleCreateInvoice = async () => {
    try { 
      // Prepare the data to be saved
      if(total>0){
          const newInvoice = {
            invoiceNumber,
            date,
            client_id: clientId,
            shippingAddress,
            total,
            grandTotal: Math.round(total + total * 0.18), // Assuming 18% GST
          };
      
          // Create the invoice
          const invoiceResponse = await window.electronAPI.createInvoice(newInvoice);
          console.log(invoiceResponse);
          // if(invoiceResponse){
              // Loop through the items and create invoice details
              for (const item of items) {
                console.log("Adding invoice details", item);
                const newInvoiceDetail = {
                  invoiceId: invoiceNumber, // Assuming the response contains the generated invoice ID
                  srNo: item.srNo,
                  product: item.product,
                  description: item.description,
                  hsnCode: item.hsnCode,
                  unit: item.unit,
                  pricePerUnit: item.pricePerUnit,
                  totalPrice: item.totalPrice,
                  quantity: item.quantity,
                };
                const invoiceDetailResponse = await window.electronAPI.createInvoiceDetail(newInvoiceDetail);
                console.log(invoiceDetailResponse);
              }
          // }
      }
      else{
        alert("Cannot create blank invoice")
      }
  
      // Additional logic to handle success and navigate to the next page if needed
    } catch (error) {
      console.error('Failed to create invoice:', error);
      // Additional logic to handle error
    }
  };

  
  return (
    <div className="create-invoice-with-client-id">
      <h2 className="create-invoice-with-client-id__title">Create Invoice</h2>
      <div className="create-invoice-with-client-id__header">

        <div className="create-invoice-with-client-id__from-address">
            <h2>From:</h2>
            <h3>Apsara ply Centre</h3>
            <p>
              Shop no. 05, 
              Sai Krupa nagar,<br/>
              Opposite Petrol Pump.,
              Dahisar east,<br/>
              Mumbai 400068.    
            </p>
        </div>

        <div className="create-invoice-with-client-id__address">
          <h2>Client:</h2>
          <h3>{companyName}</h3>
          <p>{toAddress}</p>
        </div>
        
        <div className="create-invoice-with-client-id__shipping-address">
          <h2>Shipping Address</h2>
          <textarea 
              className='shipping-address-textarea' 
              value={shippingAddress} 
              onChange={(e) => {setShippingAddress(e.target.value)}}
              >
                {shippingAddress}
          </textarea>
        </div>
        <div className="create-invoice-with-client-id__details">
          <h2>Invoice Details</h2>
          <p>Date:  <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={handleDateChange}
                      />
            </p> 
          <p>Invoice Number: {invoiceNumber}</p>
        </div>
      </div>
      <table className="create-invoice-with-client-id__table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Product</th>
            <th>Description</th>
            <th>HSN Code</th>
            <th>Unit</th>
            <th>Price per Unit</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>
      <button className="create-invoice-with-client-id__add-item-button" onClick={addItem}>
        Add Item
      </button>
      <div className="create-invoice-with-client-id__footer invoice-footer">
        <p>Total: {total.toLocaleString()}</p>
        <p>GST (18%): {Math.round(total * 0.18).toLocaleString()}</p>
        <p>Grand Total: {Math.round(total + total * 0.18).toLocaleString()}</p>
      </div>
      <button className="create-invoice-with-client-id__create-invoice-button" onClick={handleCreateInvoice}>
        Save
      </button>
    </div>
  );
};

export default CreateInvoice;
