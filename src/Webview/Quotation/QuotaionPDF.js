import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Colors } from "../../Colors/color";
import signature from '../../Image/b2bsignature.jpeg';
import { OrderInvoiceDetails } from "../OrderInvoiceDetails";
import 'jspdf-autotable';
import { calculateTotalAmountUsingData, calculateTotalCGSTAmountUsingData, calculateTotalGSTAmountUsingData, calculateTotalSGSTAmountUsingData, calculateTotalTaxAmountUsingData, GetFullYear, GstCalculation, numberToWords } from "../../utils";

const QuotaionPDF = ({ data }) => {

    const totalRef = useRef(); // Add this reference
    const headerRef = useRef();
    const customerInfoRef = useRef();
    const termsRef = useRef();
    const signatureRef = useRef();

    const [totalCGSTAmount, setTotalCGSTAmount] = useState(null)
    const [totalSGSTAmount, setTotalSGSTAmount] = useState(null)
    const [totalGSTAmount, setTotalGSTAmount] = useState(null)
    const [totalTaxAmount, setTotalTaxAmount] = useState(null)
    const [totalAmount, setTotalAmount] = useState(null)

    useEffect(() => {
        if (totalAmount === null) {
            var t = calculateTotalAmountUsingData(data?.products)
            if (t) {
                setTotalAmount(t)
            }
        }
        if (totalGSTAmount === null) {
            var g = calculateTotalGSTAmountUsingData(data?.products)
            if (g) {
                setTotalGSTAmount(g)
            }
        }
        if (totalCGSTAmount === null) {
            var c = calculateTotalCGSTAmountUsingData(data?.products)
            setTotalCGSTAmount(c)
        }
        if (totalSGSTAmount === null) {
            var s = calculateTotalSGSTAmountUsingData(data?.products)
            setTotalSGSTAmount(s)
        }
        if (totalTaxAmount === null && totalCGSTAmount !== null && totalGSTAmount !== null && totalSGSTAmount !== null && totalAmount !== null) {
            if (data?.customerDetails?.shippingAddress?.state === 'Delhi') {
                setTotalTaxAmount(totalAmount + totalGSTAmount)
            } else {
                setTotalTaxAmount(totalAmount + totalCGSTAmount + totalSGSTAmount)
            }
        }
    }, [totalAmount])

const downloadPDF = async () => {
    try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const padding = 10;
        let currentY = padding;

        // Logo settings
        const desiredWidth = 50;
        const logoAspectRatio = 3.5;
        const logoHeight = desiredWidth / logoAspectRatio;
        const logoUrl = "https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75";

        // 🟢 Add Logo
        pdf.addImage(logoUrl, "PNG", padding, currentY, desiredWidth, logoHeight);

        // 🟢 Company Details on Left (below logo with increased spacing)
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        currentY += logoHeight + 8; // Increased spacing from 3 to 8

        pdf.text(`GSTIN: ${OrderInvoiceDetails.companyDetails.gstNo}`, padding, currentY);
        currentY += 5;
        pdf.text(`CIN: ${OrderInvoiceDetails.companyDetails.cin}`, padding, currentY);
        currentY += 5;
        pdf.text(`PAN: ${OrderInvoiceDetails.companyDetails.panNo}`, padding, currentY);

        // 🟢 Company Address on Right (formatted as two lines)
        const rightTextY = padding + 2;
        // Split the address into two lines
        const addressLine1 = "A-4 Second Floor, Sarvodaya Enclave,";
        const addressLine2 = "New Delhi - 110017, India";
        
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.text(addressLine1, pageWidth - padding, rightTextY, { align: "right" });
        pdf.text(addressLine2, pageWidth - padding, rightTextY + 4, { align: "right" });

        // Calculate proper spacing (accounting for two-line address)
        const addressHeight = 8; // Two lines * 4 spacing
        currentY = Math.max(currentY, rightTextY + addressHeight);

        // 🟢 Horizontal Line
        currentY += 15; // Increased spacing from 10 to 15
        pdf.setDrawColor(67, 42, 119);
        pdf.setLineWidth(0.5);
        pdf.line(padding, currentY, pageWidth - padding, currentY);
        currentY += 8;

        // 🟢 Customer & Quotation Headers
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(67, 42, 119);
        pdf.setFontSize(10);
        pdf.text("Customer", padding, currentY);
        pdf.text("Quotation", pageWidth - padding, currentY, { align: "right" });

        currentY += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(8);

        // 🟢 Customer Details (Left Side)
        const customerStartY = currentY;
        pdf.text(`Company Name: ${data?.customerDetails?.companyName || '-'}`, padding, currentY);
        currentY += 5;
        pdf.text(`Customer Name: ${data?.customerDetails?.name || '-'}`, padding, currentY);
        currentY += 5;
        pdf.text(`Contact No: ${data?.customerDetails?.contact || '-'}`, padding, currentY);
        currentY += 5;
        pdf.text(`Email ID: ${data?.customerDetails?.email || '-'}`, padding, currentY);

        // 🟢 Quotation Details (Right Side)
        let quotationY = customerStartY;
        pdf.text(`Quotation Ref No: ${data?.quotationRefNo}`, pageWidth - padding, quotationY, { align: 'right' });
        quotationY += 5;
        pdf.text(`Date: ${GetFullYear(Number(data?.createdAt))}`, pageWidth - padding, quotationY, { align: 'right' });

        currentY += 10;

        // 🟢 Horizontal Line
        pdf.line(padding, currentY, pageWidth - padding, currentY);
        currentY += 8;

        // 🟢 Product Table with GST only (no CGST/SGST)
        const headRow = [['Product', 'Variant', 'HSN', 'Qty', 'Rate', 'GST Amount (%)', 'Amount']];

        const body = data.products.map(ele => {
            const baseAmount = Number(ele.price) * Number(ele.qty);
            const productName = ele.product_id.productName;
            const variantName = ele.productVarient.varientName;
            
            return [
                productName,
                variantName,
                ele.product_id.hsnNo,
                ele.qty,
                ele.price,
                `${GstCalculation(baseAmount, ele.productVarient.gst).toFixed(2)} (${ele.productVarient.gst}%)`,
                baseAmount.toFixed(2)
            ];
        });

        pdf.autoTable({
            startY: currentY,
            head: headRow,
            body: body,
            theme: 'grid',
            headStyles: {
                fillColor: Colors.ThemeBlue,
                textColor: '#fff',
                fontSize: 9
            },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { cellWidth: 35 },     // Product
                1: { cellWidth: 30 },     // Variant
                2: { cellWidth: 20 },     // HSN
                3: { cellWidth: 15 },     // Qty
                4: { cellWidth: 20 },     // Rate
                5: { cellWidth: 30 },     // GST Amount
                6: { cellWidth: 25 }      // Amount
            }
        });

        currentY = pdf.lastAutoTable.finalY + 10;

        // 🟢 Totals Section - Show GST only
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");

        const totals = [
            `Total Amount: ${totalAmount}`,
            `Total GST: ${totalGSTAmount?.toFixed(2)}`
        ];

        // Draw totals
        totals.forEach((total, index) => {
            if (currentY + 15 > pageHeight - 40) {
                pdf.addPage();
                currentY = padding;
            }
            pdf.text(total, padding, currentY);
            currentY += 6;
        });

        // Total Taxable Amount with word conversion
        if (currentY + 20 > pageHeight - 40) {
            pdf.addPage();
            currentY = padding;
        }

        const totalText = `Total Taxable Amount: ${totalTaxAmount?.toFixed(2)} (${numberToWords(totalTaxAmount?.toFixed(2))})`;
        const wrappedTotalText = pdf.splitTextToSize(totalText, pageWidth - 2 * padding);
        pdf.text(wrappedTotalText, padding, currentY);
        currentY += wrappedTotalText.length * 5 + 10;

        // 🟢 Terms & Conditions
        if (data?.termsAndConditions && data.termsAndConditions !== "<p><strong></strong></p>") {
            if (currentY + 30 > pageHeight - 40) {
                pdf.addPage();
                currentY = padding;
            }

            // Add "Terms & Conditions" header in bold
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);
            pdf.setTextColor(67, 42, 119);
            pdf.text("Terms & Conditions", padding, currentY);
            currentY += 5; // Reduced spacing

            // Reset font for terms content
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);

            // Remove "Terms & Conditions" from the beginning of the text if it exists
            let cleanedText = termsRef.current.innerText;
            if (cleanedText.startsWith("Terms & Conditions")) {
                cleanedText = cleanedText.replace(/^Terms & Conditions\s*/, "");
            }

            const termsText = cleanedText.split("\n").filter(line => line.trim() !== "").map(line => [line]);
            
            pdf.autoTable({
                startY: currentY,
                body: termsText,
                theme: 'plain',
                styles: { fontSize: 8, cellPadding: 0.5 }, // Reduced padding
                margin: { left: padding, right: padding }
            });
            
            currentY = pdf.lastAutoTable.finalY + 5; // Reduced spacing after
        }

        // 🟢 Signature Section
        if (currentY + 50 > pageHeight) {
            pdf.addPage();
            currentY = padding+30;
        }

        pdf.setFontSize(10);
        pdf.text("Thanking you,", padding, currentY);
        pdf.text("Best Regards", padding, currentY + 5);
        pdf.text(`${data?.regards?.name}`, padding, currentY + 10);
        pdf.text(`${data?.regards?.contact}`, padding, currentY + 15);

        // Add signature image on the right
        pdf.addImage(signature, "PNG", pageWidth - 60, currentY, 40, 40);
        pdf.addPage(); //for new blank page

        // 🟢 Save PDF
        pdf.save("Quotation.pdf");

    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

    console.log('data', data);//Quotation.pdf


    return (
        <div>
            <div className="quotation-container" style={{ padding: 20, maxWidth: 800, margin: "auto", backgroundColor: "#fff", border: "1px solid #ddd" }}>
                {/* Header - will be captured separately */}
                {/* Header - will be captured separately */}
                <div
                    ref={headerRef}
                    className="grid grid-cols-2 gap-6 p-4 py-5 border-b-2"
                    style={{ borderBottomColor: Colors.ThemeBlue }}
                >
                    <div>
                        <img
                            className="w-1/2"
                            src="https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75"
                            alt="Company Logo"
                        />
                        <p className="text-xs mt-3">GSTIN: {OrderInvoiceDetails.companyDetails.gstNo}</p>
                        <p className="text-xs">CIN: {OrderInvoiceDetails.companyDetails.cin}</p>
                        <p className="text-xs">PAN: {OrderInvoiceDetails.companyDetails.panNo}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">{OrderInvoiceDetails.companyDetails.address.address}</p>
                        <p className="text-sm">{OrderInvoiceDetails.companyDetails.address.city}</p>
                        <p className="text-sm">
                            {OrderInvoiceDetails.companyDetails.address.state} {OrderInvoiceDetails.companyDetails.address.pinCode},{" "}
                            {OrderInvoiceDetails.companyDetails.address.country}
                        </p>
                    </div>
                </div>

                {/* Client & Supplier Info - will be captured separately */}
                <div
                    ref={customerInfoRef}
                    className="p-4 py-6 border-b-2"
                    style={{ borderBottomColor: Colors.ThemeBlue }}
                >
                    <div className="grid grid-cols-2 gap-8">
                        {/* Customer Details */}
                        <div>
                            <h3 className="text-lg font-semibold" style={{ color: Colors.ThemeBlue }}>Customer</h3>
                            <p className="text-xs">Company Name: {data?.customerDetails?.companyName || '-'}</p>
                            <p className="text-xs">Customer Name: {data?.customerDetails?.name || '-'}</p>
                            <p className="text-xs">Customer Contact No: {data?.customerDetails?.contact || '-'}</p>
                            <p className="text-xs">Customer Email ID: {data?.customerDetails?.email || '-'}</p>
                        </div>

                        {/* Quotation Details */}
                        <div className="text-right">
                            <h3 className="text-lg font-semibold" style={{ color: Colors.ThemeBlue }}>Quotation</h3>
                            <p className="text-xs">Quotation Ref No: <b>{data?.quotationRefNo}</b></p>
                            <p className="text-xs">Date: <b>{GetFullYear(Number(data?.createdAt))}</b></p>
                        </div>
                    </div>
                </div>

                {/* Table will be rendered using autoTable */}
                <div style={{ marginTop: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: Colors.ThemeBlue, color: "#fff", textAlign: "left" }}>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Product</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Varient</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Unit</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Qty</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Rate</th>
                                {
                                    data.customerDetails?.shippingAddress?.state === 'Delhi' ?
                                        <th style={{ padding: 8, border: "1px solid #ddd" }}>GST Amount (%)</th>
                                        :
                                        <>
                                            <th style={{ padding: 8, border: "1px solid #ddd" }}>CGST Amount (%)</th>
                                            <th style={{ padding: 8, border: "1px solid #ddd" }}>SGST Amount (%)</th>
                                        </>
                                }
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.products?.map((ele, i) => {
                                console.log('Number(ele?.price)',Number(ele?.price));
                                console.log('Number(ele?.qty)',Number(ele?.qty));
                                console.log('Number(ele?.gst)',Number(ele?.productVarient?.gst)/2);
                            
                                console.log(GstCalculation(Number(ele?.price) * Number(ele.qty),Number(ele?.productVarient?.gst)/2));
                                
                                return(
                                    <tr key={i} >
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.productName}</td>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.productVarient?.varientName}</td>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.productVarient?.varientUnit}</td>
                                    
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.qty}</td>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.price}</td>
                                    {
                                        data.customerDetails?.shippingAddress?.state === 'Delhi' ?
                                            <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.price) * Number(ele.qty), Number(ele?.productVarient?.gst))?.toFixed(2)} ({ele?.productVarient?.gst}%)</td>
                                            :
                                            <>
                                                <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.price) * Number(ele.qty),Number(ele?.productVarient?.gst)/2)?.toFixed(2)} ({ele?.productVarient?.gst / 2}%)</td>
                                                <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.price) * Number(ele.qty),Number(ele?.productVarient?.gst)/2)?.toFixed(2)} ({ele?.productVarient?.gst / 2}%)</td>
                                            </>
                                    }
                                    < td style={{ padding: 8, border: "1px solid #ddd" }}>{(Number(ele?.price) * Number(ele.qty))?.toFixed(2)}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Total Calculation - Capture it as an image */}
                <div ref={totalRef} style={{ marginTop: 20, textAlign: "right", padding: "10px 20px", backgroundColor: "#f8f8f8", border: "1px solid #eee", borderRadius: "4px" }}>
                    <h3 style={{ margin: 0 }}>Total Amount: <span style={{ fontWeight: "bold" }}>₹{totalAmount}</span></h3>
                    {
                        data?.customerDetails?.shippingAddress?.state === 'Delhi' ?
                            <h3 style={{ margin: 0 }}>Total GST: <span style={{ fontWeight: "bold" }}>₹{totalGSTAmount}</span></h3>
                            :
                            <>
                                <h3 style={{ margin: 0 }}>Total CGST: <span style={{ fontWeight: "bold" }}>₹{totalCGSTAmount?.toFixed(2)}</span></h3>
                                <h3 style={{ margin: 0 }}>Total SGST: <span style={{ fontWeight: "bold" }}>₹{totalSGSTAmount?.toFixed(2)}</span></h3>
                            </>
                    }
                    <h3 style={{ margin: 0 }}>Total Taxable Amount: <span style={{ fontWeight: "bold" }}>₹{totalTaxAmount?.toFixed(2)} ({numberToWords(totalTaxAmount?.toFixed(2))})</span></h3>
                </div>

                {
                    data?.termsAndConditions !== "<p><strong></strong></p>" &&
                    <>

                        <div ref={termsRef} style={{ marginTop: 20, padding: "10px 15px", border: "1px solid #f0f0f0", borderRadius: "4px" }}>
                            <h3 style={{ color: Colors.ThemeBlue, marginBottom: 10 }}>Terms & Conditions</h3>
                            <div dangerouslySetInnerHTML={{
                                __html: data.termsAndConditions
                                    .replace(/<p><br><\/p>/g, '')  // Empty <p><br></p> hatao
                                    .replace(/<br\s*\/?>/g, '')  // Extra <br> hatao
                            }} />
                        </div>
                    </>

                }

                {/* Terms & Notes - This is just for reference in the browser, actual PDF uses text */}


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
            </div >

            {/* Download Button */}
            < button onClick={downloadPDF} style={{ marginTop: 20, padding: 10, backgroundColor: Colors.ThemeBlue, color: "#fff", border: "none", cursor: "pointer" }}>
                Download PDF
            </button >
        </div >
    );
};

export default QuotaionPDF;