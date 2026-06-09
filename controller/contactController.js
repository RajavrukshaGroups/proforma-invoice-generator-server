import "dotenv/config";
import nodemailer from "nodemailer";
import Contact from "../model/Contact.js"


const sendMail = async (req, res) => {
  const { name, phone, email, company, website, service } = req.body;
  

  if (!name || !phone || !email) {
    return res.status(400).json({
      success: false,
      message: "name,phone and email are required fields",
    });
  }

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be exactly 10 digits",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format.",
    });
  }

  try {
    // SAVE TO DATABASE FIRST
    await Contact.create({
      name,
      phone,
      email,
      company,
      website,
      service
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.DIGITAL_ELITE_MAIL,
        pass: process.env.DIGITAL_ELITE_PASS,

        //  user: "digitaleliteservices2025@gmail.com",
        // pass: "pkct lgyk omkd lleo",
      },
    });

    const mailOptions = {
     from: `"DIGITAL ELITE CONTACT" <${process.env.DIGITAL_ELITE_MAIL}>`,
      to: process.env.DIGITAL_ELITE_MAIL,
      subject: `New Contact Request from ${name}`,
      html: `
      <h3>New Contact Form Submission(Web Lead)</h3>
      <p><strong>Name:</strong>${name}</p>
      <p><strong>Email:</strong>${email}</p>
      <p><strong>Phone:</strong>${phone}</p>
      <p><strong>Company:</strong>${company || "N/A"}</p>
      <p><strong>Website:</strong>${website || "N/A"}</p>
      <p><strong>Preferred Service:</strong> ${service}</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Mail sent successfully" });
  } catch (err) {
    console.error("email error:", err);
    res.status(500).json({ success: false, message: "Mail sending failed" });
  }
};

export default {
  sendMail,
};
