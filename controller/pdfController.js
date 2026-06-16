// import puppeteer from "puppeteer";

// const generatePDF = async (req, res) => {
//   try {
//     const { html, filename } = req.body;

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     await page.setViewport({
//       width: 794,
//       height: 1123,
//       deviceScaleFactor: 2,
//     });

//     await page.setContent(html, {
//       waitUntil: "networkidle0",
//     });

//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       preferCSSPageSize: true,
//       margin: {
//         top: "0",
//         right: "0",
//         bottom: "0",
//         left: "0",
//       },
//     });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename="${filename}.pdf"`,
//       "Content-Length": pdf.length,
//     });

//     return res.send(pdf);
//   } catch (error) {
//     console.error("PDF Generation Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export default {
//   generatePDF,
// };

import puppeteer from "puppeteer";

const generatePDF = async (req, res) => {
  let browser;

  try {
    const { html, filename = "invoice" } = req.body;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });

    await page.setContent(html, {
      waitUntil: [
        "load",
        "domcontentloaded",
        "networkidle0",
      ],
    });

    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }
    });

    await page.evaluate(async () => {
      const images = Array.from(document.images);

      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Content-Length": pdf.length,
    });

    res.send(pdf);
  } catch (error) {
    console.error("PDF Generation Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default {
  generatePDF,
};