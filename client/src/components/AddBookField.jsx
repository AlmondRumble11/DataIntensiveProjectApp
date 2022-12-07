import { TextField, InputLabel, FormControl, FormLabel } from "@mui/material";
import { Box } from "@mui/system";
export default function AddBookField(props) {    
    return (
        <Box>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>Title</FormLabel>
                <TextField id="title" name="title" required={true} placeholder="Title" autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>Author's firstname</FormLabel>
                <TextField id="authorFirstname" name="authorFirstname" required={true} placeholder="Author's firstname" autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>Author's lastname</FormLabel>
                <TextField id="authorLastname" name="authorLastname" required={true} placeholder="Author's lastname" autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <FormLabel>Description</FormLabel>
                <TextField id="description" name="desciption" required={true} placeholder="Description" autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 5px 10px"}}>
                <FormLabel>Publisher</FormLabel>
                <TextField id="publisher" name="publisher" required={true} placeholder="Publisher" autoComplete="off" fullWidth/>
            </div>
            <div style={{padding: "10px 10px 5px 10px"}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>Price</FormLabel>
                    <TextField  id="price" name="price" placeholder="Price" required={true}  autoComplete="off" fullWidth/>
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>Publication date</FormLabel>
                    <TextField id="date" name="date" type="date" required={true} placeholder="Publication date" autoComplete="off" fullWidth/>
                </FormControl>
            </div>
            <div style={{padding: "5px 10px 10px 10px"}}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>Language</FormLabel>
                    <TextField id="language" name="language" required={true} placeholder="Language" autoComplete="off" fullWidth/>
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <FormLabel>Genre</FormLabel>
                    <TextField id="genre" name="genre" required={true} placeholder="Genre" autoComplete="off" fullWidth/>
                </FormControl>
            </div>
            <div style={{padding: "10px 10px 10px 10px"}}>
                <InputLabel>PDF file</InputLabel>
                <input id="file" name="file" type="file" accept="application/pdf" required={true} fullWidth/>
            </div>
        </Box>
    )



}