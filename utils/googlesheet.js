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

export const formatServiceItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) return "";
  return items
    .map((item) => {
      const desc = (item.description || "").trim();
      if (!desc) return null;
      const amt = Number(item.amount);
      if (!isNaN(amt) && amt > 0) {
        return `${desc} (₹${amt.toLocaleString("en-IN")})`;
      }
      return desc;
    })
    .filter(Boolean)
    .join(", ");
};

export const appendInvoiceToSheet = async (invoice) => {
  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    // Ensure header row includes serviceItems
    await sheet.loadHeaderRow();
    if (!sheet.headerValues.includes("serviceItems")) {
      await sheet.setHeaderRow([...sheet.headerValues, "serviceItems"]);
    }

    // Build full customer address
    const fullAddress = [
      invoice.customer?.address,
      invoice.customer?.city,
      invoice.customer?.state,
      invoice.customer?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const formattedServices = formatServiceItems(invoice.items);

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
      serviceItems: formattedServices,
    });

    console.log(
      `Invoice ${invoice.invoiceNumber} successfully added to Google Sheet with service items`
    );
  } catch (error) {
    console.error("Error appending invoice to Google Sheet:", error);
    throw error;
  }
};

export const updateInvoiceInSheet = async (invoice, oldInvoiceNumber) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow();

    if (!sheet.headerValues.includes("serviceItems")) {
      await sheet.setHeaderRow([...sheet.headerValues, "serviceItems"]);
    }

    const rows = await sheet.getRows();
    const targetInvNum = oldInvoiceNumber || invoice.invoiceNumber;

    // Build full customer address
    const fullAddress = [
      invoice.customer?.address,
      invoice.customer?.city,
      invoice.customer?.state,
      invoice.customer?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const formattedServices = formatServiceItems(invoice.items);

    // Find row by invoiceNumber (search from bottom to top for recent entries)
    let targetRow = null;
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].get("invoiceNumber") === targetInvNum) {
        targetRow = rows[i];
        break;
      }
    }

    if (targetRow) {
      targetRow.set("invoiceNumber", invoice.invoiceNumber || "");
      targetRow.set("customerName", invoice.customer?.customerName || "");
      targetRow.set("address", fullAddress);
      targetRow.set("subtotal", invoice.subtotal != null ? invoice.subtotal : 0);
      targetRow.set("cgst", invoice.cgst != null ? invoice.cgst : 0);
      targetRow.set("sgst", invoice.sgst != null ? invoice.sgst : 0);
      targetRow.set("grandTotal", invoice.grandTotal != null ? invoice.grandTotal : 0);
      targetRow.set("invoiceDate", invoice.invoiceDate || "");
      targetRow.set("dueDate", invoice.dueDate || "");
      targetRow.set("serviceItems", formattedServices);

      await targetRow.save();
      console.log(
        `Invoice ${invoice.invoiceNumber} successfully updated in Google Sheet`
      );
    } else {
      // If row not found in sheet, append it
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
        serviceItems: formattedServices,
      });
      console.log(
        `Invoice ${invoice.invoiceNumber} not found in sheet; appended new row`
      );
    }
  } catch (error) {
    console.error("Error updating invoice in Google Sheet:", error);
  }
};

export const deleteInvoiceFromSheet = async (invoiceNumber) => {
  try {
    if (!invoiceNumber) return;
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].get("invoiceNumber") === invoiceNumber) {
        await rows[i].delete();
        console.log(`Invoice ${invoiceNumber} deleted from Google Sheet`);
        break;
      }
    }
  } catch (error) {
    console.error("Error deleting invoice from Google Sheet:", error);
  }
};
