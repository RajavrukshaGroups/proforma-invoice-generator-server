// import mongoose from "mongoose";

// const InvoiceSchema = new mongoose.Schema(
//   {
//     invoiceNumber: String,
//     invoiceDate: String,
//     dueDate: String,

//     customer: {
//       customerName: String,
//       address: String,
//       city: String,
//       state: String,
//       pincode: String,
//       gstin: String,
//       pan: String,
//     },

//     gstMode: String,
//     paymentStatus: { type: String, default: 'Pending' },
//     paidPercentage: { type: Number, default: 0 },
//     paidAmount: { type: Number, default: 0 },
//     paymentMode: { type: String, default: '' },
//     transactionId: { type: String, default: '' },

//     installments: [
//       {
//         installmentNumber: Number,
//         amount: Number,
//         paymentMode: String,
//         transactionId: String,
//         date: String,
//       },
//     ],

//     items: [
//       {
//         description: String,
//         timeFrame: Number,
//         timeFrameUnit: String,
//         amount: Number,
//       },
//     ],

//     subtotal: Number,
//     cgst: Number,
//     sgst: Number,
//     grandTotal: Number,
//     amountInWords: String,

//     terms: [String],

//     company: {
//       type: Object,
//     },
//   },
//   {
//     timestamps: true,
//     strict: false,
//   }
// );

// const ProformaInvoice = mongoose.model(
//   "ProformaInvoice",
//   InvoiceSchema
// );

// export default ProformaInvoice;
import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
    },

    invoiceDate: {
      type: String,
    },

    dueDate: {
      type: String,
    },

    // User who created this Proforma Invoice
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      customerName: {
        type: String,
      },
      address: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
      gstin: {
        type: String,
      },
      pan: {
        type: String,
      },
    },

    gstMode: {
      type: String,
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    paidPercentage: {
      type: Number,
      default: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    paymentMode: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
    },

    installments: [
      {
        installmentNumber: {
          type: Number,
        },
        amount: {
          type: Number,
        },
        paymentMode: {
          type: String,
        },
        transactionId: {
          type: String,
        },
        date: {
          type: String,
        },
      },
    ],

    items: [
      {
        description: {
          type: String,
        },
        timeFrame: {
          type: Number,
        },
        timeFrameUnit: {
          type: String,
        },
        amount: {
          type: Number,
        },
      },
    ],

    subtotal: {
      type: Number,
    },

    cgst: {
      type: Number,
    },

    sgst: {
      type: Number,
    },

    grandTotal: {
      type: Number,
    },

    amountInWords: {
      type: String,
    },

    terms: [
      {
        type: String,
      },
    ],

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