import { Button } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'; //Source: https://mui.com/components/material-icons/
import {useTranslation} from 'react-i18next';

const SearchButton = ({clickEvent}) => {
    const { t } = useTranslation(['i18n']);
    return (  
        <Button 
            startIcon={<SearchIcon/>} 
            onClick={() => clickEvent()} 
            sx={{ px: 5.5, mt: 1, minWidth: '100px', maxWidth: '100px', minHeight: '40px', maxHeight: '40px'}}  
            size='small' 
            variant="contained">
            {t("Search")}
        </Button>
    )
}

export default SearchButton