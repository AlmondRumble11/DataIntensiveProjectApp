import React from 'react'
import {useState, useEffect} from 'react';
import Book from './Book';
import Box from '@mui/material/Box';

export default function Home() {

    // const [books, setBooks] = useState([{
    //     "Id": null,
    //     "PublisherId": null,
    //     "AuthorId": null,
    //     "Title": null,
    //     "PublishDate": null,
    //     "AddedDate": null,
    //     "Price": null,
    //     "Description": null,
    //     "GenreId": null,
    //     "LanguageId": null,
    //     "CountryId": null,
    //     "CountrySpecificInfo": null,
    //     "PDF": null
    //   }]);

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

    //fetches books from /api/books
    // useEffect(() => {
    //     let mounted = true;
    //     async function fetchBooks() {
    //         let url = '/api/books';
    //         let response = await fetch(url);
    //         let dataJson = await response.json();
    //         if (mounted) {
    //             setBooks(dataJson);
    //         }
    //     }
    //     fetchBooks();
    //     return () => {
    //         mounted = false;
    //     };
    // }, [])
    // Source map reverse: https://stackoverflow.com/questions/37664041/react-given-an-array-render-the-elements-in-reverse-order-efficiently
    //if no posts, render "No posts."

    return (
        <div>
            <Box sx={{border: 0, width: '60%', margin: 'auto'}}>
                <h1 align='left'>Featured books</h1>
            </Box>    
            {[...books].reverse().map((book) => (
                <Book key={book.Id} book={book}/>
            ))}
            {!books?.length>0 && "No books."}
        </div>
    )
    
}