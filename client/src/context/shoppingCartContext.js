import React, { useState, useContext } from 'react';

const ShoppingCartContext = React.createContext({
    items: [],
    setItems: () => { }
});

export function ShoppingCartProvider(props) {
    const setItems = (items) => {
        setState({ ...state, items: items });
    }

    const initialState = {
        items: [],
        setItems: setItems,
    };

    const [state, setState] = useState(initialState);


    return (
        <ShoppingCartContext.Provider value={state}>
            {props.children}
        </ShoppingCartContext.Provider>
    );
}

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

