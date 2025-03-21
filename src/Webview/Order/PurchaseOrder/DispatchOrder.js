import React, { useState } from "react";
import MyFileUpload from "../../../Component/MyFileUpload";
import MyButton from "../../../Component/MyButton";
import { smallMoneyIcon } from "../../../Icons/Icon";

const DispatchOrder = ({ data }) => {

    const [loader, setLoader] = useState(null)

    console.log('data--', data);

    const onClickDispatch = () =>{
        
    }

    return (
        <div className='mt-7'>
            <div className='mx-5'>
                <MyFileUpload title={'Vendor Invoice'} name={'vendorInvoice'} />
            </div>
            <div className='m-5'>
                <MyFileUpload title={'Headsup Invoice'} name={'headsupInvoice'} />
            </div>
            <div className='m-5'>
                <MyButton type={loader === 'dispatch' && 'loader'} title={'Dispatch'} onClick={() => onClickDispatch()} icon={smallMoneyIcon} className={'h-10 text-xs w-max'} />
            </div>
        </div>
    )
}

export default DispatchOrder;