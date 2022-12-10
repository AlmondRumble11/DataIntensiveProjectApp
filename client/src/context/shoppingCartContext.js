import React, { useState, useContext } from 'react';

const storageKey = 'shoppingCart';

const ShoppingCartContext = React.createContext({
    items: [],
    setItems: () => { }
});

export function ShoppingCartProvider(props) {
    const setItems = (items) => {
        const newState = { ...state, items: items };

        sessionStorage.setItem(storageKey, JSON.stringify(items));
        setState(newState);
    }


    function getStoredItems() {
        const storedItems = sessionStorage.getItem(storageKey);
        if (storedItems) {
            return JSON.parse(storedItems);
        }

        return [];
    }


    const [state, setState] = useState({
        items: getStoredItems(),
        setItems: setItems,
    });


    return (
        <ShoppingCartContext.Provider value={state}>
            {props.children}
        </ShoppingCartContext.Provider>
    );
}

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

