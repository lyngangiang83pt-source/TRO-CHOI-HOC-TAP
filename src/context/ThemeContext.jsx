import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundFx } from '../lib/soundFx';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
    localStorage.setItem('cap2_theme', 'light');
  }, [theme]);

  const toggleTheme = () => {
    soundFx.play('click');
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
