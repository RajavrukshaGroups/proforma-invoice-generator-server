import "dotenv/config";
import ProformaInvoice from "../model/ProformaInvoice.js";
import Settings from "../model/Settings.js";
import { appendInvoiceToSheet } from "../utils/googlesheet.js";

// const createPI = async (req, res) => {
//   try {
//     const invoice = await ProformaInvoice.create(req.body);

//     res.status(201).json({
//       success: true,
//       data: invoice,
//       message: "Invoice created successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


const createPI = async (req, res) => {
  try {
    // Save invoice in MongoDB
    const invoice = await ProformaInvoice.create(req.body);

    // Save invoice in Google Sheet
    try {
      await appendInvoiceToSheet(invoice);
    } catch (sheetError) {
      console.error("Google Sheet Error:", sheetError);
    }

    res.status(201).json({
      success: true,
      data: invoice,
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Create PI Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// const getPI = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const invoice = await ProformaInvoice.findById(id); // ✅ FIXED

//     if (!invoice) {
//       return res.status(404).json({
//         success: false,
//         message: "Invoice not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: invoice,
//     });

//   } catch (e) {
//     console.error("Get PI Error:", e);

//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching invoice",
//       error: e.message,
//     });
//   }
// };
const getPI = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invoice ID is required",
      });
    }

    const invoice = await ProformaInvoice.findById(id).lean();

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

  } catch (e) {
    console.error("Get PI Error:", e);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
      error: e.message,
    });
  }
};

const getAllPI = async (req, res) => {
  try {
    const invoices = await ProformaInvoice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePI = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProformaInvoice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePI = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPI = await ProformaInvoice.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPI) {
      return res.status(404).json({
        success: false,
        message: "Proforma Invoice not found",
      });
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

const saveSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true, // insert if not exists
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find().sort({ createdAt: -1 });

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



export default { createPI, getPI, getAllPI, deletePI, updatePI,saveSettings,getSettings, };