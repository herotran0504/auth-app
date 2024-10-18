import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const colorThemes = [
    { primary: '#6a5acd', hover: '#5c4aab' }, // Slate Blue
    { primary: '#ff7f50', hover: '#ff6347' }, // Coral
    { primary: '#20b2aa', hover: '#1e8a82' }, // Light Sea Green
    { primary: '#9370db', hover: '#7b68ee' }, // Medium Purple
    { primary: '#3cb371', hover: '#2e8b57' }, // Medium Sea Green
    { primary: '#ffd700', hover: '#ffcc00' }, // Gold
    { primary: '#ff8c00', hover: '#ff7f50' }, // Dark Orange
    { primary: '#4682b4', hover: '#4169e1' }, // Steel Blue
    { primary: '#f08080', hover: '#cd5c5c' }, // Light Coral
    { primary: '#00ced1', hover: '#20b2aa' }, // Dark Turquoise
];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({});

    useEffect(() => {
        const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)];
        setTheme(randomTheme);
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
