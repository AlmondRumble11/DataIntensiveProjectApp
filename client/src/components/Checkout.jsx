
import React from 'react';
import { useShoppingCart } from '../context/shoppingCartContext';
import { Box, Card, Typography, CardContent, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AlertComponent from './AlertComponent';
import { useState } from 'react';


export default function Checkout() {

    const { t } = useTranslation(['i18n']);
    const shoppingCart = useShoppingCart();
    const books = shoppingCart.items ?? [];
    const [alertValues, setAlertValues] = useState({
        msg: "",
        status: true,
        title: "",
        severity: ""});
    const [checkoutComplete, setCheckoutComplete] = useState(false);
    const [checkoutError, setCheckoutError] = useState(false);

    const handleCheckoutComplete = (value) => {
        setCheckoutComplete(value);
    }

    const handleCheckoutError = (value) => {
        setCheckoutError(value);
    }

    const removeItem = (bookIdToRemove) => {
        const newItems = shoppingCart.items.filter(item => item.Id !== bookIdToRemove);
        shoppingCart.setItems(newItems);
    }

    const checkout = () => {
        let jwt = sessionStorage.getItem('token');

        fetch('http://localhost:3001/api/transaction/checkout', {
            method: 'POST',
            headers: {'Content-type': 'application/json', 'countrycode': sessionStorage.getItem('countryCode'), 'Authorization': `Bearer ${jwt}`},
            body: JSON.stringify({shoppingBasket: shoppingCart.items}),
            mode: 'cors'
        }).then(res => {
            if(res.ok){
                return res.json().then(data => {
                    setAlertValues({
                        msg: `${data.message}. Books were added to your inventory.`,
                        status: true,
                        title: "Success",
                        severity: "success"});
                    handleCheckoutError(false);
                    handleCheckoutComplete(true);
                    shoppingCart.setItems([]);
                }).catch(err => {
                    return Promise.resolve({res: res});
                })
            }else if(res.status === 409){
                res.json().then(data => {
                    setAlertValues({
                        msg: `${data.message}: ${data.books.map((book) => ' ' + book.Title)}. Please remove them and try again.`,
                        status: false,
                        title: "Oops...",
                        severity: "warning"});
                    handleCheckoutError(true);
                    handleCheckoutComplete(false);
                })
            }else if(res.status === 403){
                res.json().then(data => {
                    setAlertValues({
                        msg: `${data.message}. Please login to purchase books`,
                        status: false,
                        title: "Error",
                        severity: "error"});
                        handleCheckoutError(true);
                        handleCheckoutComplete(false);
                })
            }
            else if(res.status !== 201){
                res.json().then(data => {
                    setAlertValues({
                        msg: data.message,
                        status: false,
                        title: "Error",
                        severity: "error"});
                        handleCheckoutError(true);
                        handleCheckoutComplete(false);
                })
            }
            else{
                return res.json().catch(err => {
                    throw new Error(res.statusText);
                }).then(data => {
                    throw new Error(data.error.message);
                })
            }
        })

        
    }

    const canCheckout = books?.length > 0;

    return (
        <div>
            {checkoutComplete &&  <AlertComponent response={alertValues} handleClose={handleCheckoutComplete}/>}
            {checkoutError &&  <AlertComponent response={alertValues} handleClose={handleCheckoutError}/>}
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('Checkout')}</h1>
            </Box>

            {books?.map((book) => (
                <ShoppingCartItem key={book.Id} book={book} removeItem={removeItem} />
            ))}
            {!canCheckout && <div style={{ margin: '1rem' }}>{t('EmptyCart')}</div>}

            <Divider />

            <Box sx={{ border: 0, width: '60%', margin: 'auto', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>
                        Total: {books?.reduce((totalPrice, book) => totalPrice + book.Price, 0).toFixed(2)}€
                    </p>
                    <div style={{ margin: 'auto 0' }}>
                        <Button disabled={!canCheckout} onClick={() => checkout()} variant="contained">{t('Checkout')}</Button>
                    </div>
                </div>
            </Box>
        </div>
    )
}


const ShoppingCartItem = ({ book, removeItem }) => {
    const { t } = useTranslation(['i18n']);
    return (
        <Box sx={{ border: 0, width: '60%', margin: 'auto', mb: 1.5 }}>
            <Card variant="outlined">
                <CardContent sx={{ borderRadius: 2, border: '1.5px solid black' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>

                        <Typography align='left' variant="h5" component="div">
                            {book.Title}
                        </Typography>
                        <Typography align='right' variant="h5" component="div">
                            {book.Price}€
                        </Typography>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button sx={{ maxHeight: '40px' }} variant="contained" onClick={() => removeItem(book.Id)}>{t('Remove')}</Button>
                    </div>

                </CardContent>
            </Card>
        </Box >
    );
}