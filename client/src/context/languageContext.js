import React, { useState, useContext } from 'react';


const LanguageContext = React.createContext({
    language: 'EN',
    setLanguage: () => { }
});

export function LanguageContextProvider(props) {
    const setLanguage = (language) => {
        setState({ ...state, language: language });
    }

    const initialState = {
        language: 'EN',
        setLanguage: setLanguage,
    };

    const [state, setState] = useState(initialState);

    return (
        <LanguageContext.Provider value={state}>
            {props.children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}