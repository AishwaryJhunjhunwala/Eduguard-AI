import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newIsDark = !isDarkMode;

    if (newIsDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setIsDarkMode(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return { isDarkMode, toggleTheme };
};
