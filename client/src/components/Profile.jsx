import React from 'react'
import {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import UserDetails from './UserDetails'
import OwnedBook from './OwnedBook'
import { Typography } from '@mui/material';
import {useTranslation} from 'react-i18next';

export default function Profile() {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {t} = useTranslation(['i18n']);

    useEffect(() => {
        if(sessionStorage.getItem('token')){
            getUserProfile();
        }
    }, []);

    const getUserProfile = () => {
        setLoading(true);
        setError(false);
        var jwt = sessionStorage.getItem('token');
        

        fetch('http://localhost:3001/api/customer/profile', {
            method: 'GET',
            headers: {'Authorization': `Bearer ${jwt}`},
            mode: 'cors'
        }).then(res => {
            if(res.ok){
                return res.json().then(data => {
                    setUser(data)
                    setLoading(false);
                }).catch(err => {
                    return Promise.resolve({res: res});
                })
            }else if(res.status !== 201){
                res.json().then(data => {
                    setError(data.message)
                    console.log(error);
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

    // const [user, setUser] = useState([{
    //     "Id": null,
    //     "firstname": null,
    //     "lastname": null,
    //     "phoneNumber": null,
    //     "email": null,
    //     "address": null,
    //     "createdDate": null
    // }]);

    // const [user, setUser] = useState([{
    // "Id": 1,
    // "firstname": 'User',
    // "lastname": 'Test',
    // "phoneNumber": '+23432313212',
    // "email": 'testuser@email.com',
    // "address": "Yliopistonkatu 34, 53850 Lappeenranta",
    // "createdDate": '23-11-2022'
    // }]);
    
    //gets userid from url
    // const {userid} = useParams()

    const [books, setBooks] = useState([{
        "Id": 1,
        "AuthorId": "George R. R. Martin",
        "Title": "A Game of Thrones",
        "Description": "Winter is coming. Such is the stern motto of House Stark, the northernmost of the fiefdoms that owe allegiance to King Robert Baratheon in far-off King’s Landing. There Eddard Stark of Winterfell rules in Robert’s name. There his family dwells in peace and comfort: his proud wife, Catelyn; his sons Robb, Brandon, and Rickon; his daughters Sansa and Arya; and his bastard son, Jon Snow. Far to the north, behind the towering Wall, lie savage Wildings and worse—unnatural things relegated to myth during the centuries-long summer, but proving all too real and all too deadly in the turning of the season.",
        "PublishDate": "01-08-1996",
        "AddedDate": "17-11-2022",
        "Price": 50,
        },
        {
        "Id": 2,
        "AuthorId": "George R. R. Martin",
        "Title": "A Clash of Kings",
        "Description": "A comet the color of blood and flame cuts across the sky. And from the ancient citadel of Dragonstone to the forbidding shores of Winterfell, chaos reigns. Six factions struggle for control of a divided land and the Iron Throne of the Seven Kingdoms, preparing to stake their claims through tempest, turmoil, and war. It is a tale in which brother plots against brother and the dead rise to walk in the night. Here a princess masquerades as an orphan boy; a knight of the mind prepares a poison for a treacherous sorceress; and wild men descend from the Mountains of the Moon to ravage the countryside. Against a backdrop of incest and fratricide, alchemy and murder, victory may go to the men and women possessed of the coldest steel...and the coldest hearts. For when kings clash, the whole land trembles.",
        "PublishDate": "16-11-1998",
        "AddedDate": "18-11-2022",
        "Price": 50,
        }
    ]);

    if (loading) {
        return (
            <div>
                <Typography sx={{mt: 20}} variant='h4'>
                    {t('Loading')}
                </Typography>
            </div>
        )
    }

   return (
    <div>
        <Box sx={{border: 0, width: '60%', margin: 'auto'}}>
                <h1 align='left'>{t('My Profile')}</h1>
        </Box>
        {[...user].map((user) => (
                <UserDetails key={user.Id} user={user}/>
            ))}
        {!user?.length>0 && <body>{t('NoUserDetails')}</body>}
        
        <Box sx={{border: 0, width: '60%', margin: 'auto'}}>
                <h1 align='left'>{t('My Books')}</h1>
        </Box>
        {[...books].reverse().map((book) => (
                <OwnedBook key={book.Id} book={book}/>
            ))}
        {!books?.length>0 && <body>{t('No books')}</body>}
    </div>
    )
}