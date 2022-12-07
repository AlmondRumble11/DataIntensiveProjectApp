import React from 'react'
import TextField from '@mui/material/TextField';
import SearchButton from './SearchButton';
import {useTranslation} from 'react-i18next';

function SearchBar({whenChanging, keyPress, onClick}) {
    const { t } = useTranslation(['i18n']);
    return (
        <div style={{padding: '0.5rem'}}> 
            
            <TextField
                label={t("SearchBooks")}
                id="searchTerm"
                onKeyDown={e => keyPress(e)}
                onChange={e => whenChanging(e)}
                style={{width: '50%', marginRight: '0.5rem'}}
            />

            <SearchButton clickEvent={onClick} />
             
        </div>
  )
}

export default SearchBar