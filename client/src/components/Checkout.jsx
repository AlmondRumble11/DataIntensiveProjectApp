import React from 'react'
import {useTranslation} from 'react-i18next';
import Box from '@mui/material/Box';

export default function Checkout() {
    const {t} = useTranslation(['i18n']);
   return (
    <div>
        <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('Checkout')}</h1>
        </Box>    
    </div>
    )
    
}