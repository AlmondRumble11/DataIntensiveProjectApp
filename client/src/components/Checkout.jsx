
import React from 'react';
import { useShoppingCart } from '../context/shoppingCartContext';
import { Box, Card, Typography, CardContent, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';


export default function Checkout() {

    const { t } = useTranslation(['i18n']);
    const shoppingCart = useShoppingCart();

    const books = shoppingCart.items ?? [];

    const removeItem = (bookIdToRemove) => {
        const newItems = shoppingCart.items.filter(item => item.Id !== bookIdToRemove);
        shoppingCart.setItems(newItems);
    }
    return (
        <div>

            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('Checkout')}</h1>
            </Box>
            {books?.map((book) => (
                <ShoppingCartItem key={book.Id} book={book} removeItem={removeItem} />
            ))}
            {!books?.length > 0 && <div>{t('EmptyCart')}</div>}
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

                        <Typography align='left' variant="h4" component="div">
                            {book.Title}
                        </Typography>
                        <Typography align='right' variant="h4" component="div">
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