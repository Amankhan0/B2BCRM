import jsPDF from 'jspdf';
import React from 'react'
import MyButton from './MyButton';
import { DOWNLOADICON } from '../SVG/Icons';
import 'jspdf-autotable'
import { CSVLink } from 'react-csv';

function ViewTripFilter({ fetchData, fetchDataBySearch, th, td }) {

    const onChange = (value, type) => {
        if (type === 'select') {
            fetchData(value !== 'All' && { find: value })
        } else {
            console.log('value', value);
            if (value === '') {
                fetchData()
            }
            if (value?.length > 3) {
                fetchDataBySearch({
                    "$text": {
                        "$search": value
                    }
                })
            }
        }
    }

    const PrintPdf = () => {
        // Remove "Action" column from header
        const filteredTh = th.filter((header) => header !== 'Action');

        // Remove "Action" column from body data
        const filteredBodyData = GenerateData().map((row) =>
            row.filter((_, index) => th[index] !== 'Action')
        );

        // Create a new PDF document
        const pdf = new jsPDF('p', 'pt', [3000, 3000]);

        // Generate table without "Action" column
        pdf.autoTable({
            head: [filteredTh], // Filtered headers
            body: filteredBodyData, // Filtered body rows
            startY: 20,
            theme: 'striped',
        });

        // Save the PDF file
        pdf.save('TripData.pdf');
    };

    const GenerateData = () => {
        // Extract row data from `td`
        const rowTD = [];
        td?.map((item) =>
            rowTD.push(item?.props?.children?.map((ele) => ele?.props?.children))
        );
        return rowTD;
    };

    return (
        <div className='flex justify-between ml-10 mt-10'>
            <div className='flex gap-4'>
                <div>
                    <p className='text-black ml-1'>Search here</p>
                    <input onChange={(e) => onChange(e.target.value, 'search')} className='p-2 rounded-xl border-slate-300 mb-2' placeholder='Search here...' />
                </div>
                <div>
                    <p className='text-black ml-1'>Status</p>
                    <select className='p-2 rounded-xl w-28 border-slate-300 mb-2' onChange={(e) => onChange(e.target.value, 'select')}>
                        <option>All</option>
                        <option value='Running'>Active</option>
                        <option>Ended</option>
                        <option>Cancelled</option>
                    </select>
                </div>
            </div>
            <div className='flex gap-4 mr-14 mt-4'>
                <CSVLink data={GenerateData()} headers={th} className='flex items-center' filename={'TripData' + '.csv'}>
                    <MyButton title='Download EXCEL' icon={DOWNLOADICON} />
                </CSVLink>
                <div className='mt-1'>
                    <MyButton onClick={() => PrintPdf()} title='Download PDF' icon={DOWNLOADICON} />
                </div>
            </div>
        </div>
    )
}

export default ViewTripFilter