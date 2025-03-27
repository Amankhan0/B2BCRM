import React from 'react'
import { Colors } from '../../Colors/color';
import { crossIcon } from '../../Icons/Icon';
import Title from '../../Component/Title';
import DataTable from '../../Component/DataTable';

function SupplierBankDetailsView({ addressesArr, title, onCloseClick }) {

    const th = ['Beneficiary Name', 'Bank Name', 'Branch Name','IFSC Code', 'Account No.']

    console.log(addressesArr,'shipping');

    let td;
    td = addressesArr.map((ele, i) => {
        return (
            <tr>
                <td className='min-w-[100px] p-2 border text-black'>{ele?.beneficiaryName || '-'}</td>
                <td className='min-w-[100px] p-2 border text-black'>{ele?.bankName || '-'}</td>
                <td className='min-w-[100px] p-2 border text-black'>{ele?.branchName || '-'}</td>
                <td className='min-w-[100px] p-2 border text-black'>{ele?.ifscCode || '-'}</td>
                <td className='min-w-[100px] p-2 border text-black'>{ele?.accountNo || '-'}</td>
            </tr>
        )
    })

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
            <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
            <div className={`relative rounded-lg card w-[80%] text-center transition-opacity duration-300`}>
                <div className="flex justify-between rounded-tl-lg rounded-tr-lg p-2" style={{ background: Colors.ThemeBlue }} onClick={onCloseClick}>
                    <div>
                        <Title size={'lg'} color={Colors.WHITE} title={title} />
                    </div>
                    <div className='text-white cursor-pointer'>
                        {crossIcon}
                    </div>
                </div>
                <div className='p-10'>
                    <DataTable hidePagination={true} th={th} td={td} />
                </div>
            </div>
        </div>
    )
}

export default SupplierBankDetailsView;