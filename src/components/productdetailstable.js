import React from 'react'

function Productdetailstable({invoiceDetails, totalAmount, grandTotal , start}) {
  return (
        <div>
            <table className="invoice-detail__table" width="100%" >
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Product</th>
                        <th>HSN Code</th>
                        <th>Unit</th>
                        <th>Price per Unit</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceDetails.map((detail, index) => {
                    if(index < 8){
                    return (
                        <tr key={start+index}>
                            <td>
                                {start + index +1 }
                            </td>
                            <td>
                                <span>
                                    <strong className='product-title'>{detail.product}</strong> &nbsp; 
                                    <p className='product-desc'>{detail.description}</p>
                                </span>
                            </td>
                            <td>{detail.hsn_code}</td>
                            <td>{detail.unit}</td>
                            <td>&#8377; {(detail.price_per_unit).toLocaleString()}</td>
                            <td>{detail.quantity}</td>
                            <td>&#8377; {(detail.total_price).toLocaleString()}</td>
                        </tr>
                    )}}
                    )}
                    <tr>
                        <td className='text-right' colSpan={6}><strong>Taxable Amount</strong></td>
                        <td>&#8377; {totalAmount.toLocaleString()}</td>
                    </tr>
                    {/* <tr>
                        <td className='text-right' colSpan={6}><strong>SGST (9%)</strong></td>
                        <td>&#8377; {(Math.round(totalAmount * 0.09)).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td className='text-right' colSpan={6}><strong>CGST (9%)</strong></td>
                        <td>&#8377; {(Math.round(totalAmount * 0.09)).toLocaleString()}</td>
                    </tr>
                    <tr> 
                        <td className='text-right' colSpan={6}><strong>Total</strong></td>
                        <td>&#8377; {grandTotal.toLocaleString()}</td>
                    </tr> */}
                </tbody>
            </table>
        </div>
  )
}

export default Productdetailstable