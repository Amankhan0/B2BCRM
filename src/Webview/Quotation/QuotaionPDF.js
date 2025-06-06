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
            let currentY = 10; // Initial Y position

            // Calculate height proportionally
            const originalAspectRatio = 3.5; // You'll need to calculate this or know it beforehand
            const desiredWidth = 50;
            const proportionalHeight = desiredWidth / originalAspectRatio;
            const proportionalHeightForSignature = desiredWidth / 1;
            const logoUrl = "https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75"

            // 🟢 Add Header with Text
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);

            pdf.addImage(
                logoUrl,
                "PNG",
                15,
                currentY,
                desiredWidth,
                proportionalHeight
            );

            // Company Details on Left Side (Below Logo)
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);
            pdf.text(`GSTIN: ${OrderInvoiceDetails.companyDetails.gstNo}`, 15, currentY + 20);
            pdf.text(`CIN: ${OrderInvoiceDetails.companyDetails.cin}`, 15, currentY + 25);
            pdf.text(`PAN: ${OrderInvoiceDetails.companyDetails.panNo}`, 15, currentY + 30);

            // Company Address on Right Side
            pdf.text(
                `${OrderInvoiceDetails.companyDetails.address.address}, ${OrderInvoiceDetails.companyDetails.address.city}, ${OrderInvoiceDetails.companyDetails.address.state} ${OrderInvoiceDetails.companyDetails.address.pinCode}, ${OrderInvoiceDetails.companyDetails.address.country}`,
                pageWidth - 13,
                15,
                { align: 'right', maxWidth: 35 }
            );

            currentY += 25;

            // Add Horizontal Line
            pdf.setDrawColor(67, 42, 119);
            pdf.setLineWidth(0.5);
            pdf.line(10, currentY + 10, pageWidth - 10, currentY + 10);
            currentY += 15;

            // 🟢 Add Customer Info
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(67, 42, 119); // Theme Blue Color
            pdf.text("Customer", 15, currentY);
            pdf.text("Quotation", pageWidth - 23, currentY);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);

            // Customer Details
            pdf.text(`Company Name: ${data?.customerDetails?.companyName || '-'}`, 15, currentY + 7);
            pdf.text(`Customer Name: ${data?.customerDetails?.name || '-'}`, 15, currentY + 12);
            pdf.text(`Contact No: ${data?.customerDetails?.contact || '-'}`, 15, currentY + 17);
            pdf.text(`Email ID: ${data?.customerDetails?.email || '-'}`, 15, currentY + 22);

            // Quotation Details
            pdf.text(`Quotation Ref No: ${data?.quotationRefNo}`, pageWidth - 10, currentY + 7, { align: 'right' });
            pdf.text(`Date: ${GetFullYear(Number(data?.createdAt))}`, pageWidth - 10, currentY + 12, { align: 'right' });

            // Add Horizontal Line
            pdf.setLineWidth(0.5);
            pdf.line(10, currentY + 30, pageWidth - 10, currentY + 30);
            currentY += 35;
 
            // 🟢 Add Table (Handles Multi-Page Automatically)
            pdf.autoTable({
                startY: 90,
                head: data.customerDetails?.shippingAddress?.state === 'Delhi' ? [['Product','Variant','Unit', 'Qty', 'Rate', 'GST Amount (%) ', 'Amount']] : [['Product','Variant','Unit', 'Qty', 'Rate', 'CGST Amount (%)', 'SGST Amount (%)', 'Amount']],
                body:
                    data.customerDetails?.shippingAddress?.state === 'Delhi' ?
                        data.products.map(ele => [
                            `${ele.product_id.productName}`,`${ele.productVarient.varientName}`,`${ele.productVarient.varientUnit}`,
                            ele.qty, ele.price, GstCalculation(Number(ele?.price) * Number(ele.qty), Number(ele?.productVarient?.gst)) + " " + "(" + ele?.productVarient?.gst + "%" + ")", Number(ele.price) * Number(ele.qty)
                        ])
                        : data.products.map(ele => [
                            `${ele.product_id.productName}`,`${ele.productVarient.varientName}`,`${ele.productVarient.varientUnit}`,
                            ele.qty, ele.price, GstCalculation(Number(ele?.price) * Number(ele.qty),Number(ele?.productVarient?.gst)/2)?.toFixed(2) + " " + "(" + ele?.productVarient?.gst / 2 + "%" + ")", GstCalculation(Number(ele?.price) * Number(ele.qty),Number(ele?.productVarient?.gst)/2)?.toFixed(2) + " " + "(" + ele?.productVarient?.gst / 2 + "%" + ")", Number(ele.price) * Number(ele.qty)
                        ]),
                theme: 'grid',
                headStyles: { fillColor: Colors.ThemeBlue, textColor: '#fff', fontSize: 10 },
                bodyStyles: { fontSize: 9 },
                didDrawPage: function (data) {
                    if (data.pageNumber > 1) {
                        currentY = 10; // Reset Y for new pages
                    }
                }
            });

            currentY = pdf.lastAutoTable.finalY + 10;

            // 🟢 Add Total Calculation
            if (currentY + 10 > pageHeight) {
                pdf.addPage(); // Move to next page if not enough space
                currentY = 10;
            }
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Total Amount: ${totalAmount}`, pageWidth - 195, currentY);

            currentY += 5;

            if (data?.customerDetails?.shippingAddress?.state === 'Delhi') {
                if (currentY + 10 > pageHeight) {
                    pdf.addPage(); // Move to next page if not enough space
                    currentY = 10;
                }
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Total GST: ${totalGSTAmount?.toFixed(2)}`, pageWidth - 195, currentY);
                currentY += 5;
            } else {
                if (currentY + 10 > pageHeight) {
                    pdf.addPage(); // Move to next page if not enough space
                    currentY = 10;
                }
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Total CGST: ${totalCGSTAmount?.toFixed(2)}`, pageWidth - 195, currentY);

                currentY += 5;

                if (currentY + 10 > pageHeight) {
                    pdf.addPage(); // Move to next page if not enough space
                    currentY = 10;
                }
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Total SGST: ${totalSGSTAmount?.toFixed(2)}`, pageWidth - 195, currentY);

                currentY += 5;
            }

            if (currentY + 10 > pageHeight) {
                pdf.addPage(); // Move to next page if not enough space
                currentY = 10;
            }
            
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            
            // Construct the long string
            const totalText = `Total Taxable Amount: ${totalTaxAmount?.toFixed(2)} (${numberToWords(totalTaxAmount?.toFixed(2))})`;
            
            // Wrap the text to fit within a width (e.g., 180)
            const wrappedText = pdf.splitTextToSize(totalText, 180);
            
            // Draw the wrapped text
            pdf.text(wrappedText, pageWidth - 195, currentY);
            
            // Adjust currentY based on number of lines
            currentY += wrappedText.length * 10; // 10 is line height
            

            // 🟢 Add Terms & Conditions
            if (currentY > pageHeight - 60) {
                pdf.addPage();
                currentY = 15;
            }
            if (data?.termsAndConditions !== "<p><strong></strong></p>") {
                const termsText = termsRef.current.innerText.split("\n").map(line => [line]);

                pdf.autoTable({
                    startY: currentY,
                    body: termsText,
                    theme: 'plain',
                    styles: { fontSize: 9, cellPadding: 2 },
                    margin: { left: 10, right: 10 }
                });
                currentY = pdf.lastAutoTable.finalY + 10;
            }
            currentY += 10;

            // 🟢 Add Signature
            if (currentY > pageHeight - 40) {
                pdf.addPage();
                currentY = 15;
            }
            pdf.text(`Thanking you,`, pageWidth - 175, currentY);
            pdf.text(`Best Regards`, pageWidth - 175, currentY + 5);
            pdf.text(`${data?.regards?.name}`, pageWidth - 175, currentY + 10);
            pdf.text(`${data?.regards?.contact}`, pageWidth - 175, currentY + 15);

            pdf.addImage(
                signature,
                "PNG",
                pageWidth - 70,
                currentY,
                desiredWidth,
                proportionalHeightForSignature
            );

            // 🟢 Save PDF
            pdf.save("Quotation.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    console.log('data', data);


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
                                    < td style={{ padding: 8, border: "1px solid #ddd" }}>{Number(ele?.price) * Number(ele.qty)}</td>
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