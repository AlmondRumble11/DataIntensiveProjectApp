import { useNavigate } from "react-router-dom";
import {useState} from 'react'
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { Button } from "@mui/material";

//Login component. 
function Login() {

    let navigate = useNavigate();

    const [user, setUser] = useState({})
    const [err, setErr] = useState('')

    //Function that stores the user inputs
    const whenChanging = (event) => {
        setUser({...user, [event.target.id]: event.target.value})
    }

    //After form is submitted it is sent to server. If the authentication succeeded JWT is saved to session storage.
    //Otherwise an error is shown that is received from the server.
    const submitForm = (event) => {
        event.preventDefault()

        // sessionStorage.removeItem('token') //Removing the current token before a new one is received

        // fetch('/api/user/login', {
        //     method: 'POST',
        //     headers: {'Content-type': 'application/json'},
        //     body: JSON.stringify(user),
        //     mode: 'cors'
        // }).then(res => res.json())
        //     .then(data =>  {
        //         if(data.success){
        //             sessionStorage.setItem('token', data.token)
        //             navigate(`/`, { replace: true }) //SOURCE for redirection within the app: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router?noredirect=1&lq=1
        //         }else{
        //             setErr(data.message)
        //         }
        // }) 
        console.log('Login was successful')
        navigate(`/`, { replace: true })
    }


    return (
        <div>
            
            <Typography variant='h6' color='textSecondary' component='h2' padding={2}>
                    Please Login To Use All Of The Features
            </Typography>

            <div>
                <form onSubmit={submitForm} onChange={whenChanging}>
                    <Input placeholder="email" type="email" id="email"></Input>
                    <Input placeholder="password" type="password" id="password"></Input>
                    <Button  type="submit" id="submit">Login</Button>
                </form>
            </div>

            {/* Here is shown the error that was received from the server */}
            {err && (<Typography variant='h7' color='red' component='h3' padding={2}>
                        {err}
                    </Typography>)}
            
        </div>
    )
}

export default Login