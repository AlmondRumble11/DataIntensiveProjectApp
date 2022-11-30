import React from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { padding } from '@mui/system';

function SearchBar({setSearchTerm, keyPress}) {
    
    const suggestions = [
        { label: 'Finish'},
        { label: 'Swedish'},
        { label: 'Norwegian'},
        { label: 'The Lord of the Rings'},
        { label: 'A Game of Thrones'},
        { label: 'A Clash of Kings'},
        { label: 'Harry Potter and the Chamber of Secrets'},
        { label: 'Fantasy'},
        { label: 'Horror'},
        { label: 'J.K Rowling'},
    ]

    return (
        <div style={{padding: '0.5rem'}}> 
            <Autocomplete
                freeSolo
                id="searchBar"
                disableClearable
                // !TODO options now come from the already fetched books' titles, maybe they could be fetched from database
                options={suggestions.map(option => option.label)} 
                onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search books"
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