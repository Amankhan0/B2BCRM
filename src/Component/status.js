import React, { useState } from 'react';

export const Status = ({ title,className,titleClass }) => {
  return (
    <div className={`rounded-md ${className}`}>
      <p className={titleClass}>{title}</p>
    </div>
  );
};