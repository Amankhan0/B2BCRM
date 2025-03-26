

import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Colors } from "../../Colors/color";
import signature from '../../Image/signature.jpeg';
import { OrderInvoiceDetails } from "../OrderInvoiceDetails";

const QuotaionPDF = ({ data,quotationDate,name,contact }) => {
    const pdfRef = useRef();

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input, {
            scale: window.devicePixelRatio,
            useCORS: true,
            allowTaint: true
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const watermarkUrl = "https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75";
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = pdf.internal.pageSize.width;
            const imgHeight = 50;

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = watermarkUrl;
            img.onload = () => {
                // Convert image to low-opacity DataURL
                const watermarkCanvas = document.createElement("canvas");
                watermarkCanvas.width = img.width;
                watermarkCanvas.height = img.height;
                const ctx = watermarkCanvas.getContext("2d");
                ctx.globalAlpha = 0.1; // Set opacity
                ctx.drawImage(img, 0, 0);
                const watermarkDataURL = watermarkCanvas.toDataURL("image/png");

                // Generate PDF
                pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);

                // Add watermark on all pages
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.addImage(watermarkDataURL, "PNG", 0, (pdf.internal.pageSize.height - imgHeight) / 2, imgWidth, imgHeight);
                }

                pdf.save("Quotation.pdf");
            };
        });
    };



    console.log('data', data);

    const calculateTotalPrice = (products) => {
        return products.reduce((total, product) => {
            const productTotal = Number(product.price) * Number(product.qty);
            return total + productTotal;
        }, 0);
    };

    return (
        <div>
            <div ref={pdfRef} className="quotation-container" style={{ padding: 20, maxWidth: 800, margin: "auto", backgroundColor: "#fff", border: "1px solid #ddd" }}>
                {/* Header */}
                <div className="grid grid-cols-2 gap-6 p-2 py-5" style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}>
                    <div>
                        <img className="w-1/2" src="https://www.headsupb2b.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo-dark.67589a8e.jpg&w=3840&q=75" />
                        <p className="text-xs p-0.5 mt-3">GSTIN : {OrderInvoiceDetails.companyDetails.gstNo}</p>
                        <p className="text-xs p-0.5">CIN : {OrderInvoiceDetails.companyDetails.cin}</p>
                        <p className="text-xs p-0.5">PAN : {OrderInvoiceDetails.companyDetails.panNo}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <p className="text-sm mt-2">{OrderInvoiceDetails.companyDetails.address.address}</p>
                        <p className="text-sm">{OrderInvoiceDetails.companyDetails.address.city}</p>
                        <p>{OrderInvoiceDetails.companyDetails.address.state} {OrderInvoiceDetails.companyDetails.address.pinCode} , {OrderInvoiceDetails.companyDetails.address.country}</p>
                    </div>
                </div>

                {/* Client & Supplier Info */}
                <div className="p-2 py-5" style={{ borderBottom: `2px solid ${Colors.ThemeBlue}` }}>
                    <div className="flex justify-between">
                        <div>
                            <h3 style={{ color: Colors.ThemeBlue }}>Customer</h3>
                            <p className="text-xs p-0.5">Company Name : {data?.customerDetails?.companyName || '-'}</p>
                            <p className="text-xs p-0.5">Customer Name : {data?.customerDetails?.name || '-'}</p>
                            <p className="text-xs p-0.5">Customer Contact No : {data?.customerDetails?.contact || '-'}</p>
                            <p className="text-xs p-0.5">Customer Email ID : {data?.customerDetails?.email || '-'}</p>
                        </div>
                        <div>
                            <h3 style={{ color: Colors.ThemeBlue }}>Quotation</h3>
                            <p className="text-xs p-0.5">Quotation Ref No: <b>{data?.quotationRefNo}</b></p>
                            <p className="text-xs p-0.5">Date: <b>{quotationDate}</b></p>
                        </div>
                    </div>

                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                    <thead>
                        <tr style={{ backgroundColor: Colors.ThemeBlue, color: "#fff", textAlign: "left" }}>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Product / Varient</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Qty</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Rate</th>
                            <th style={{ padding: 8, border: "1px solid #ddd" }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.products?.map((ele, i) => {
                                return (
                                    <tr>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.product_id?.productName + ' / ' + ele?.productVarient?.varientName + ele?.productVarient?.varientUnit}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.qty}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{ele?.price}</td>
                                        <td style={{ padding: 8, border: "1px solid #ddd" }}>{Number(ele?.price) * Number(ele.qty)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {/* Total Calculation */}
                <div style={{ marginTop: 20, textAlign: "right" }}>
                    <h3><b>Total: ₹{calculateTotalPrice(data.products)}</b></h3>
                </div>


                <div
                    dangerouslySetInnerHTML={{ __html: data?.termsAndConditions }}
                    className="terms-container"
                />

                {/* Terms & Notes */}
                {/* <div style={{ marginTop: 20 }}>
                    <h4 className="text-black font-bold">Terms and Conditions:</h4>
                    {
                        data?.termsAndConditions?.map((ele, index) => {
                            return (
                                <p className="text-xs">{index + 1}. {ele.title}</p>
                            )
                        })
                    }
                </div>

                <div style={{ marginTop: 20 }}>
                    <h4 className="text-black font-bold">Additional Notes:</h4>
                    <p className="text-xs p-0.5">
                        The delivery schedule offered or committed is merely an indicative time of delivery which is not firm
                        and the same may vary or change depending upon various factors relating to the Contract. Therefore, the
                        Company does not assume any liability in the form of late delivery charges or penalty for having failed to maintain
                        the time schedule
                    </p>
                </div> */}

                <div className="mt-20 flex justify-between">
                    <div>
                    <h4 className="text-black font-bold">Thanking you,</h4>
                    <p className="text-xs p-0.5">Best Regards</p>
                    <p>{name}</p>
                    <p>+91-{contact}</p>
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

export default QuotaionPDF;