import { Button, Dialog, DialogActions, DialogContent, DialogTitle,} from "@mui/material";
import React, { useState, useEffect } from 'react'
import AddBookField from './AddBookField';
import Box from '@mui/material/Box'
import UserDetails from './UserDetails'
import OwnedBook from './OwnedBook'
import { Typography  } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddBookDialog from './AddBookDialog';
import { TextField, InputLabel, FormControl, FormLabel } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export default function BookDetailDialog(props) {
    const { onClose, open, book, addBookToShoppingCart } = props;

    const handleClose = () =>{
        onClose(false);
    }


    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
            <DialogTitle>Book</DialogTitle>

                <DialogContent>
                <Box>
                <Typography align='left' variant="h4" component="div" >
                    {book.Title}
                </Typography>
                <Typography align='left' sx={{ mb: 1.5 }} color="text.secondary">
                    {book.FirstName} {book.LastName}
                </Typography>
                
                <Typography align='left' variant="body2" sx={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical" }}>
                    {book.Description}
                </Typography>
        

            </Box>
            </DialogContent>
            <DialogActions>
            <Button  sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => addBookToShoppingCart()}>{book.Price}€</Button>
                <Button variant='contained' type="submit" id="submit" onClick={handleClose}>Cancel</Button>
            </DialogActions>

        </Dialog>
    )
}