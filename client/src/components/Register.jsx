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

        fetch('http://localhost:3001/api/customer/register', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(user),
            mode: 'cors'
        }).then(res => {
            if(res.ok){
                return res.json().then(data => {
                    navigate(`/login`, { replace: true }) //SOURCE for redirection within the app: https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router?noredirect=1&lq=1
                }).catch(err => {
                    return Promise.resolve({res: res});
                })
            }else if(res.status !== 201){
                res.json().then(data => {
                    setErr(data.message)
                    console.log(data.message);
                })
            }
            else{
                return res.json().catch(err => {
                    throw new Error(res.statusText);
                }).then(data => {
                    throw new Error(data.error.message);
                })
            }
        })
    }


    return (
        <div>
            
        <Typography variant='h6' color='inherit' padding={2}>
            Register here!
        </Typography>

        <div>
            <form onSubmit={submitForm} onChange={whenChanging}>
                <Input required={true} placeholder="First Name" type="text" id="firstName"></Input><br/><br/>
                <Input required={true} placeholder="Last Name" type="text" id="lastName"></Input><br/><br/>
                <Input required={true} placeholder="Address" type="text" id="address"></Input><br/><br/>
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