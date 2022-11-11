import { Button } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'; //Source: https://mui.com/components/material-icons/

//Edit button component with a styling. Takes 2 porps, first is the object that is assosiated with the button and the other is function handle that will be ran when the button is pressed
const EditButton = ({clickEvent, object}) => {
    return (
        <div>
            <Button startIcon={<EditIcon/>} onClick={() => clickEvent(object)} sx={{ px: 5.5, mt: 1, maxWidth: '60px'}}  size='small' color='secondary' variant="contained">Edit</Button>
        </div>
    )
}

export default EditButton