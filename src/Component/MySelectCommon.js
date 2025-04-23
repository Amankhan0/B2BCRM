import React, { useEffect, useRef, useState } from 'react';
import { SET_API_JSON } from '../Store/ActionName/ActionName';
import { useDispatch, useSelector } from 'react-redux';
import { setDataAction } from '../Store/Action/SetDataAction';
import { dropdownArrowIcon } from '../SVG/Icons';

function MySelect({
  selectedValue,
  name,
  disable,
  title,
  error,
  parent,
  important,
  uppercase,
  options,
  onChange,
  keyName,
  placeholder,
  errorMsg,
  validate,
  enableSearch,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null); // Added search input ref
  const [isAbove, setIsAbove] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  const ApiReducer = useSelector((state) => state.ApiReducer);

  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsAbove(checkIfDropdownShouldOpenAbove());
    if(!isOpen && enableSearch){
      setSearchTerm('');
      setFilteredOptions(options);
    }
  };

  const handleOptionClick = (option) => {
    if (onChange) {
      onChange(option);
    } else {
      onChangeText(option?.value);
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  const checkIfDropdownShouldOpenAbove = () => {
    if (!buttonRef.current) return false;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    return buttonRect.bottom + 200 > windowHeight;
  };

  const onChangeText = (value) => {
    const newJson = ApiReducer.apiJson;
    if (parent) {
      newJson[parent] = { ...newJson[parent], [name]: value };
      if (validate) {
        validate(`${parent}.${name}`, value);
      }
    } else {
      newJson[name] = value;
      if (validate) {
        validate(`${name}`, value);
      }
    }
    dispatch(setDataAction(newJson, SET_API_JSON));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (enableSearch) {
      const filtered = options?.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options, enableSearch]);

  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      searchInputRef.current.focus(); // Focus on search input when dropdown opens
    }
  }, [isOpen, enableSearch]);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700">
        {title}
        {important && <span className="text-red-600 text-base">*</span>}
      </label>
      <button
        ref={buttonRef}
        className={`mt-1 w-full h-10 rounded-md border border-slate-400 bg-white py-2 pl-3 pr-3 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex items-center justify-between ${
          disable ? 'bg-gray-200 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={toggleDropdown}
        disabled={disable}
      >
        <span>{selectedValue ? selectedValue : placeholder}</span>
        {dropdownArrowIcon}
      </button>

      {isOpen && (
        <div
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          {enableSearch && (
            <input
              ref={searchInputRef} // Set the ref to the search input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-b border-gray-200"
            />
          )}

          <ul style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredOptions?.map((option) => (
              <li
                key={option?.value}
                onClick={() => handleOptionClick(option)}
                className="block cursor-pointer select-none py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
              >
                {option?.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!errorMsg && (
        <p className="w-full text-red-600">
          {error && ApiReducer.apiJsonError[name] ? title + ' is Required' : ''}
        </p>
      )}
      {errorMsg && <p className="w-full text-red-600">{errorMsg}</p>}
    </div>
  );
}

export default MySelect;