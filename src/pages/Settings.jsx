import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Settings() {
  const {theme , setTheme} = useContext(AuthContext)

  // Handle theme toggle
  const handleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-12 mt-10">
      <div className="flex flex-col">
        <div className="form-control w-52">
          <label className="label cursor-pointer">
            <p className="label-text">Theme</p>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={theme === 'dark'}
              onChange={handleTheme}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
