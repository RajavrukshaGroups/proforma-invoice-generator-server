// import { GoogleSpreadsheet } from "google-spreadsheet";
// import { JWT } from "google-auth-library";

// console.log("EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
// console.log("SHEET ID:", process.env.GOOGLE_SHEET_ID);
// console.log("PRIVATE KEY EXISTS:", !!process.env.GOOGLE_PRIVATE_KEY);

// const serviceAccountAuth = new JWT({
//   email: process.env.GOOGLE_CLIENT_EMAIL,
//   key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const doc = new GoogleSpreadsheet(
//   process.env.GOOGLE_SHEET_ID,
//   serviceAccountAuth
// );

// export const appendInvoiceToSheet = async (invoice) => {
//   await doc.loadInfo();

//   const sheet = doc.sheetsByIndex[0];

//   await sheet.addRow({
//     invoiceNumber: invoice.invoiceNumber || "",
//     customerName: invoice.customer?.customerName || "",
//     address: invoice.customer?.address || "",
//     gstin: invoice.customer?.gstin || "",
//     pan: invoice.customer?.pan || "",
//     subtotal: invoice.subtotal || 0,
//     cgst: invoice.cgst || 0,
//     sgst: invoice.sgst || 0,
//     grandTotal: invoice.grandTotal || 0,
//     invoiceDate: invoice.invoiceDate || "",
//     dueDate: invoice.dueDate || "",
//     paymentStatus: invoice.paymentStatus || "Pending",
//     paidPercentage: invoice.paidPercentage || 0,
//   });
// };

import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

console.log("EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("SHEET ID:", process.env.GOOGLE_SHEET_ID);
console.log("PRIVATE KEY EXISTS:", !!process.env.GOOGLE_PRIVATE_KEY);

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID,
  serviceAccountAuth
);

export const appendInvoiceToSheet = async (invoice) => {
  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    // Build full customer address
    const fullAddress = [
      invoice.customer?.address,
      invoice.customer?.city,
      invoice.customer?.state,
      invoice.customer?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    await sheet.addRow({
      invoiceNumber: invoice.invoiceNumber || "",
      customerName: invoice.customer?.customerName || "",
      address: fullAddress,

      subtotal: invoice.subtotal || 0,
      cgst: invoice.cgst || 0,
      sgst: invoice.sgst || 0,
      grandTotal: invoice.grandTotal || 0,

      invoiceDate: invoice.invoiceDate || "",
      dueDate: invoice.dueDate || "",
    });

    console.log(
      `Invoice ${invoice.invoiceNumber} successfully added to Google Sheet`
    );
  } catch (error) {
    console.error("Error appending invoice to Google Sheet:", error);
    throw error;
  }
};