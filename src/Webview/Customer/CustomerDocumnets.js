import React, { useEffect, useState } from "react";
import { crossIcon } from "../../Icons/Icon";
import Title from "../../Component/Title";
import { Colors } from "../../Colors/color";
import { ApiHit } from "../../utils";
import { download } from "../../Constants/Constants";
import { getAuthToken, logOutAuthenticatedUser } from "../../Storage/Storage";
import axios from "axios";
import FileRenderer from "./FileRenderer";

const CustomerDocumnets = ({ data, onClickClose }) => {
    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5`} role="dialog">
            <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"></div>
            <div className={`relative rounded-lg card w-[80%] text-center transition-opacity duration-300`}>
                <div className="flex justify-between rounded-tl-lg rounded-tr-lg p-2" style={{ background: Colors.ThemeBlue }}>
                    <div>
                        <Title size={'lg'} color={Colors.WHITE} title={'GST'} />
                    </div>
                    <div onClick={onClickClose} className='text-white cursor-pointer'>
                        {crossIcon}
                    </div>
                </div>
                <div className="text-left p-20 h-[80vh] overflow-scroll">
                    <div  className="mt-10">
                        <Title size={'lg'} color={Colors.BLACK} title={'GST Documnet'} />
                        {
                            <FileRenderer fileId={data?.gst?.[0]?.url} />
                        }
                    </div>
                    <div className="mt-10">
                        <Title size={'lg'} color={Colors.BLACK} title={'Pan Card Documnet'} />
                        {
                            <FileRenderer fileId={data?.pancard?.[0]?.url} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerDocumnets;