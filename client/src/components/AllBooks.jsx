import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Book from './Book';
import Box from '@mui/material/Box';
import {useTranslation} from 'react-i18next';


export default function AllBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const {t} = useTranslation(['i18n']);
    useEffect(() => {
        getAllBooks();
    }, []);

    const getAllBooks = () => {
        setLoading(true);
        setError(false);

        fetch('http://localhost:3001/book/all', {
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

    if (loading) {
        return (
            <div>
                <Typography sx={{mt: 20}} variant='h4'>
                    {t('Loading')}
                </Typography>
            </div>
        )
    }

    return (
        <div>
        <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
            <h1 align='left'>{t('All books')}</h1>
        </Box>
        {books.map((book) => (
            <Book key={book.Id} book={book} />
        ))}
        {!books?.length > 0 && <body>{t('No books')}</body>}
        </div>
    )
}

