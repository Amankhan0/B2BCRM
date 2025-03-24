import React, { useRef } from "react";
import jsPDF from "jspdf";

const QuotaionPDF = ({ data, quotationDate, name, contact }) => {

    const contentRef = useRef(null);

    const downloadPDF = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.html(contentRef.current, {
            callback: function (pdf) {
                pdf.save("TermsAndConditions.pdf");
            },
            x: 10,
            y: 10,
            width: 190, // Fit to A4 width
            windowWidth: 800, // Render full HTML properly
        });
    };

    return (
        <div>
            <div ref={contentRef} style={{ padding: "20px", background: "#fff" }}>
                <div
                    dangerouslySetInnerHTML={{ __html: data?.termsAndConditions }}
                    className="terms-container"
                />
            </div>
            <button
                onClick={downloadPDF}
                style={{
                    marginTop: "20px",
                    padding: "10px",
                    background: "blue",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Download PDF
            </button>
        </div>
    );
};

export default QuotaionPDF;
