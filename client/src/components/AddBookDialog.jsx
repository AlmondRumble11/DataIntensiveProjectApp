import { Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, { useState, useEffect } from 'react'
import AddBookField from './AddBookField';
import { useTranslation } from 'react-i18next';

export default function AddBookDialog(props) {
    const { t } = useTranslation(['i18n']);   
    const { onClose, open, handleAddedBookResponse } = props;
    const initialState = {
        title: null,
        authorFirstname: null,
        authorLastname: null,
        description: null,
        date: null,
        file: null,
        language: null,
        genre: null,
        price: null      
    };
    const [ formValues, setFormValues ] = useState(initialState);
    const [ invalid, setInvalid] = useState(true);

    const handleClose = () =>{
        setInvalid(true);
        setFormValues({...initialState});
        onClose(false);
    }
    const submitForm = (event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', formValues.file);
        formData.append('formValues', JSON.stringify(formValues));
        formData.append('fileName', formValues.file.name);
        let jwt = sessionStorage.getItem('token');

        fetch('http://localhost:3001/book/addbook', {
            method: 'POST',
            headers: { 'countryCode': sessionStorage.getItem("countryCode"), 'Authorization': `Bearer ${jwt}`},
            body: formData,
            mode: 'cors'
        }).then(res => {
            res.json().then(data => {
                handleAddedBookResponse(data);
            });
        });
        handleClose();
    }

    const handleChange = (event) =>  {
        if(event.target.files){
            setFormValues({...formValues, [event.target.id]: event.target.files[0]});
        }else{
            setFormValues({...formValues, [event.target.id]: event.target.value});
        }
    }

    useEffect(() => {
        if (Object.values(formValues).includes(null) || Object.values(formValues).includes('')) return setInvalid(true);
        return setInvalid(false);
    }, [formValues]);

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
            <DialogTitle>{t("AddNewBook")}</DialogTitle>
            <form id="add-book-form" sx={8} onSubmit={submitForm} onChange={handleChange}>
                <DialogContent>
                    <AddBookField></AddBookField>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' type="submit" id="submit" disabled={invalid}>{t("Submit")}</Button>
                    <Button variant='contained' type="submit" id="submit" onClick={handleClose}>{t("Cancel")}</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}