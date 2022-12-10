import { Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import React from 'react'
import Box from '@mui/material/Box'
import { Typography  } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';

export default function BookDetailDialog(props) {
    const { onClose, open, book, addBookToShoppingCart } = props;
    const { t } = useTranslation(['i18n']);
    const handleClose = () =>{
        onClose(false);
    }
    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
            <DialogContent>
                <Box>
                    <Typography align='left' variant="h4" component="div" sx={{ mb: 1 }}>
                        {book.Title}
                    </Typography>
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                        {t('Author')}: {book.FirstName} {book.LastName}
                    </Typography> 
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                        {t('Genre')}: {book.GenreName}
                    </Typography> 
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                    {t('Language')}: {book.LanguageName}
                    </Typography> 
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                    {t('PublishDate')}: {new Intl.DateTimeFormat('en-GB').format(new Date(book.PublishDate.toString()))}
                    </Typography> 
                    <Typography align='left' variant="body2" sx={{ mt: 2 }}>
                        {book.Description}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button  sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant="contained" startIcon={<ShoppingCartIcon />} onClick={() => addBookToShoppingCart()}>{book.Price}€</Button>
                <Button sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant='contained' type="submit" id="submit" startIcon={<CloseIcon />} onClick={handleClose}>{t("Close")}</Button>
            </DialogActions>
        </Dialog>
    )
}