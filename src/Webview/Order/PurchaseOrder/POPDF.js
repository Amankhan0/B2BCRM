import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Colors } from "../../../Colors/color";
import signature from '../../..//Image/b2bsignature.jpeg';
import { calculateTotalAmountUsingData, calculateTotalCGSTAmountUsingData, calculateTotalGSTAmountUsingData, calculateTotalSGSTAmountUsingData, GetFullYear, GstCalculation, numberToWords } from "../../../utils";
import { backIcon } from "../../../SVG/Icons";
import Title from "../../../Component/Title";
import { OrderInvoiceDetails } from "../../OrderInvoiceDetails";

const POPDF = ({ data, onClickBack }) => {

    const headerRef = useRef();
    const ourInfoRef = useRef();
    const vendorInfoRef = useRef();
    const totalRef = useRef();
    const termsRef = useRef();
    const signatureRef = useRef();

    const [totalCGSTAmount, setTotalCGSTAmount] = useState(null)
    const [totalSGSTAmount, setTotalSGSTAmount] = useState(null)
    const [totalGSTAmount, setTotalGSTAmount] = useState(null)
    const [totalTaxAmount, setTotalTaxAmount] = useState(null)
    const [totalAmount, setTotalAmount] = useState(null)

    useEffect(() => {
        if (totalAmount === null) {
            var t = calculateTotalAmountUsingData(data?.products, true)
            if (t) {
                setTotalAmount(t)
            }
        }
        if (totalGSTAmount === null) {
            var g = calculateTotalGSTAmountUsingData(data?.products, true)
            if (g) {
                setTotalGSTAmount(g)
            }
        }
        if (totalCGSTAmount === null) {
            var c = calculateTotalCGSTAmountUsingData(data?.products, true)
            setTotalCGSTAmount(c)
        }
        if (totalSGSTAmount === null) {
            var s = calculateTotalSGSTAmountUsingData(data?.products, true)
            setTotalSGSTAmount(s)
        }
        if (totalTaxAmount === null && totalCGSTAmount !== null && totalGSTAmount !== null && totalSGSTAmount !== null && totalAmount !== null) {
            if (data?.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state) {
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

            // Calculate height proportionally
            const originalAspectRatio = 3.5; // You'll need to calculate this or know it beforehand
            const desiredWidth = 50;
            const proportionalHeight = desiredWidth / originalAspectRatio;
            const proportionalHeightForSignature = desiredWidth / 1;
            const logoUrl = "https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75"
            let currentY = 10;

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

            pdf.text(`Date: ${GetFullYear(Date.now())}`, pageWidth - 13, currentY + 16,{ align: 'right', maxWidth: 35 });
            pdf.text(`${data?.poRefNo?'PO':'Order'} Ref No: ${data?.poRefNo?data?.poRefNo:data?.orderRefNo}`, pageWidth - 13, currentY + 20,{ align: 'right', maxWidth: 60 });

            currentY += 25;

            // Add Horizontal Line
            pdf.setDrawColor(67, 42, 119);
            pdf.setLineWidth(0.5);
            pdf.line(10, currentY + 10, pageWidth - 10, currentY + 10);
            currentY += 15;

            // 🟢 Add Customer Info
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(67, 42, 119); // Theme Blue Color
            pdf.text("Billing Address", 15, currentY);
            pdf.text("Shipping Address", pageWidth / 2, currentY);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);

            // 🟢 Customer Info
            pdf.text(`Company Name: ${OrderInvoiceDetails?.companyDetails?.companyName || '-'}`, 15, currentY + 7);
            pdf.text(`Address: ${OrderInvoiceDetails?.companyDetails?.address?.address}, ${OrderInvoiceDetails?.companyDetails?.address?.state},`, 15, currentY + 12);
            pdf.text(`${OrderInvoiceDetails?.companyDetails?.address?.city} ${OrderInvoiceDetails?.companyDetails?.address?.pinCode}`, 15, currentY + 17);
            pdf.text(`GST No: ${OrderInvoiceDetails?.companyDetails?.gstNo}`, 15, currentY + 22);

            const maxAddressWidth = pageWidth - 130; // leave margins on both sides
            // Shipping info
            // pdf.text(`Company Name: ${data?.customerDetails?.companyName}`, pageWidth / 2, currentY + 7);
            const shippingAddress = `Address: ${data?.customerDetails?.shippingAddress?.address}, ${data?.customerDetails?.shippingAddress?.state},`
            const shippingSubAddress = `${data?.customerDetails?.shippingAddress?.city}, ${data?.customerDetails?.shippingAddress?.pinCode}, ${data?.customerDetails?.shippingAddress?.landmark}`
            const wrappedshippingAddress  = pdf.splitTextToSize(shippingAddress, maxAddressWidth);
            const wrappedshippingSubAddress  = pdf.splitTextToSize(shippingSubAddress, maxAddressWidth);
            pdf.text(wrappedshippingAddress, pageWidth / 2, currentY + 7);
            pdf.text(wrappedshippingSubAddress, pageWidth / 2, currentY + 15);
            pdf.setLineWidth(0.5);
            pdf.line(10, currentY + 30, pageWidth - 10, currentY + 30);
            currentY += 35;

            // 🟢 Vendor Info
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(67, 42, 119); // Theme Blue Color
            pdf.text("Supplier Details", 15, currentY);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);

            pdf.text(`Company Name: ${data?.supplierDetails?.companyName}`, 15, currentY + 7);
            const supplierAddress = `Address: ${data?.supplierDetails?.gstAddresses?.address}, ${data?.supplierDetails?.gstAddresses?.state},`
            const wrappedsupplierAddress  = pdf.splitTextToSize(supplierAddress, maxAddressWidth);
            pdf.text(wrappedsupplierAddress, 15, currentY + 12);

            const supplierSubAddress = `${data?.supplierDetails?.gstAddresses?.city}, ${data?.supplierDetails?.gstAddresses?.pinCode}, ${data?.supplierDetails?.gstAddresses?.landmark}`
            const wrappedSubsupplierAddress  = pdf.splitTextToSize(supplierSubAddress, maxAddressWidth);
            pdf.text(wrappedSubsupplierAddress, 15, currentY + 21.5);

            pdf.text(`GST No: ${data?.supplierDetails?.gstNo}`, 15, currentY + 25);

            pdf.setLineWidth(0.5);
            pdf.line(10, currentY + 30, pageWidth - 10, currentY + 30);
            currentY += 35;

            // 🟢 Add Table with Multi-Page Handling
            pdf.autoTable({
                startY: 120,
                head: data.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state ? [['Product','Variant', 'Qty', 'Rate', 'GST Amount (%) ', 'Amount']] : [['Product / Variant', 'Qty', 'Rate', 'CGST Amount (%)', 'SGST Amount (%)', 'Amount']],
                body:
                    data.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state ?
                        data.products.map(ele => [
                            `${ele.product_id.productName}`,`${ele.productVarient.varientName}${ele.productVarient.varientUnit}`,
                            ele.qty, ele?.vendorPrice, GstCalculation(Number(ele?.vendorPrice) * Number(ele.qty), Number(ele?.productVarient?.gst))?.toFixed(2) + " " + "(" + ele?.productVarient?.gst + "%" + ")", (Number(ele?.vendorPrice) * Number(ele.qty))?.toFixed(2)
                        ])
                        : data.products.map(ele => [
                            `${ele.product_id.productName}`,`${ele.productVarient.varientName}${ele.productVarient.varientUnit}`,
                            ele.qty, ele?.vendorPrice, GstCalculation(Number(ele?.vendorPrice) * Number(ele.qty), Number(ele?.productVarient?.gst) / 2)?.toFixed(2), GstCalculation(Number(ele?.vendorPrice) * Number(ele.qty), Number(ele?.productVarient?.gst) / 2)?.toFixed(2), (Number(ele?.vendorPrice) * Number(ele.qty))?.toFixed(2)
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
            pdf.text(`Total Amount: ${totalAmount?.toFixed(2)}`, pageWidth - 195, currentY);

            currentY += 5;

            if (data?.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state) {
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
            const text = `Total Taxable Amount: ${totalTaxAmount?.toFixed(2)} (${numberToWords(totalTaxAmount?.toFixed(2))})`;

            // Define maximum width before text overflows
            const maxWidth = 180; // Adjust as needed

            // Split text into multiple lines if necessary
            const wrappedText = pdf.splitTextToSize(text, maxWidth);

            // Print the text, automatically handling overflow
            pdf.text(wrappedText, pageWidth - 195, currentY);
            currentY += 10;

            // 🟢 Terms & Conditions with Multi-Page Handling
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

            // Save PDF
            pdf.save("PurchaseOrder.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };


    const calculateTotal = (products, type) => {

        if (type === 'taxamount') {
            return products.reduce((total, product) => {
                const productTotal = Number(product.price) * Number(product.qty);
                return total + productTotal;
            }, 0);
        } else if (type === 'cgst') {
            return products.reduce((total, product) => {
                const productTotal = Number(product.cgst)
                return total + productTotal;
            }, 0);
        }
        else if (type === 'sgst') {
            return products.reduce((total, product) => {
                const productTotal = Number(product.sgst)
                return total + productTotal;
            }, 0);
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-4" onClick={onClickBack}>
                <p>{backIcon}</p>
                <Title title={'Back'} size={'md'} />
            </div>
            <div className="quotation-container" style={{ padding: 20, maxWidth: 800, margin: "auto", backgroundColor: "#fff", border: "1px solid #ddd" }}>
                {/* Header */}

                <div ref={headerRef} className="grid grid-cols-2 gap-6 p-2 py-5" style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}>
                    <div>
                        <img className="w-1/2" src="https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75" />
                        <p className="text-xs p-0.5 mt-3">GSTIN : {OrderInvoiceDetails.companyDetails.gstNo}</p>
                        <p className="text-xs p-0.5">CIN : {OrderInvoiceDetails.companyDetails.cin}</p>
                        <p className="text-xs p-0.5">PAN : {OrderInvoiceDetails.companyDetails.panNo}</p>
                    </div>
                    <div className="flex justify-end text-right">
                        <div>
                            <h3 style={{ color: Colors.ThemeBlue }}>PURCHASE ORDER</h3>
                            <p className="text-xs p-0.5">{data?.poRefNo?'PO':'Order'} Ref No: <b>{data?.poRefNo?data?.poRefNo:data?.orderRefNo}</b></p>
                            <p className="text-xs p-0.5">Date: <b>{GetFullYear(Date.now())}</b></p>
                            <p className="text-xs p-0.5">Terms of Payment: : <b>{data.paymentTerm.type} {data.paymentTerm.days !== null && data.paymentTerm.days + ' days'}</b></p>
                        </div>
                    </div>
                </div>

                {/* Client */}
                <div ref={ourInfoRef} className="p-2 py-5" style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}>
                    <div className="grid grid-cols-2">
                        <div>
                            <h3 style={{ color: Colors.ThemeBlue }}>Billing Address</h3>
                            <p className="text-xs p-0.5">Company Name : {OrderInvoiceDetails.companyDetails.companyName}</p>
                            <p className="text-xs p-0.5">Address : {OrderInvoiceDetails.companyDetails.address.address}</p>
                            <p className="text-xs p-0.5">{OrderInvoiceDetails.companyDetails.address.city}</p>
                            <p className="text-xs p-0.5">{OrderInvoiceDetails.companyDetails.address.state} {OrderInvoiceDetails.companyDetails.address.pinCode} , {OrderInvoiceDetails.companyDetails.address.country}</p>
                            <p className="text-xs p-0.5">GSTIN: {OrderInvoiceDetails.companyDetails.gstNo}</p>
                        </div>
                        <div>
                            <h3 style={{ color: Colors.ThemeBlue }}>Shipping Address</h3>
                            
                            <p className="text-xs p-0.5">Address : {data?.customerDetails?.shippingAddress?.address || '-'}</p>
                            <p className="text-xs p-0.5">{data?.customerDetails?.shippingAddress?.city + ' ' + data?.customerDetails?.shippingAddress?.landmark || '-'}</p>
                            <p className="text-xs p-0.5">{data?.customerDetails?.shippingAddress?.state + ' ' + data?.customerDetails?.shippingAddress?.pinCode || '-'}</p>
                        </div>
                    </div>
                </div>
                {/* Supplier Info */}
                <div ref={vendorInfoRef} className="p-2 py-5" style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}>
                    <div className="grid grid-cols-2">
                        <div>
                            <h3 style={{ color: Colors.ThemeBlue }}>Supplier Details</h3>
                            <p className="text-xs p-0.5">Company Name : {data?.supplierDetails?.companyName}</p>
                            <p className="text-xs p-0.5">Address : {data?.supplierDetails?.gstAddresses?.address}</p>
                            <p className="text-xs p-0.5">{data?.supplierDetails?.gstAddresses?.city}, {data?.supplierDetails?.gstAddresses?.pinCode}</p>
                            <p className="text-xs p-0.5">{data?.supplierDetails?.gstAddresses?.landmark}</p>
                            <p className="text-xs p-0.5">GSTIN :{data?.supplierDetails?.gstNo}</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                    <thead>
                        <tr style={{ backgroundColor: Colors.ThemeBlue, color: "#fff", textAlign: "left" }}>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Product</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Varient</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>HSN</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Qty</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Rate</th>
                            {
                                data.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state ?
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
                        {
                            data?.products?.map((ele, i) => {
                                console.log('--?.toFixed(2)',ele);
                                
                                return (
                                    <tr>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.productName}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.productVarient?.varientName + ele?.productVarient?.varientUnit}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.hsnNo}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.qty}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.vendorPrice}</td>
                                        {
                                            data.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state ?
                                                <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.vendorPrice) * Number(ele.qty), Number(ele?.productVarient?.gst))?.toFixed(2)} ({ele?.productVarient?.gst}%)</td>
                                                :
                                                <>
                                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.vendorPrice) * Number(ele.qty), Number(ele?.productVarient?.gst) / 2)?.toFixed(2)} ({ele?.productVarient?.gst / 2}%)</td>
                                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.vendorPrice) * Number(ele.qty), Number(ele?.productVarient?.gst) / 2)?.toFixed(2)} ({ele?.productVarient?.gst / 2}%)</td>
                                                </>
                                        }
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{(Number(ele?.vendorPrice) * Number(ele.qty))?.toFixed(2)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {/* Total Calculation - Capture it as an image */}
                <div ref={totalRef} style={{ marginTop: 20, textAlign: "right", padding: "10px 20px", backgroundColor: "#f8f8f8", border: "1px solid #eee", borderRadius: "4px" }}>
                    <h3 style={{ margin: 0 }}>Total Amount: <span style={{ fontWeight: "bold" }}>₹{totalAmount}</span></h3>
                    {
                        data?.customerDetails?.shippingAddress?.state === data.supplierDetails?.gstAddresses?.state ?
                            <h3 style={{ margin: 0 }}>Total GST: <span style={{ fontWeight: "bold" }}>₹{totalGSTAmount?.toFixed(2)}</span></h3>
                            :
                            <>
                                <h3 style={{ margin: 0 }}>Total CGST: <span style={{ fontWeight: "bold" }}>₹{totalCGSTAmount?.toFixed(2)}</span></h3>
                                <h3 style={{ margin: 0 }}>Total SGST: <span style={{ fontWeight: "bold" }}>₹{totalSGSTAmount?.toFixed(2)}</span></h3>
                            </>
                    }
                    <h3 style={{ margin: 0 }}>Total Taxable Amount: <span style={{ fontWeight: "bold" }}>₹{totalTaxAmount?.toFixed(2)} ({numberToWords(totalTaxAmount?.toFixed(2))})</span></h3>
                </div>

                {/* Terms & Notes */}
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
            <button onClick={downloadPDF} style={{ marginTop: 20, padding: 10, backgroundColor: Colors.ThemeBlue, color: "#fff", border: "none", cursor: "pointer" }}>
                Download PDF
            </button>
        </div>
    );
};

export default POPDF;