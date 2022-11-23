import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';


// Source for text wrapping: https://stackoverflow.com/questions/64315111/material-ui-write-text-in-exactly-2-lines-with-ellipsis
function UserDetails({user}) {
    const card = (
        <React.Fragment>
          <CardContent sx={{borderRadius: 2, border: '1.5px solid black'}}>
            <Typography align='left' variant="h4" component="div" sx={{ mb: 1.5 }}>
                {user.firstname} {user.lastname}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
                <Box>
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                        Email: {user.email}
                    </Typography>
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                        Phone: {user.phoneNumber}
                    </Typography>
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                        Address: {user.address}
                    </Typography>
                    <Typography align='left' sx={{ mb: 0.5 }} color="text.secondary">
                        Password: *************
                    </Typography>
                </Box>
                <Button sx={{maxHeight: '40px'}} variant="contained" startIcon={<EditIcon />}>Edit</Button>
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

export default UserDetails