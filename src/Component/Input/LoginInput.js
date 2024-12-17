import React from 'react'

function LoginInput({imp}) {
  return (
    <div>
           <div>
          <label
            htmlFor="PAN"
            className="block mb-2 text-sm font-medium text-left text-black dark:text-navy-200"
          >
            PAN<span className="text-xs text-red-600">{imp ? '*' :''}</span>
          </label>
          <input
            placeholder="PAN"
            className="bg-transparent placeholder:normal-case mb-2 text-black dark:text-navy-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500 h-10 border border-gray-300 uppercase"
            id="Pan"
            maxLength={10}
            defaultValue=""
          />
        </div>
    </div>
  )
}

export default LoginInput
