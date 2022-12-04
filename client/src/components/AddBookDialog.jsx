import { Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, { useState, useEffect } from 'react'
import AddBookField from './AddBookField';

export default function AddBookDialog(props) {
    const { onClose, open } = props;
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

    const submitForm = (event) =>{
        event.preventDefault();
        fetch('http://localhost:3001/book/addbook', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(formValues),
            mode: 'cors'
        }).then(res => {
            res.json().then(data => {
                alert("New book was added");
            });
            
           
            
        });
        handleClose();
    }

    const handleChange = (event) =>  {
        setFormValues({...formValues, [event.target.id]: event.target.value});
    }

    const handleClose = () =>{
        setInvalid(true);
        setFormValues({...initialState});
        onClose(false);
    }

    useEffect(() => {
        if (Object.values(formValues).includes(null) || Object.values(formValues).includes('')) return setInvalid(true);
        return setInvalid(false);
    }, [formValues]);
    console.log(formValues);
    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
            <DialogTitle>Add a new book</DialogTitle>
            <form id="add-book-form" sx={8} onSubmit={submitForm} onChange={handleChange}>
                <DialogContent>
                    <AddBookField setInvalid={setInvalid} invalid={invalid} ></AddBookField>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' type="submit" id="submit" disabled={invalid}>Submit</Button>
                    <Button variant='contained' type="submit" id="submit" onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>



    )



}