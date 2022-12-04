import React from 'react'
import { useState, useEffect } from 'react';
import Book from './Book';
import AddBookDialog from './AddBookDialog';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import {Button, } from '@mui/material';
export default function Home() {
    const { t } = useTranslation(['i18n']);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [open, setOpen] = React.useState(false);


    useEffect(() => {
        getFeaturedBooks();
    }, []);

    const getFeaturedBooks = () => {
        setLoading(true);
        setError(false);

        fetch('http://localhost:3001/book/featured', {
            mode: 'cors'
        })
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => {
                setError(error);
                console.log('error loading books', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const setModalState = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t("Featured books")}</h1>
            </Box>
            <Button variant="outlined" onClick={setModalState}>Add new book</Button>
            <AddBookDialog open={open} onClose={handleClose}></AddBookDialog>
            { books.map((book) => (
                <Book key={book.Id} book={book} />
            ))}
            {!books?.length > 0 && <div>{t('No books')}</div>}

        </div>
    )

}