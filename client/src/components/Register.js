import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

const Register = () => {

    let navigate = useNavigate();

    const [user, setUser] = useState({})
    const [err, setErr] = useState('')

    //Keeps track of the input fields and creates the user object as the fields are beign filled.
    const whenChanging = (event) => {
        setUser({...user, [event.target.id]: event.target.value})
    }

    //Function for submittting the form.  
    //Sends the user object to server.
    const submitForm = (event) => {
        event.preventDefault()

        // fetch('/api/user/register', {
        //     method: 'POST',
        //     headers: {'Content-type': 'application/json'},
        //     body: JSON.stringify(user),
        //     mode: 'cors'
        // }).then(res => res.json()) //Waiting for the servers response
        //     .then(data =>  {
        //         if(data.success){ //If the registration was successfull in the server side we redirect to login page
        //             navigate(`/login`, { replace: true }) //SOURCE for redirection within the app: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router?noredirect=1&lq=1
        //         }else if(data.email){
        //             setErr(data.email)
        //         }else if(data.errors.length !== 0){
        //             setErr('Email is not valid')
        //         }else if(data.password){
        //             setErr("Password doesn't meet the minumum requirements")
        //         }
        // }) 
        console.log('Login successful!')
        navigate(`/login`, { replace: true })  //!TODO add API check??
    }


    return (
        <div>
            
        <Typography variant='h6' color='inherit' padding={2}>
            Register here!
        </Typography>

        <div>
            <form onSubmit={submitForm} onChange={whenChanging}>
                <Input required={true} placeholder="Name" type="text" id="name"></Input><br/><br/>
                <Input required={true} placeholder="Username" type="text" id="username"></Input><br/><br/>
                <Input required={true} placeholder="Email" type="email" id="email"></Input><br/><br/>
                <Input required={true} placeholder="Password" type="password" id="password"></Input>
                <Typography variant='subtitle1' color='inherit' padding={2}>
                    The password must be 10 characters long, have upper- and lowercase, a number and a symbol.
                </Typography>
                
                <br/>
                <Button variant='contained' type="submit" id="submit">Register</Button>
            </form>
        </div>
        
        {/* If there would be an error with registeration it would be shown here */}
        {err && (<Typography variant='h7' color='red' component='h3' padding={2}>
                   {err}
                </Typography>)}
        
    </div>
    )
}

export default Register