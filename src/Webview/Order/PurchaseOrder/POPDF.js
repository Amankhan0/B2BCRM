import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Colors } from "../../../Colors/color";
import signature from '../../..//Image/signature.jpeg';
import { calculateTotalAmountUsingData, calculateTotalCGSTAmountUsingData, calculateTotalGSTAmountUsingData, calculateTotalSGSTAmountUsingData, GetFullYear, GstCalculation } from "../../../utils";
import { backIcon } from "../../../SVG/Icons";
import Title from "../../../Component/Title";
import { OrderInvoiceDetails } from "../../OrderInvoiceDetails";
import { getAuthenticatedUserWithRoles, } from "../../../Storage/Storage";

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
            if (data?.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state) {
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
            let currentY = 10;

            // 🟢 Header (Only on First Page)
            const headerCanvas = await html2canvas(headerRef.current, { scale: 10, useCORS: true });
            pdf.addImage(headerCanvas.toDataURL("image/png"), "PNG", 0, currentY, pageWidth, 35);
            currentY += 40;

            // 🟢 Customer Info
            const customerCanvas = await html2canvas(ourInfoRef.current, { scale: 10, useCORS: true });
            pdf.addImage(customerCanvas.toDataURL("image/png"), "PNG", 0, currentY, pageWidth, 50);
            currentY += 50;

            // 🟢 Vendor Info
            const vendorCanvas = await html2canvas(vendorInfoRef.current, { scale: 10, useCORS: true });
            pdf.addImage(vendorCanvas.toDataURL("image/png"), "PNG", 0, currentY, pageWidth, 40);
            currentY += 40;

            // 🟢 Add Table with Multi-Page Handling
            pdf.autoTable({
                startY: 150,
                head: data.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state ? [['Product / Variant', 'Qty', 'Rate', 'GST Amount (%) ', 'Amount']] : [['Product / Variant', 'Qty', 'Rate', 'CGST Amount (%)', 'SGST Amount (%)', 'Amount']],
                body:
                    data.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state ?
                        data.products.map(ele => [
                            `${ele.product_id.productName} / ${ele.productVarient.varientName}${ele.productVarient.varientUnit}`,
                            ele.qty, ele.price, GstCalculation(Number(ele?.price) * Number(ele.qty), Number(ele?.productVarient?.gst)) + " " + "(" + ele?.productVarient?.gst + "%" + ")", Number(ele.price) * Number(ele.qty)
                        ])
                        : data.products.map(ele => [
                            `${ele.product_id.productName} / ${ele.productVarient.varientName}${ele.productVarient.varientUnit}`,
                            ele.qty, ele.price, ele.cgst + " " + "(" + ele?.productVarient?.gst / 2 + "%" + ")", ele.sgst + " " + "(" + ele?.productVarient?.gst / 2 + "%" + ")", Number(ele.price) * Number(ele.qty)
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
            pdf.text(`Total Amount: ${totalAmount}`, pageWidth - 70, currentY);

            currentY += 5;

            if (data?.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state) {
                if (currentY + 10 > pageHeight) {
                    pdf.addPage(); // Move to next page if not enough space
                    currentY = 10;
                }
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Total GST: ${totalGSTAmount}`, pageWidth - 70, currentY);

                currentY += 5;
            } else {
                if (currentY + 10 > pageHeight) {
                    pdf.addPage(); // Move to next page if not enough space
                    currentY = 10;
                }
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Total CGST: ${totalCGSTAmount}`, pageWidth - 70, currentY);

                currentY += 5;

                if (currentY + 10 > pageHeight) {
                    pdf.addPage(); // Move to next page if not enough space
                    currentY = 10;
                }
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Total SGST: ${totalSGSTAmount}`, pageWidth - 70, currentY);

                currentY += 5;
            }

            if (currentY + 10 > pageHeight) {
                pdf.addPage(); // Move to next page if not enough space
                currentY = 10;
            }
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Total Taxable Amount: ${totalTaxAmount}`, pageWidth - 70, currentY);

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
            const signatureCanvas = await html2canvas(signatureRef.current, { scale: 10, useCORS: true });
            const signatureImgData = signatureCanvas.toDataURL("image/png");
            pdf.addImage(signatureImgData, "PNG", 0, currentY, pageWidth, 40);

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
                            <p className="text-xs p-0.5">Order Ref No: <b>{data?.orderRefNo}</b></p>
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
                            <p className="text-xs p-0.5">Company Name : {data?.customerDetails?.companyName || '-'}</p>
                            <p className="text-xs p-0.5">Address : {data?.customerDetails?.billingAddress?.address || '-'}</p>
                            <p className="text-xs p-0.5">{data?.customerDetails?.billingAddress?.city + ' ' + data?.customerDetails?.billingAddress?.landmark || '-'}</p>
                            <p className="text-xs p-0.5">{data?.customerDetails?.billingAddress?.state + ' ' + data?.customerDetails?.billingAddress?.pinCode || '-'}</p>
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
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Product / Varient</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>HSN</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Qty</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Rate</th>
                            {
                                data.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state ?
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
                                return (
                                    <tr>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.productName + ' / ' + ele?.productVarient?.varientName + ele?.productVarient?.varientUnit}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.hsnNo}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.qty}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.price}</td>
                                        {
                                            data.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state ?
                                                <td style={{ padding: 8, border: "1px solid #ddd" }}>{GstCalculation(Number(ele?.price) * Number(ele.qty), Number(ele?.productVarient?.gst))} ({ele?.productVarient?.gst}%)</td>
                                                :
                                                <>
                                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele.cgst} ({ele?.productVarient?.gst / 2}%)</td>
                                                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele.cgst} ({ele?.productVarient?.gst / 2}%)</td>
                                                </>
                                        }
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{Number(ele?.price) * Number(ele.qty)}</td>
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
                        data?.customerDetails?.shippingAddress?.state === data.supplierDetails?.shippingAddress?.state ?
                            <h3 style={{ margin: 0 }}>Total GST: <span style={{ fontWeight: "bold" }}>₹{totalGSTAmount}</span></h3>
                            :
                            <>
                                <h3 style={{ margin: 0 }}>Total CGST: <span style={{ fontWeight: "bold" }}>₹{totalCGSTAmount}</span></h3>
                                <h3 style={{ margin: 0 }}>Total SGST: <span style={{ fontWeight: "bold" }}>₹{totalSGSTAmount}</span></h3>
                            </>
                    }
                    <h3 style={{ margin: 0 }}>Total Taxable Amount: <span style={{ fontWeight: "bold" }}>₹{totalTaxAmount}</span></h3>
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
        </div>
    );
};

export default POPDF;