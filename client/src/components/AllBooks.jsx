import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Book from './Book';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';


export default function AllBooks() {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState({'searchTerm': ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { t } = useTranslation(['i18n']);
    
    useEffect(() => {
        getAllBooks();
    }, []);

    const whenChanging = (event) => {
        setSearchTerm({...searchTerm, [event.target.id]: event.target.value})
    }

    const keyPress = (event, value) => {
        if(event.keyCode === 13){
            let searchValue = searchTerm.searchTerm;
            searchValue = searchValue.trim();
            if(searchValue !== ''){
                getBooksSearch(searchValue);
            }    
        } 
    };

    const searchButtonPress = (event) => {
        let searchValue = searchTerm.searchTerm;
        searchValue = searchValue.trim();
        if(searchValue !== ''){
            getBooksSearch(searchValue);
        }  
    }

    const getBooksSearch = (searchValue) => {

        fetch(`http://localhost:3001/book/search/${searchValue}`, {
            method: 'GET',
            mode: 'cors'
        }).then(res => {
            if (res.ok) {
                return res.json().then(data => {
                    setBooks(data)
                }).catch(err => {
                    return Promise.resolve({ res: res });
                })
            } else if (res.status !== 201) {
                res.json().then(data => {
                    setError(data.message)
                    console.log(error);
                })
            }
            else {
                return res.json().catch(err => {
                    throw new Error(res.statusText);
                }).then(data => {
                    throw new Error(data.error.message);
                })
            }
        })
    }
   

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
    };

    if (loading) {
        return (
            <div>
                <Typography sx={{ mt: 20 }} variant='h4'>
                    {t('Loading')}
                </Typography>
            </div>
        )
    };

    return (
        <div>
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('All books')}</h1>
                <SearchBar whenChanging={whenChanging} keyPress={keyPress} onClick={searchButtonPress}></SearchBar>
            </Box>
            {books.map((book) => (
                <Book key={book.Id} book={book} />
            ))}
            {!books?.length > 0 && <div>{t('No books')}</div>}
        </div>
    )
}

