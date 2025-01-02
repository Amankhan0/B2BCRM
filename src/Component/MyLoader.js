import React from "react";

const MyLoader = ({ size }) => {

    return (
        <div className="w-max">
            <div className="flex gap-x-2 items-center">
                <div className={`spinner w-4 h-4 animate-spin border-r-sky-500`}></div>
            </div>
        </div>
    )
}

export default MyLoader;