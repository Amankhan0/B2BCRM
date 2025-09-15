import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Colors } from "../../../Colors/color";
import signature from "../../..//Image/b2bsignature.jpeg";
import {
  calculateTotalAmountUsingData,
  calculateTotalCGSTAmountUsingData,
  calculateTotalGSTAmountUsingData,
  calculateTotalSGSTAmountUsingData,
  GetFullYear,
  GstCalculation,
  numberToWords,
} from "../../../utils";
import { backIcon } from "../../../SVG/Icons";
import Title from "../../../Component/Title";
import { OrderInvoiceDetails } from "../../OrderInvoiceDetails";
import { useSelector } from "react-redux";
import FileRenderer from "../../../Component/FileRender";

const PIPDF = ({ data, onClickBack }) => {

  const PDFAdsReducer = useSelector(state => state.PDFAdsReducer);


  const headerRef = useRef();
  const customerInfoRef = useRef();
  const totalRef = useRef();
  const termsRef = useRef();
  const signatureRef = useRef();

  const [totalCGSTAmount, setTotalCGSTAmount] = useState(null);
  const [totalSGSTAmount, setTotalSGSTAmount] = useState(null);
  const [totalGSTAmount, setTotalGSTAmount] = useState(null);
  const [totalTaxAmount, setTotalTaxAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  useEffect(() => {
    if (totalAmount === null) {
      var t = calculateTotalAmountUsingData(data?.products);
      if (t) {
        setTotalAmount(t);
      }
    }
    if (totalGSTAmount === null) {
      var g = calculateTotalGSTAmountUsingData(data?.products);
      if (g) {
        setTotalGSTAmount(g);
      }
    }
    if (totalCGSTAmount === null) {
      var c = calculateTotalCGSTAmountUsingData(data?.products);
      setTotalCGSTAmount(c);
    }
    if (totalSGSTAmount === null) {
      var s = calculateTotalSGSTAmountUsingData(data?.products);
      setTotalSGSTAmount(s);
    }
    if (
      totalTaxAmount === null &&
      totalCGSTAmount !== null &&
      totalGSTAmount !== null &&
      totalSGSTAmount !== null &&
      totalAmount !== null
    ) {
      if (data?.customerDetails?.shippingAddress?.state === "Delhi") {
        setTotalTaxAmount(totalAmount + totalGSTAmount);
      } else {
        setTotalTaxAmount(totalAmount + totalCGSTAmount + totalSGSTAmount);
      }
    }
  }, [totalAmount]);

  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const padding = 10;
      let currentY = padding;

      const desiredWidth = 50;
      const logoUrl =
        "https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75";

      // 🟢 Load logo first to get natural aspect ratio
      const loadImageAsBase64 = async (url) => {
        const res = await fetch(url, { mode: "cors" });
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };


      const base64Logo = await loadImageAsBase64(logoUrl);

      const logoImg = new Image();
      logoImg.src = base64Logo;
      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });

      const aspectRatio = logoImg.width / logoImg.height;
      const logoHeight = desiredWidth / aspectRatio;

      // 🟢 Add Logo (fixed stretch issue)
      pdf.addImage(base64Logo, "PNG", padding, currentY - 5, desiredWidth, logoHeight);

      // Company Details
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      currentY += logoHeight + 2;


      pdf.text(`GSTIN: ${data?.ownAddress !== null ? data?.ownAddress?.gstNo : OrderInvoiceDetails.companyDetails.gstNo}`, padding, currentY);
      currentY += 5;
      pdf.text(`CIN: ${data?.ownAddress !== null ? data?.ownAddress?.cin : OrderInvoiceDetails.companyDetails.cin}`, padding, currentY);
      currentY += 5;
      pdf.text(`PAN: ${data?.ownAddress !== null ? data?.ownAddress?.panNo : OrderInvoiceDetails.companyDetails.panNo}`, padding, currentY);

      // Address on Right

      const rightTextY = padding + 2;

      const companyAddress = `${data?.ownAddress !== null ? data?.ownAddress?.address : OrderInvoiceDetails.companyDetails.address.address}, ${data?.ownAddress !== null ? data?.ownAddress?.city : OrderInvoiceDetails.companyDetails.address.city}, ${data?.ownAddress !== null ? data?.ownAddress?.state : OrderInvoiceDetails.companyDetails.address.state} - ${data?.ownAddress !== null ? data?.ownAddress?.pinCode : OrderInvoiceDetails.companyDetails.address.pinCode}, ${data?.ownAddress !== null ? data?.ownAddress?.country : OrderInvoiceDetails.companyDetails.address.country}`;

      const wrappedRightText = pdf.splitTextToSize(companyAddress, 35);
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(wrappedRightText, pageWidth - padding, rightTextY, {
        align: "right",
      });

      // Calculate the height of the wrapped address text
      const addressTextHeight = wrappedRightText.length * 4;

      // Position date and order ref below the address
      
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(67, 42, 119);
      pdf.setFontSize(13);
      pdf.text("Perfoma Invoice", pageWidth - padding, currentY + 1, { align: "right" });
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0,0,0);
      pdf.setFontSize(8);
      const dateY = rightTextY + addressTextHeight + 3;
      pdf.text(
        `Date: ${GetFullYear(Date.now())}`,
        pageWidth - padding,
        currentY + 5,
        { align: "right" }
      );
      pdf.text(
        `${data?.poRefNo ? "PO" : "Order"} Ref No: ${data?.poRefNo || data?.orderRefNo
        }`,
        pageWidth - padding,
        currentY+10,
        { align: "right" }
      );

      // Update currentY to account for the right side content
      const rightSideHeight = addressTextHeight + 15;
      currentY = Math.max(currentY, rightTextY + rightSideHeight);
      // Divider
      currentY += 10;
      pdf.setDrawColor(67, 42, 119);
      pdf.setLineWidth(0.5);
      pdf.line(padding, currentY, pageWidth - padding, currentY);
      currentY += 5;
      // currentY += 8;
      // Billing & Shipping Addresses
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10); // 👈 yaha bada font size
      pdf.setTextColor(67, 42, 119);
      pdf.text("Billing Address", padding, currentY);
      pdf.text("Shipping Address", pageWidth / 2 + 5, currentY);

      currentY += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);

      // Billing address - break down into multiple lines for better wrapping
      const billingRaw = [
        `Company Name: ${data.customerDetails.companyName}`,
        `Customer Name: ${data.customerDetails.name}`,
        `Contact: ${data.customerDetails.contact}`,
        `Email: ${data.customerDetails.email}`,
        `Address: ${data.customerDetails.billingAddress.address}`,
        `${data.customerDetails.billingAddress.city}, ${data.customerDetails.billingAddress.state} - ${data.customerDetails.billingAddress.pinCode}`,
        `GST No: ${data.customerDetails.gstNo}`,
      ];

      // Process billing lines to handle wrapping
      const billingLines = [];
      billingRaw.forEach(line => {
        const wrapped = pdf.splitTextToSize(line, pageWidth / 2 - 15);
        billingLines.push(...wrapped);
      });

      // Shipping address - break down and wrap properly
      const shippingRaw = [
        `Company Name: ${data.customerDetails.companyName}`,
        `Address: ${data.customerDetails.shippingAddress.address}`,
        `${data.customerDetails.shippingAddress.city}, ${data.customerDetails.shippingAddress.state} - ${data.customerDetails.shippingAddress.pinCode}`,
        `Landmark: ${data.customerDetails.shippingAddress.landmark}`
      ];

      // Process shipping lines to handle wrapping
      const shippingLines = [];
      shippingRaw.forEach(line => {
        const wrapped = pdf.splitTextToSize(line, pageWidth / 2 - 15);
        shippingLines.push(...wrapped);
      });

      const maxLines = Math.max(billingLines.length, shippingLines.length);

      for (let i = 0; i < maxLines; i++) {
        const y = currentY + i * 4;
        if (billingLines[i]) pdf.text(billingLines[i], padding, y);
        if (shippingLines[i]) pdf.text(shippingLines[i], pageWidth / 2 + 5, y);
      }

      currentY += maxLines * 4 + 5;

      // Supplier Details - only show if supplier details exist
      if (data.supplierDetails) {
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(67, 42, 119);
        pdf.text("Supplier Details", padding, currentY);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        currentY += 5;

        pdf.text(`Company Name: ${data.supplierDetails.companyName}`, padding, currentY);
        currentY += 5;

        const supplierAddress = `${data.supplierDetails.gstAddresses.address}, ${data.supplierDetails.gstAddresses.state}`;
        const wrappedSupplierAddress = pdf.splitTextToSize(supplierAddress, 150);
        pdf.text(wrappedSupplierAddress, padding, currentY);
        currentY += wrappedSupplierAddress.length * 5;

        const supplierCityLine = `${data.supplierDetails.gstAddresses.city} - ${data.supplierDetails.gstAddresses.pinCode}, ${data.supplierDetails.gstAddresses.landmark}`;
        pdf.text(supplierCityLine, padding, currentY);
        currentY += 5;
        pdf.text(`GST No: ${data.supplierDetails.gstNo}`, padding, currentY);
        currentY += 7;

        pdf.line(padding, currentY, pageWidth - padding, currentY);
        currentY += 5;
      }

      // Product Table - Show GST column with separate Product and Variant columns
      const headRow = [["Product", "Variant", "Unit", "Qty", "Rate", "GST (%)", "Amount"]];

      const body = data.products.map((ele) => {
        const baseAmount = Number(ele.price) * Number(ele.qty);

        const gst = GstCalculation(baseAmount, ele.productVarient.gst).toFixed(2);
        return [
          ele.product_id.productName,
          ele.productVarient.varientName,
          ele.productVarient.varientUnit,
          ele.qty,
          ele.price,
          `${gst} (${ele.productVarient.gst}%)`,
          baseAmount.toFixed(2),
        ];
      });

      pdf.autoTable({
        startY: currentY,
        head: headRow,
        body,
        theme: "grid",
        headStyles: {
          fillColor: Colors.ThemeBlue,
          textColor: "#fff",
          fontSize: 9,
        },
        bodyStyles: { fontSize: 8 },
      });

      // Increased spacing under the table
      currentY = pdf.lastAutoTable.finalY + 15; // Changed from 5 to 15

      // Totals - Show GST instead of CGST and SGST
      pdf.setFontSize(10);
      const totals = [
        `Total Amount: ${totalAmount.toFixed(2)}`,
        `Total GST: ${totalGSTAmount.toFixed(2)}`,
        `Total Taxable Amount: ${totalTaxAmount.toFixed(2)} (${numberToWords(
          totalTaxAmount.toFixed(2)
        )})`,
      ];

      totals.forEach((line, i) => {
        pdf.text(line, padding, currentY + i * 6);
      });

      currentY += totals.length * 6;

      // Terms & Conditions
      const termsText = termsRef.current.innerText.split("\n").map((line) => [line]);
      pdf.autoTable({
        startY: currentY,
        body: termsText,
        theme: "plain",
        styles: { fontSize: 8, cellPadding: 1 },
        margin: { left: 10, right: 10 },
      });

      currentY = pdf.lastAutoTable.finalY + 10;

      // Signature
      pdf.text("Thanking you,", padding, currentY);
      pdf.text("Best Regards", padding, currentY + 5);
      pdf.text(`${data.regards.name}`, padding, currentY + 10);
      pdf.text(`${data.regards.contact}`, padding, currentY + 15);
      pdf.addImage(signature, "PNG", pageWidth - 60, currentY, 40, 40);

      pdf.addPage();

      const imgElement = document.querySelector("#file-renderer-image img");

      if (imgElement && imgElement.src) {
        try {
          let base64Img;

          // Check if img.src is already a base64 data URI
          if (imgElement.src.startsWith("data:image")) {
            base64Img = imgElement.src; // Already base64
          } else {
            // It's a URL, so fetch and convert to base64
            const toBase64 = async (url) => {
              const res = await fetch(url, { mode: 'cors' });
              const blob = await res.blob();
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            };

            base64Img = await toBase64(imgElement.src);
          }

          // Detect format
          const format = base64Img.includes("image/jpeg")
            ? "JPEG"
            : base64Img.includes("image/png")
              ? "PNG"
              : "PNG"; // default fallback

          // Load into Image to get size
          const tempImg = new Image();
          tempImg.crossOrigin = "Anonymous";
          tempImg.src = base64Img;

          await new Promise((resolve, reject) => {
            tempImg.onload = resolve;
            tempImg.onerror = reject;
          });

          const imgWidth = tempImg.naturalWidth;
          const imgHeight = tempImg.naturalHeight;

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const padding = 20;

          const maxWidth = pageWidth - 2 * padding;
          const maxHeight = pageHeight - 2 * padding;

          const aspectRatio = imgWidth / imgHeight;

          let displayWidth = maxWidth;
          let displayHeight = displayWidth / aspectRatio;

          if (displayHeight > maxHeight) {
            displayHeight = maxHeight;
            displayWidth = displayHeight * aspectRatio;
          }

          const x = (pageWidth - displayWidth) / 2;
          const y = (pageHeight - displayHeight) / 2;

          pdf.addImage(base64Img, format, x, y, displayWidth, displayHeight);
        } catch (error) {
          console.error("Error loading image for PDF:", error);
        }
      }

      // Save the PDF with new filename
      pdf.save("ProformaInvoice.pdf");

    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };


  // Helper: Convert image to base64
  const loadImageToBase64 = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.src = url;
    });

  console.log("data", data);

  const calculateTotal = (products, type) => {
    if (type === "taxamount") {
      return products.reduce((total, product) => {
        const productTotal = Number(product.price) * Number(product.qty);
        return total + productTotal;
      }, 0);
    } else if (type === "cgst") {
      return products.reduce((total, product) => {
        const productTotal = Number(product.cgst);
        return total + productTotal;
      }, 0);
    } else if (type === "sgst") {
      return products.reduce((total, product) => {
        const productTotal = Number(product.sgst);
        return total + productTotal;
      }, 0);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4" onClick={onClickBack}>
        <p>{backIcon}</p>
        <Title title={"Back"} size={"md"} />
      </div>
      <div
        className="quotation-container"
        style={{
          padding: 20,
          maxWidth: 800,
          margin: "auto",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="grid grid-cols-2 gap-6 p-2 py-5"
          style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}
        >
          <div>
            <img
              className="w-1/2"
              src="https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75"
            />
            <p className="text-xs p-0.5 mt-3">
              GSTIN : {data?.ownAddress !== null ? data?.ownAddress?.gstNo : OrderInvoiceDetails.companyDetails.gstNo}
            </p>
            <p className="text-xs p-0.5">
              CIN : {data?.ownAddress !== null ? data?.ownAddress?.cin : OrderInvoiceDetails.companyDetails.cin}
            </p>
            <p className="text-xs p-0.5">
              PAN : {data?.ownAddress !== null ? data?.ownAddress?.panNo : OrderInvoiceDetails.companyDetails.panNo}
            </p>
          </div>
          <div className="flex justify-end text-right">
            <div>
              <h3 style={{ color: Colors.ThemeBlue }}>Proforma Invoice</h3>
              <p className="text-xs p-0.5">
                Order Ref No: <b>{data?.orderRefNo}</b>
              </p>
              <p className="text-xs p-0.5">
                Date: <b>{GetFullYear(Date.now())}</b>
              </p>
              <p className="text-xs p-0.5">
                Terms of Payment: :{" "}
                <b>
                  {data.paymentTerm.type}{" "}
                  {data.paymentTerm.days !== null &&
                    data.paymentTerm.days + " days"}
                </b>
              </p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div
          ref={customerInfoRef}
          className="p-2 py-5"
          style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}
        >
          <div className="grid grid-cols-2">
            <div>
              <h3 style={{ color: Colors.ThemeBlue }}>Billing Address</h3>
              <p className="text-xs p-0.5">
                Company Name : {data?.customerDetails?.companyName || "-"}
              </p>
              <p className="text-xs p-0.5">
                Customer Name : {data?.customerDetails?.name}
              </p>
              <p className="text-xs p-0.5">
                Customer Contact : {data?.customerDetails?.contact}
              </p>
              <p className="text-xs p-0.5">
                Address :{" "}
                {data?.customerDetails?.billingAddress?.address || "-"}
              </p>
              <p className="text-xs p-0.5">
                {data?.customerDetails?.billingAddress?.city +
                  " " +
                  data?.customerDetails?.billingAddress?.landmark || "-"}
              </p>
              <p className="text-xs p-0.5">
                {data?.customerDetails?.billingAddress?.state +
                  " " +
                  data?.customerDetails?.billingAddress?.pinCode || "-"}
              </p>
              <p className="text-xs p-0.5">
                GSTIN : {data?.customerDetails?.gstNo}
              </p>
            </div>
            <div>
              <h3 style={{ color: Colors.ThemeBlue }}>Shipping Address</h3>
              <p className="text-xs p-0.5">
                Company Name : {data?.customerDetails?.companyName || "-"}
              </p>
              <p className="text-xs p-0.5">
                Address :{" "}
                {data?.customerDetails?.shippingAddress?.address || "-"}
              </p>
              <p className="text-xs p-0.5">
                {data?.customerDetails?.shippingAddress?.city +
                  " " +
                  data?.customerDetails?.shippingAddress?.landmark || "-"}
              </p>
              <p className="text-xs p-0.5">
                {data?.customerDetails?.shippingAddress?.state +
                  " " +
                  data?.customerDetails?.shippingAddress?.pinCode || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: Colors.ThemeBlue,
                color: "#fff",
                textAlign: "left",
              }}
            >
              <th style={{ padding: 8, border: "1px solid #ddd" }}>
                Product
              </th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Variant</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Unit</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Qty</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Rate</th>
              {data.customerDetails?.shippingAddress?.state === "Delhi" ? (
                <th style={{ padding: 8, border: "1px solid #ddd" }}>
                  GST Amount (%)
                </th>
              ) : (
                <>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    CGST Amount (%)
                  </th>
                  <th style={{ padding: 8, border: "1px solid #ddd" }}>
                    SGST Amount (%)
                  </th>
                </>
              )}
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data?.products?.map((ele, i) => {
              return (
                <tr>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {ele?.product_id?.productName}
                    {/* {ele?.product_id?.productName +
                      " / " +
                      ele?.productVarient?.varientName +
                      ele?.productVarient?.varientUnit} */}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {ele?.productVarient?.varientName}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {ele?.productVarient?.varientUnit}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {ele?.qty}
                  </td>
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {ele?.price}
                  </td>
                  {data.customerDetails?.shippingAddress?.state === "Delhi" ? (
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>
                      {GstCalculation(
                        Number(ele?.price) * Number(ele.qty),
                        Number(ele?.productVarient?.gst)
                      )?.toFixed(2)}{" "}
                      ({ele?.productVarient?.gst}%)
                    </td>
                  ) : (
                    <>
                      <td style={{ padding: 8, border: "1px solid #ddd" }}>
                        {GstCalculation(
                          Number(ele?.price) * Number(ele.qty),
                          Number(ele?.productVarient?.gst) / 2
                        )?.toFixed(2)}{" "}
                        ({ele?.productVarient?.gst / 2}%)
                      </td>
                      <td style={{ padding: 8, border: "1px solid #ddd" }}>
                        {GstCalculation(
                          Number(ele?.price) * Number(ele.qty),
                          Number(ele?.productVarient?.gst) / 2
                        )?.toFixed(2)}{" "}
                        ({ele?.productVarient?.gst / 2}%)
                      </td>
                    </>
                  )}
                  <td style={{ padding: 8, border: "1px solid #ddd" }}>
                    {(Number(ele?.price) * Number(ele.qty))?.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total Calculation - Capture it as an image */}
        <div
          ref={totalRef}
          style={{
            marginTop: 20,
            textAlign: "right",
            padding: "10px 20px",
            backgroundColor: "#f8f8f8",
            border: "1px solid #eee",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ margin: 0 }}>
            Total Amount:{" "}
            <span style={{ fontWeight: "bold" }}>₹{totalAmount}</span>
          </h3>
          {data?.customerDetails?.shippingAddress?.state === "Delhi" ? (
            <h3 style={{ margin: 0 }}>
              Total GST:{" "}
              <span style={{ fontWeight: "bold" }}>
                ₹{totalGSTAmount?.toFixed(2)}
              </span>
            </h3>
          ) : (
            <>
              <h3 style={{ margin: 0 }}>
                Total CGST:{" "}
                <span style={{ fontWeight: "bold" }}>
                  ₹{totalCGSTAmount?.toFixed(2)}
                </span>
              </h3>
              <h3 style={{ margin: 0 }}>
                Total SGST:{" "}
                <span style={{ fontWeight: "bold" }}>
                  ₹{totalSGSTAmount?.toFixed(2)}
                </span>
              </h3>
            </>
          )}
          <h3 style={{ margin: 0 }}>
            Total Taxable Amount:{" "}
            <span style={{ fontWeight: "bold" }}>
              ₹{totalTaxAmount?.toFixed(2)} (
              {numberToWords(totalTaxAmount?.toFixed(2))})
            </span>
          </h3>
        </div>

        {/* Terms & Notes */}
        <div
          ref={termsRef}
          style={{
            marginTop: 20,
            padding: "10px 15px",
            border: "1px solid #f0f0f0",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ color: Colors.ThemeBlue, marginBottom: 10 }}>
            Terms & Conditions
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html: data.termsAndConditions
                .replace(/<p><br><\/p>/g, "") // Empty <p><br></p> hatao
                .replace(/<br\s*\/?>/g, ""), // Extra <br> hatao
            }}
          />
        </div>

        {/* Signature - will be captured separately */}
        <div ref={signatureRef} className="mt-20 px-20 flex justify-between">
          <div>
            <h4 className="text-black font-bold">Thanking you,</h4>
            <p className="text-xs p-0.5">Best Regards</p>
            <p>{data?.regards?.name}</p>
            <p>+91 {data?.regards?.contact}</p>
          </div>

          <div>
            <p className="text-xs p-0.5 mb-5">Authorized Signature</p>
            <img src={signature} alt="Signature" style={{ width: 150 }} />
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadPDF}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: Colors.ThemeBlue,
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
      <div style={{ display: "none" }}>
        <div id="file-renderer-image">
          <div className="grid grid-cols-3">
            {
              PDFAdsReducer?.doc !== null &&
              PDFAdsReducer?.doc?.map((ele, i) => {
                return (
                  <FileRenderer fileId={ele?._id} />
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PIPDF;
