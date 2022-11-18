import React from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


//Displays single book on '/home'
function Book({book}) {
    const card = (
        <React.Fragment>
          <CardContent>
            <Typography variant="h5" component="div">
                {book.Title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {book.AuthorId}
            </Typography>
            <Typography variant="body2">
              {book.Price}€
            </Typography>
          </CardContent>
        </React.Fragment>
      );
    
    return (
        <div>
            <Box sx={{ width: '75%', margin: 'auto'}}>
                <Card variant="outlined">{card}</Card>
            </Box>
        </div>
    )
}

export default Book