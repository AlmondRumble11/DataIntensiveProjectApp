
import React from 'react';
import { useShoppingCart } from '../context/shoppingCartContext';
import { Box, Card, Typography, CardContent, Button, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';


export default function Checkout() {

    const { t } = useTranslation(['i18n']);
    const shoppingCart = useShoppingCart();

    const books = shoppingCart.items ?? [];

    const removeItem = (bookIdToRemove) => {
        const newItems = shoppingCart.items.filter(item => item.Id !== bookIdToRemove);
        shoppingCart.setItems(newItems);
    }

    const checkout = () => {

        // TODO transaction

        shoppingCart.setItems([]);
    }

    const canCheckout = books?.length > 0;

    return (
        <div>
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
                        Yhteensä: {books?.reduce((totalPrice, book) => totalPrice + book.Price, 0)}€
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