import { Button } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'; //Source: https://mui.com/components/material-icons/


const SearchButton = ({clickEvent}) => {

    return (  
        <Button 
            startIcon={<SearchIcon/>} 
            onClick={() => clickEvent()} 
            sx={{ px: 5.5, mt: 1, minWidth: '100px', maxWidth: '100px', minHeight: '40px', maxHeight: '40px'}}  
            size='small' 
            variant="contained">
            Search</Button>
    )
}

export default SearchButton