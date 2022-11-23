import React, { useEffect, useState } from 'react'
import Book from './Book';



export default function AllBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        getAllBooks();
    }, []);

    const getAllBooks = () => {
        setLoading(true);
        setError(false);

        fetch('http://localhost:3001/book/all', {
            mode: 'cors'
        })
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => {
                setError(error);
                console.log('error loading books', error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    if (loading) {
        return (
            <div>
                Ladataan...
            </div>
        )
    }

    return (
        <div>
            <h1>All books</h1>
            {books.map(book => <Book key={book.Id} book={book} />)}
        </div>
    )
}

