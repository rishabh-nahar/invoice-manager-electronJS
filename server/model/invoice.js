const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  gst: {
    type: String,
    required: true,
  },
  products: {
    type: [productSchema],
    required: true,
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
