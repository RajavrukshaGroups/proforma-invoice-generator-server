import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    invoiceDate: String,
    dueDate: String,

    customer: {
      customerName: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      gstin: String,
      pan: String,
    },

    gstMode: String,
    paymentStatus: { type: String, default: 'Pending' },
    paidPercentage: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentMode: { type: String, default: '' },
    transactionId: { type: String, default: '' },

    installments: [
      {
        installmentNumber: Number,
        amount: Number,
        paymentMode: String,
        transactionId: String,
        date: String,
      },
    ],

    items: [
      {
        description: String,
        timeFrame: Number,
        timeFrameUnit: String,
        amount: Number,
      },
    ],

    subtotal: Number,
    cgst: Number,
    sgst: Number,
    grandTotal: Number,
    amountInWords: String,

    terms: [String],

    company: {
      type: Object,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const ProformaInvoice = mongoose.model(
  "ProformaInvoice",
  InvoiceSchema
);

export default ProformaInvoice;
