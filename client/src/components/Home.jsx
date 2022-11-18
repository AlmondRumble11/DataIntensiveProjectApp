import React from 'react'
import {useState, useEffect} from 'react';
import Book from './Book';


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
        "PublishDate": "01-08-1996",
        "AddedDate": "17-11-2022",
        "Price": 50,
        },
        {
        "Id": 2,
        "AuthorId": "George R. R. Martin",
        "Title": "A Clash of Kings",
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
            <h1>Featured books</h1>
            {[...books].reverse().map((book) => (
                <Book key={book.Id} book={book}/>
            ))}
            {!books?.length>0 && "No books."}
        </div>
    )
    
}