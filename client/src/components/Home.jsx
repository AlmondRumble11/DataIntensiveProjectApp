import React, { useState, useEffect } from 'react'
import Book from './Book';
import { Box, Button, Alert, AlertTitle} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import AlertComponent from './AlertComponent';

export default function Home() {
    const { t } = useTranslation(['i18n']);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [alertValues, setAlertValues] = useState({
        msg: "Book was added to cart.",
        status: true,
        title: "Success",
        severity: "success"});
    const [bookAdded, setBookAdded] = useState(false);
    let isCountrySelected = false
    let navigate = useNavigate();

   


    useEffect(() => {
        if (sessionStorage.getItem('countryCode')) {
            isCountrySelected = true;
        }
        if (isCountrySelected) {
            getFeaturedBooks();
        }else{
            navigate(`/location`, { replace: true })
        }   
        
    }, []);

    const handleAddedBook = (value) => {
        setBookAdded(value);
    }
    
    const getFeaturedBooks = () => {
        setLoading(true);
        setError(false);

        fetch('http://localhost:3001/book/featured', {
            mode: 'cors',
            headers: {
                'countrycode': sessionStorage.getItem('countryCode')
            }
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


    return (
        <div>
            {bookAdded &&  <AlertComponent response={alertValues} handleClose={handleAddedBook}/>}
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t("Featured books")}</h1>
            </Box>
            { books.map((book) => (
                <Book key={book.Id} book={book} handleAddedBook={handleAddedBook}/>
            ))}
            {!books?.length > 0 && <div>{t('No books')}</div>}

        </div>
    )

}