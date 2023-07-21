import React, { createElement, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../assets/logo/text.png' 
import leftLogo from '../assets/logo/logo.png' 
import html2pdf from 'html2pdf.js';
import Productdetailstable from '../components/productdetailstable';

const InvoiceDetailPage = () => {
    const { invoiceNumber } = useParams();

    const pdfExportComponent = useRef(null);

    const [date, setDate] = useState();
    const [fromAddress, setFromAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientMail, setClientMail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyContact, setCompanyContact] = useState('');
    const [companyGST, setCompanyGST] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [invoiceDetails, setInvoiceDetails] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [pages, setPages] = useState(0);

    const [saveToPdfBttnText , setSaveToPdfBttnText] = useState('Export to pdf')

    // ===================== Get data from invoice number =====================
    useEffect(() => {
        async function fetchData() {
            const invoiceData = await window.electronAPI.getInvoiceByInvNumber(invoiceNumber);
            const clientData = await window.electronAPI.getClientById(invoiceData.client_id);
            const detailedInvoiceData = await window.electronAPI.getInvoiceDetailsByInvoiceId(invoiceNumber)
            
            setDate(invoiceData.date);
            setTotalAmount(invoiceData.total)
            setGrandTotal(invoiceData.grand_total)
            setShippingAddress(invoiceData.shipping_address);
            setClientName(clientData.clientName)
            setClientMail(clientData.email)
            setCompanyName(clientData.companyName)
            setCompanyGST(clientData.gstNo)
            setCompanyContact(clientData.contact)
            setToAddress(`${clientData.address}\n${clientData.address_line2}`);
            setFromAddress("Shop No. 05, \nSai Krupa Nagar,\nDahisar (East), \nMumbai 400068");
            setInvoiceDetails(detailedInvoiceData);
            const totalPages = Math.floor(detailedInvoiceData.length / 8) + 1;
            setPages(totalPages)
        }
        fetchData();
        

    }, []);


    function saveAsPDF() {
        setSaveToPdfBttnText('Processing...')
        const pageElements = pdfExportComponent.current;
        const options = {
            filename: `${invoiceNumber}-${companyName}-${date}.pdf`,
            margin: 4.5,
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true, // Enable PDF compression
                precision: 100, // Increase precision for high resolution
            },
            html2canvas: {
                letterRendering: true, // Enable letter rendering for better text selection
                scale: 10, // Increase scale for higher resolution
                useCORS: true, // Enable cross-origin resource sharing for external images
            },
            pagebreak: { mode: 'avoid-all', before: '#pdfContent' },
            output: 'save', // Specify the output mode as 'save'
            outputName: `${invoiceNumber}-${companyName}-${date}.pdf`, // Set the output file name
            outputSavePath: 'D:/Rishabh/InvoiceManager/setup/invoice-manager'
            };

        const pdf = html2pdf().set(options);
        pdf.from(pageElements).save()
        .then(()=>{
            setSaveToPdfBttnText('Export to pdf')
        })
        .catch((error) => {
            console.error(`Error generating PDF for page`, error);
            setSaveToPdfBttnText('Export to pdf')
        });
    }

    let renderPages = (invoiceDetails) =>{
        const renderPages = [];
        for (let i = 1; i <= pages; i++) {
            let startArr = 8 * (i-1);
            let endArr = 8 * (i);
            let pageId = "";
            let newInvData = invoiceDetails.slice(startArr, endArr);
            console.log(invoiceDetails);
            console.log(newInvData);
            if(i !== 1){
                pageId = "pdfContent";
            }
            renderPages.push(
                <div className="invoice-detail" key={startArr+1} id={pageId} >
                    <div className=''>
                        <div className='invoice-detail__self-info invoice-detail__upper-header  '>
                            <div className="invoice-header">
                                <div className='invoice-header__left-logo'>
                                    <img src={leftLogo} />
                                </div>
                                <div className='upper-header-content'>
                                    <div className="invoice-header__logo">
                                        <img src={logo}  alt="Logo" className="invoice-header__logo-image" />
                                    </div>
                                    <div className="invoice-header__product-details">
                                        <strong>
                                        Plywood, Timber, Laminates,Adhesives,Veneers,Bison Panel,ACP
                                        </strong>
                                    </div>

                                    <div className="invoice-header__address">
                                        <p className="invoice-detail__address-content">{fromAddress}</p>
                                    </div>
                                    <div>
                                        <p>Email: apsaraplycentre@gmail.com | Tel: 022-28281637/022-8977637</p>
                                    </div>
                                    <div className="invoice-header__gst-number">
                                        <p className="invoice-header__gst-number-text"><strong>GST Number: 27AABPJ4683M1ZB</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='invoice-detail__bottom-header-container'> 
                            <div className='invoice-detail__party-detail-container'>
                                <strong>Party details:</strong>
                                <div>
                                    <div><strong>{companyName}</strong></div>
                                    <p className='invoice-detail__party-detail-container__address'>{toAddress}</p>
                                </div>
                                
                                <div>
                                    <strong>Shipping Address:</strong>
                                    <p className='invoice-detail__party-detail-container__address'>{toAddress}</p>
                                </div>

                                <div className='two-column-display'>
                                    <span>
                                        <strong>Contact Details: </strong>
                                        <span>{companyContact}</span>
                                    </span>
                                    <span>
                                        <strong>GST No.: </strong>
                                        <span>{companyGST}</span>
                                    </span>
                                </div>
                                
                            </div>

                            <span className='invoice-detail__bottom-header-container__center-line'></span>

                            <div className='invoice-detail-invoice-detail-container'>
                                <span>
                                    <strong>Invoice No.: </strong>
                                    <strong>&nbsp; {invoiceNumber}</strong>
                                </span>
                                <span>
                                    <strong>Date: </strong>
                                    <p>&nbsp; {date}</p>
                                </span>

                            </div>
                        </div>
                    </div>
                    <Productdetailstable start={startArr} invoiceDetails={newInvData} totalAmount={totalAmount} grandTotal={grandTotal} />
                    
                    <table width='100%' className='invoice-detail__amount-detail__table'>
                            
                            <thead>
                                <tr>
                                    <th>Taxable Amount</th>
                                    <th>SGST(9%)</th>
                                    <th>CGST(9%)</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                                <tbody>
                                    <tr>
                                        <td className='text-right'> &#8377; {totalAmount.toLocaleString()}</td>
                                        <td className='text-right'> &#8377; {Math.round(totalAmount * 0.09).toLocaleString()}</td>
                                        <td className='text-right'> &#8377; {Math.round(totalAmount * 0.09).toLocaleString()}</td>
                                        <td className='text-right'> &#8377; {grandTotal.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                        </table>
                    <div className='invoice-detail__bank-detail__container'>

                        <table width='100%' className='invoice-detail__bank-detail__table'>
                            <thead>
                                <tr>
                                    <th>Bank Name</th>
                                    <th>Branch</th>
                                    <th>IFSC Code</th>
                                    <th>Account No.</th>
                                </tr>
                            </thead>
                                <tbody>
                                    <tr>
                                        <td>Saraswat Bank</td>
                                        <td>Dahisar (E)</td>
                                        <td>147505100109576</td>
                                        <td>147505100109576</td>
                                    </tr>
                                </tbody>
                        </table>
                        <div className='invoice-detail__terms-and-conditions-container'>
                                    
                            <table className='invoice-detail__terms-and-conditions-table'>
                                <thead>
                                    <tr>
                                        <th colSpan={1}>Terms and Condition</th>
                                        <th width="200px">Receiver's Signature</th>
                                        <th width="200px">For Apsara Ply Centre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={1}>
                                            <ol className='terms-and-condition-list'>
                                                <li>Goods once Sold will not be taken back.</li>
                                                <li>Interest will be charged @24%p.a. if bill not paid within due date.</li>
                                                <li>Cheque Return charges Rs.500/-</li>
                                                <li>Subject to Mumbai Jurisdiction only</li>
                                            </ol>
                                        </td>
                                        <td>

                                        </td>
                                        <td>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            )
        }
        return renderPages

    }
    

    return (
        <>  
            <div className='invoice-detail-container'>
                <div className='pages' ref={pdfExportComponent} >
                        {renderPages(invoiceDetails)}
                </div>

                <div>
                    <div className='invoice-detail__invoive-overall-info-container'>
                            <table className='invoice-detail__invoive-overall-info-table'>
                                <tbody>
                                    <tr>
                                        <th>Invoice No.</th>
                                        <td>{invoiceNumber}</td>
                                    </tr>
                                    <tr>
                                        <th>Total Pages</th>
                                        <td>{pages}</td>
                                    </tr>
                                    <tr>
                                        <th>Invoice Date</th>
                                        <td>{date}</td>
                                    </tr>
                                    <tr>
                                        <th>Client Name</th>
                                        <td>{clientName}</td>
                                    </tr>
                                    <tr>
                                        <th>Company Name</th>
                                        <td>{companyName}</td>
                                    </tr>
                                    <tr>
                                        <th>Client Mail Id</th>
                                        <td>{clientMail}</td>
                                    </tr>
                                    <tr>
                                        <th>Client Contact</th>
                                        <td>{companyContact}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='invoice-detail__create-pdf-bttn-container'>
                                <button className='invoice-detail__create-pdf-bttn' onClick={saveAsPDF}>{saveToPdfBttnText}</button>
                            </div>
                    </div>
                </div>

            </div>

        </>
    );
};

export default InvoiceDetailPage;
