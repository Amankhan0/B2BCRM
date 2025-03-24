import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Colors } from "../../Colors/color";
import signature from '../../Image/signature.jpeg';
import { OrderInvoiceDetails } from "../OrderInvoiceDetails";
import 'jspdf-autotable';
import { GetFullYear } from "../../utils";
import { getAuthenticatedUser, getAuthenticatedUserWithRoles } from "../../Storage/Storage";

const QuotaionPDF = ({ data }) => {

    const totalRef = useRef(); // Add this reference
    const headerRef = useRef();
    const customerInfoRef = useRef();
    const termsRef = useRef();
    const signatureRef = useRef();

    const downloadPDF = async () => {
        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            let currentY = 10; // Initial Y position
    
            // 🟢 Add Header (ONLY ON FIRST PAGE)
            const headerCanvas = await html2canvas(headerRef.current, { scale: 10, useCORS: true });
            const headerImgData = headerCanvas.toDataURL("image/png");
            pdf.addImage(headerImgData, "PNG", 0, currentY, pageWidth, 35);
            currentY += 35; // Move cursor down
    
            // 🟢 Add Customer Info Below Header
            const customerInfoCanvas = await html2canvas(customerInfoRef.current, { scale: 10, useCORS: true });
            const customerInfoImgData = customerInfoCanvas.toDataURL("image/png");
            pdf.addImage(customerInfoImgData, "PNG", 0, currentY, pageWidth, 35);
            currentY += 25;
    
            // 🟢 Add Table (Handles Multi-Page Automatically)
            pdf.autoTable({
                startY: 90,
                head: [['Product / Variant', 'Qty', 'Rate', 'Amount']],
                body: data.products.map(ele => [
                    `${ele.product_id.productName} / ${ele.productVarient.varientName}${ele.productVarient.varientUnit}`,
                    ele.qty, ele.price, Number(ele.price) * Number(ele.qty)
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
            pdf.text(`Total: ${calculateTotalPrice(data.products)}`, pageWidth - 70, currentY);
            currentY += 10;
    
            // 🟢 Add Terms & Conditions
            if (currentY > pageHeight - 60) {
                pdf.addPage();
                currentY = 15;
            }
            const termsText = termsRef.current.innerText.split("\n").map(line => [line]);
            pdf.autoTable({
                startY: currentY,
                body: termsText,
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 2 },
                margin: { left: 10, right: 10 }
            });
            currentY = pdf.lastAutoTable.finalY + 10;
    
            // 🟢 Add Signature
            if (currentY > pageHeight - 40) {
                pdf.addPage();
                currentY = 15;
            }
            const signatureCanvas = await html2canvas(signatureRef.current, { scale: 10, useCORS: true });
            const signatureImgData = signatureCanvas.toDataURL("image/png");
            pdf.addImage(signatureImgData, "PNG", 0, currentY, pageWidth, 40);
    
            // 🟢 Save PDF
            pdf.save("Quotation.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    


    const calculateTotalPrice = (products) => {
        return products.reduce((total, product) => {
            const productTotal = Number(product.price) * Number(product.qty);
            return total + productTotal;
        }, 0);
    };

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
                            <p className="text-xs">Date: <b>{GetFullYear(Date.now())}</b></p>
                        </div>
                    </div>
                </div>


                {/* Table will be rendered using autoTable */}
                <div style={{ marginTop: 20 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: Colors.ThemeBlue, color: "#fff", textAlign: "left" }}>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Product / Varient</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Qty</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Rate</th>
                                <th style={{ padding: 8, border: "1px solid #ddd" }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.products?.map((ele, i) => (
                                <tr key={i}>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.productName + ' / ' + ele?.productVarient?.varientName + ele?.productVarient?.varientUnit}</td>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.qty}</td>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.price}</td>
                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{Number(ele?.price) * Number(ele.qty)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total Calculation - Capture it as an image */}
                <div ref={totalRef} style={{ marginTop: 20, textAlign: "right", padding: "10px 20px", backgroundColor: "#f8f8f8", border: "1px solid #eee", borderRadius: "4px" }}>
                    <h3 style={{ margin: 0 }}>Total: <span style={{ fontWeight: "bold" }}>₹{calculateTotalPrice(data.products)}</span></h3>
                </div>

                {/* Terms & Notes - This is just for reference in the browser, actual PDF uses text */}
                <div ref={termsRef} style={{ marginTop: 20, padding: "10px 15px", border: "1px solid #f0f0f0", borderRadius: "4px" }}>
                    <h3 style={{ color: Colors.ThemeBlue, marginBottom: 10 }}>Terms & Conditions</h3>
                    <div dangerouslySetInnerHTML={{
                        __html: data.termsAndConditions
                            .replace(/<p><br><\/p>/g, '')  // Empty <p><br></p> hatao
                            .replace(/<br\s*\/?>/g, '')  // Extra <br> hatao
                    }} />
                </div>

                {/* Signature - will be captured separately */}
                <div ref={signatureRef} className="mt-20 px-20 flex justify-between">
                    <div>
                        <h4 className="text-black font-bold">Thanking you,</h4>
                        <p className="text-xs p-0.5">Best Regards</p>
                        <p>{getAuthenticatedUserWithRoles()?.userData?.firstName + ' ' + getAuthenticatedUserWithRoles()?.userData?.lastName}</p>
                        <p>+91-{getAuthenticatedUserWithRoles()?.userData?.contact}</p>
                    </div>

                    <div>
                        <p className="text-xs p-0.5 mb-5">Authorized Signature</p>
                        <img src={signature} alt="Signature" style={{ width: 150 }} />
                    </div>
                </div>
            </div>

            {/* Download Button */}
            <button onClick={downloadPDF} style={{ marginTop: 20, padding: 10, backgroundColor: Colors.ThemeBlue, color: "#fff", border: "none", cursor: "pointer" }}>
                Download PDF
            </button>
        </div >
    );
};

export default QuotaionPDF;