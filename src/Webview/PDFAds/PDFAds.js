import React, { useEffect, useState } from "react";
import MyFileUpload from "../../Component/MyFileUpload";
import MyButton from "../../Component/MyButton";
import { useSelector } from "react-redux";
import { ApiHit, ApiHitUploadData } from "../../utils";
import { fileDelete, fileUpdate, searchFile } from "../../Constants/Constants";
import FileRenderer from "../Customer/FileRenderer";
import { deleteIcon } from "../../Icons/Icon";
import toast from "react-hot-toast";

const PDFAds = () => {

    const ApiReducer = useSelector(state => state.ApiReducer);
    const [data, setData] = useState(null)

    useEffect(() => {
        if (data === null) {
            var json = {
                page: 1,
                limit: 10,
                search: {
                    ads: true
                }
            }
            ApiHit(json, searchFile).then(res => {
                if (res?.content) {
                    setData(res?.content)
                } else {
                    setData([])
                }
                console.log('res', res);
            })
        }
    }, [])

    // const onClick = (index) => {
    //     const formData = new FormData();
    //     formData.append('_id', data[index]._id);
    //     formData.append('active', data[index].active === true ? false : true);
    //     ApiHitUploadData(formData, fileUpdate).then(res => {
    //         toast.success('File updated successfully')
    //         window.location.reload()
    //     })
    // }

    const onClickDelete = (id) => {
        var json = {
            _id: id
        }
        ApiHit(json, fileDelete).then(res => {
            toast.success('File deleted successfully')
            window.location.reload()
        })
    }

    return (
        <div>
            {
                data !== null &&
                data?.length !== 1 &&
                <div className="mt-10 card p-4 rounded-lg">
                    <MyFileUpload ads={true} title={'Upload file'} />
                </div>
            }
            <div className="grid grid-cols-3 gap-2 mt-10">
                {
                    data !== null &&
                    data?.map((ele, i) => {
                        return (
                            <div className="card p-4">
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <p>{ele?.filename}</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <i onClick={() => onClickDelete(ele?._id)} className="text-red-500 -mt-1 cursor-pointer">{deleteIcon}</i>
                                        {/* <input onChange={() => onClick(i)} checked={ele?.active} className="mb-3 cursor-pointer" type="checkbox" /> */}
                                    </div>
                                </div>
                                <FileRenderer fileId={ele?._id} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PDFAds;