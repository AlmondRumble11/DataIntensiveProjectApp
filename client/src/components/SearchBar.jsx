import React from 'react'
import TextField from '@mui/material/TextField';
import SearchButton from './SearchButton';


function SearchBar({whenChanging, keyPress, onClick}) {

    return (
        <div style={{padding: '0.5rem'}}> 
            
            <TextField
                label="Search books"
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