import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DownloadIcon from '@mui/icons-material/Download';
import {useTranslation} from 'react-i18next';

//Displays single book as a card
// Source for text wrapping: https://stackoverflow.com/questions/64315111/material-ui-write-text-in-exactly-2-lines-with-ellipsis
function OwnedBook({book}) {

    // Source for downloading a file:  https://stackoverflow.com/questions/50694881/how-to-download-file-in-react-js
    const DownloadBook = () => {
        fetch(`http://localhost:3001/book/dowload/${book.Id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'countrycode': sessionStorage.getItem('countryCode')
            }
        }).then((res) => res.blob())
        .then((fileBlob) => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(fileBlob);
            link.setAttribute("download",`${book.Title}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild();
        });
      
    }


    const {t} = useTranslation(['i18n']);
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
                <Button sx={{maxHeight: '40px'}} variant="contained" startIcon={<DownloadIcon />} onClick={DownloadBook}>{t('Download PDF')}</Button>
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

export default OwnedBook