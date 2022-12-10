import { Alert, AlertTitle, Button, Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AlertComponent(props) {
    const { t } = useTranslation(['i18n']);
    const { response, handleClose } = props;
    return (
        <Box  display="flex" justifyContent="center">
        <Alert severity={response.severity}>
            <AlertTitle>{t(response.title)}</AlertTitle>
            {response.msg}
            <Button onClick={() => handleClose(null)}>{t("Close")}</Button>
        </Alert>
        </Box>
    )
}