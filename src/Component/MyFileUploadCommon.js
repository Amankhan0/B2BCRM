import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApiHitUploadData } from "../utils";
import { uploadFile } from "../Constants/Constants";
import FileRenderer from "./FileRender";
import { setDataAction } from "../Store/Action/SetDataAction";
import { SET_API_JSON } from "../Store/ActionName/ActionName";
import ImageViewer from "./ImageViewer";

const MyFileUploadCommon = ({ name, title, error, important, uppercase, fileType, validate, onChange }) => {

    const ApiReducer = useSelector(state => state.ApiReducer)

    const [fileId, setFileId] = useState(null)
    const dispatch = useDispatch()

    const onFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        for (const [index, file] of files.entries()) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);
            const result = await ApiHitUploadData(formData, uploadFile);
            if (result && !onChange) {
                var oldJson = ApiReducer?.apiJson
                if (fileType === 'array' && !onChange) {
                    if (Array.isArray(oldJson[name])) {
                        oldJson[name].push({ "title": file.name, "url": result.data._id })
                        setFileId(result.data._id)
                    } else {
                        oldJson[name] = [{ "title": file.name, "url": result.data._id }]
                        setFileId(result.data._id)
                    }
                } else {
                    oldJson[name] = {
                        "title": file.name,
                        "url": result.data._id
                    }
                    setFileId(result.data._id)
                }
                if(validate){
                    validate(name, oldJson[name]);
                }
                dispatch(setDataAction(oldJson, SET_API_JSON))
            }

            if (result && onChange) {
                var oldJson = {}
                if (fileType === 'array' && !onChange) {
                    if (Array.isArray(oldJson[name])) {
                        oldJson[name].push({ "title": file.name, "url": result.data._id })
                        setFileId(result.data._id)
                    } else {
                        oldJson[name] = [{ "title": file.name, "url": result.data._id }]
                        setFileId(result.data._id)
                    }
                } else {
                    oldJson[name] = {
                        "title": file.name,
                        "url": result.data._id
                    }
                    setFileId(result.data._id)
                }
                onChange(oldJson);
            }
        }
    }

    console.log('ApiReducer?.apiJson?.[name]',ApiReducer?.apiJson?.[name]);

    return (
        <div>
            <label className='w-full text-black'>{title}{important ? <span className='text-red-600 text-base'>*</span> : ''}</label>
            <div className="gap-2">
                <input type="file" style={{ textTransform: uppercase ? 'uppercase' : '' }} onChange={(e) => onFileUpload(e)} className={`mt-1 w-full outline-none h-max p-2 text-md rounded-lg border border-slate-400 placeholder:normal-case hover:border-slate-400 pl-2`} name={name} />
                <p className="text-xs">{Array.isArray(ApiReducer?.apiJson?.[name]) && "Last file - " + ApiReducer?.apiJson?.[name]?.[0]?.title}</p>
                </div>
            <label className='w-full text-red-600'>{error}</label>
        </div>
    )
}

export default MyFileUploadCommon;