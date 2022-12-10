import { TextField, InputLabel, FormControl, FormLabel } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from 'react-i18next';

export default function AddBookField(props) {
    const { t } = useTranslation(['i18n']);    
    return (
        <Box>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>{t('Title')}</FormLabel>
                <TextField id="title" name="title" required={true} placeholder={t('Title')} autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>{t('AuthorsFirstname')}</FormLabel>
                <TextField id="authorFirstname" name="authorFirstname" required={true} placeholder={t('AuthorsFirstname')} autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>{t('AuthorsLastname')}</FormLabel>
                <TextField id="authorLastname" name="authorLastname" required={true} placeholder={t('AuthorsLastname')} autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>{t('Description')}</FormLabel>
                <TextField id="description" name="desciption" required={true} placeholder={t('Description')} autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 5px 10px"}}>
                <FormLabel>{t('Publisher')}</FormLabel>
                <TextField id="publisher" name="publisher" required={true} placeholder={t('Publisher')} autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 5px 10px"}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>{t('Price')}</FormLabel>
                    <TextField  id="price" name="price" placeholder={t('Price')} required={true}  autoComplete="off" fullWidth/>
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>{t('PublishDate')}</FormLabel>
                    <TextField id="date" name="date" type="date" required={true} placeholder={t('PublishDate')} autoComplete="off" fullWidth/>
                </FormControl>
            </div>
            <div style={{padding: "5px 10px 10px 10px"}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>{t('Language')}</FormLabel>
                    <TextField id="language" name="language" required={true} placeholder={t('Language')} autoComplete="off" fullWidth/>
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>{t('Genre')}</FormLabel>
                    <TextField id="genre" name="genre" required={true} placeholder={t('Genre')} autoComplete="off" fullWidth/>
                </FormControl>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <InputLabel>{t('PDFfile')}</InputLabel>
                <input id="file" name="file" type="file" accept="application/pdf" required={true} fullWidth/>
            </div>
        </Box>
    )



}