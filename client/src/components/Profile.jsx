import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import UserDetails from './UserDetails'
import OwnedBook from './OwnedBook'
import { Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddBookDialog from './AddBookDialog';
import AlertComponent from './AlertComponent';

export default function Profile() {
    const [addedBookResponse, setAddedBookResponse] = useState(null);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = React.useState(false);
    const [books, setBooks] = useState([]);
    const { t } = useTranslation(['i18n']);

    useEffect(() => {
        if (sessionStorage.getItem('token')) {
            getUserProfile();
            getUserBooks();
        }
    }, []);

    const getUserProfile = () => {
        setLoading(true);
        setError(false);
        let jwt = sessionStorage.getItem('token');


        fetch('http://localhost:3001/api/customer/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${jwt}`, 'countrycode': sessionStorage.getItem('countryCode')},
            mode: 'cors'
        }).then(res => {
            if (res.ok) {
                return res.json().then(data => {
                    setUser(data)
                    setLoading(false);
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

    const getUserBooks = () => {
        setLoading(true);
        setError(false);
        let jwt = sessionStorage.getItem('token');


        fetch('http://localhost:3001/api/customer/books', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${jwt}`, 'countrycode': sessionStorage.getItem('countryCode')},
            mode: 'cors'
        }).then(res => {
            if (res.ok) {
                return res.json().then(data => {
                    setBooks(data)
                    setLoading(false);
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

    const handleAddedBookResponse = (data) =>{
        setAddedBookResponse(data);
    }

    const setModalState = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (loading) {
        return (
            <div>
                <Typography sx={{ mt: 20 }} variant='h4'>
                    {t('Loading')}
                </Typography>
            </div>
        )
    }
    
    return (
        <div>
            <Box  display="flex" justifyContent="center">
            {addedBookResponse && <AlertComponent response={addedBookResponse} handleClose={handleAddedBookResponse}/>}
            </Box>
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('My Profile')}</h1>
            </Box>
            { user[0]?.isAdmin != null && <Button sx={{mb: '0.5rem'}} variant="outlined" onClick={setModalState}>{t("AddNewBook")}</Button>}
            <AddBookDialog open={open} onClose={handleClose} handleAddedBookResponse={handleAddedBookResponse}></AddBookDialog>
            {[...user].map((user) => (
                <UserDetails key={user.Id} user={user} />
            ))}
            {!user?.length > 0 && <div>{t('NoUserDetails')}</div>}

            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('My Books')}</h1>
            </Box>
            {[...books].reverse().map((book) => (
                <OwnedBook key={book.BookId} book={book} />
            ))}
            {!books?.length > 0 && <div>{t('No books')}</div>}
        </div>
    )
}