import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

//Displays single book as a card
function Book({book}) {
    const card = (
        <React.Fragment>
          <CardContent sx={{borderRadius: 2, border: '1.5px solid black'}}>
            <Typography align='left' variant="h4" component="div">
                {book.Title}
            </Typography>
            <Typography align='left' sx={{ mb: 1.5 }} color="text.secondary">
                {book.AuthorId}
            </Typography>
            <Stack direction="row" justifyContent="end">
                <Button variant="contained" startIcon={<ShoppingCartIcon />}>{book.Price}€</Button>
            </Stack>
          </CardContent>   
        </React.Fragment>
      );
    
    return (
        <div>
            <Box sx={{border: 0, width: '60%', margin: 'auto', mb: 1.5}}>
                <Card variant="outlined">{card}</Card>
            </Box>
        </div>
    )
}

export default Book