import "dotenv/config";
import ProformaInvoice from "../model/ProformaInvoice.js";
import Settings from "../model/Settings.js";

import {
  appendInvoiceToSheet,
  updateInvoiceInSheet,
  deleteInvoiceFromSheet,
} from "../utils/googlesheet.js";

/* =========================================================
   CREATE PROFORMA INVOICE
========================================================= */

const createPI = async (req, res) => {
  try {
    // Get logged-in user's ID from auth middleware or request body
    const createdBy = req.user?._id || req.user?.id || req.body?.createdBy;

    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: "User authentication required (createdBy is missing)",
      });
    }

    // Create PI with logged-in user ID
    const invoice = await ProformaInvoice.create({
      ...req.body,
      createdBy,
    });

    // Populate createdBy details before returning
    await invoice.populate("createdBy", "name email");

    // Save invoice in Google Sheet
    try {
      await appendInvoiceToSheet(invoice);
    } catch (sheetError) {
      console.error("Google Sheet Error:", sheetError);
    }

    return res.status(201).json({
      success: true,
      data: invoice,
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Create PI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE PROFORMA INVOICE
========================================================= */

const getPI = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const invoice = await ProformaInvoice.findById(id)
      .populate("createdBy", "name email")
      .lean();

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Get PI Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
      error: error.message,
    });
  }
};


/* =========================================================
   GET ALL PROFORMA INVOICES
========================================================= */

const getAllPI = async (req, res) => {
  try {
    const invoices = await ProformaInvoice.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error("Get All PI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   DELETE PROFORMA INVOICE
========================================================= */

const deletePI = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const deleted = await ProformaInvoice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Sync delete to Google Sheet
    try {
      if (deleted.invoiceNumber) {
        await deleteInvoiceFromSheet(deleted.invoiceNumber);
      }
    } catch (sheetError) {
      console.error("Google Sheet Delete Error:", sheetError);
    }

    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete PI Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   UPDATE PROFORMA INVOICE
========================================================= */

const updatePI = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const originalInvoice = await ProformaInvoice.findById(id);

    if (!originalInvoice) {
      return res.status(404).json({
        success: false,
        message: "Proforma Invoice not found",
      });
    }

    // Preserve original createdBy if already present, or use current user / body
    const createdBy =
      originalInvoice.createdBy ||
      req.user?._id ||
      req.user?.id ||
      req.body?.createdBy;

    const updateData = {
      ...req.body,
      ...(createdBy ? { createdBy } : {}),
    };

    const updatedPI = await ProformaInvoice.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdBy", "name email");

    if (!updatedPI) {
      return res.status(404).json({
        success: false,
        message: "Proforma Invoice not found",
      });
    }

    // Sync update to Google Sheet
    try {
      await updateInvoiceInSheet(
        updatedPI,
        originalInvoice.invoiceNumber
      );
    } catch (sheetError) {
      console.error("Google Sheet Update Error:", sheetError);
    }

    return res.status(200).json({
      success: true,
      message: "Proforma Invoice updated successfully",
      data: updatedPI,
    });
  } catch (error) {
    console.error("Update PI Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while updating Proforma Invoice",
      error: error.message,
    });
  }
};


/* =========================================================
   SAVE SETTINGS
========================================================= */

const saveSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Save Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   GET SETTINGS
========================================================= */

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================================
   EXPORT
========================================================= */

export default {
  createPI,
  getPI,
  getAllPI,
  deletePI,
  updatePI,
  saveSettings,
  getSettings,
};
