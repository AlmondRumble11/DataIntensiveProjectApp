import React, { useState, useContext } from 'react';

const storageKey = 'language';
const defaultLanguage = "EN";

const LanguageContext = React.createContext({
    language: defaultLanguage,
    setLanguage: () => { }
});

export function LanguageContextProvider(props) {
    const setLanguage = (language) => {
        const newState = { ...state, language: language };

        sessionStorage.setItem(storageKey, JSON.stringify(language));
        setState(newState);
    }

    function getStoredLanguage() {
        const existingState = sessionStorage.getItem(storageKey);
        if (existingState) {
            return JSON.parse(existingState);
        }

        return defaultLanguage;
    }


    const [state, setState] = useState({
        language: getStoredLanguage(),
        setLanguage: setLanguage,
    });

    return (
        <LanguageContext.Provider value={state}>
            {props.children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}