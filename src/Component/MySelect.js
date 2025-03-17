import React, { useEffect, useRef, useState } from 'react';

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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isAbove, setIsAbove] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsAbove(checkIfDropdownShouldOpenAbove());
  };

  const handleOptionClick = (option) => {
    onChange(option);
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

    return buttonRect.bottom + 200 > windowHeight; // 200 is an estimated dropdown height
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700">
        {title}
        {important && <span className="text-red-600 text-base">*</span>}
      </label>
      <button
        ref={buttonRef}
        className={`mt-1 w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
          disable ? 'bg-gray-200 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={toggleDropdown}
        disabled={disable}
      >
        {selectedValue ? selectedValue : `Enter ${name}`}
      </button>

      {isOpen && (
        <ul
          className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{ maxHeight: '200px', overflowY: 'auto' }}
        >
          {options?.map((option) => (
            <li
              key={option?.value}
              onClick={() => handleOptionClick(option)}
              className="block cursor-pointer select-none py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
            >
              {option?.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MySelect;