import React from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { padding } from '@mui/system';

function SearchBar({Books, setSearchTerm, keyPress}) {

  return (
    <div style={{padding: '0.5rem'}}> 
        <Autocomplete
            freeSolo
            id="searchBar"
            disableClearable
            // !TODO options now come from the already fetched books' titles, maybe they could be fetched from database
            options={Books.map(option => option.Title)} 
            onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search input"
                    InputProps={{
                        ...params.InputProps,
                        type: 'search',
                    }}
                    onKeyDown={e => keyPress(e)}
                />
            )}
        />
    </div>
  )
}

export default SearchBar