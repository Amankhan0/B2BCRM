import React from "react";

const MyLoader = ({ size }) => {

    return (
        <div className="w-max">
            <div className="flex gap-x-2 items-center">
                <div className={`spinner size-4 animate-spin rounded-full border-[2px] border-r-sky-500`}></div>
            </div>
        </div>
    )
}

export default MyLoader;