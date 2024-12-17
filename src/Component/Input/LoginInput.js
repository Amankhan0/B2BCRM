import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_API_JSON } from '../../Store/ActionName/ActionName';
import { setDataAction } from '../../Store/Action/SetDataAction';

function LoginInput({ imp, label, error, errormsg, name, title, important, type, defaultValue,lowercase , disabled}) {

  console.log("error",error);
  
  const dispatch = useDispatch();
  const ApiReducer = useSelector((state) => state.ApiReducer);
  const handleChange = (e) => {
    console.log('name:', name);
    const updatedApiJson = { ...ApiReducer.apiJson, [name]:lowercase ? `${e.target.value}`.toLowerCase() : e.target.value };
    dispatch(setDataAction(updatedApiJson, SET_API_JSON));
  };

  return (
    <div>
      <div>
        <label
          htmlFor="PAN"
          className="block mb-2 text-sm font-medium text-left text-black dark:text-navy-200"
        >
          {label}
          <span className="text-xs text-red-600">{imp ? '*' : ''}</span>
        </label>
        <input
          placeholder={`Enter ${label}`}
          className={`bg-transparent placeholder:normal-case mb-2 text-black dark:text-navy-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 h-10 border border-gray-300 ${lowercase ? 'lowercase' : ''}`}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      {console.log("error",error)
      }
      {error && <div className='text-red-600'>{ApiReducer?.apiJsonError[name]}</div>}
    </div>
  );
}

export default LoginInput;
