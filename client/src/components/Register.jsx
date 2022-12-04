import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import {useTranslation} from 'react-i18next';

const Register = () => {
    const {t} = useTranslation(['i18n']);
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
            headers: {'Content-type': 'application/json', 'countrycode': sessionStorage.getItem('countryCode')},
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
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{t('Register')}</h1>
            </Box>

        <div>
            <form onSubmit={submitForm} onChange={whenChanging}>
                <Input required={true} placeholder={t('Firstname')} type="text" id="firstName"></Input><br/><br/>
                <Input required={true} placeholder={t('Lastname')} type="text" id="lastName"></Input><br/><br/>
                <Input required={true} placeholder={t('Address')} type="text" id="address"></Input><br/><br/>
                <Input required={true} placeholder={t('Email')} type="email" id="email"></Input><br/><br/>
                <Input required={true} placeholder={t('Password')} type="password" id="password"></Input>
                <Typography sx={{mt: 5}} variant='subtitle1' color='inherit'>
                    {t('passwordRequirement')}
                </Typography>
                
                <br/>
                <Button variant='contained' type="submit" id="submit">{t('Register')}</Button>
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