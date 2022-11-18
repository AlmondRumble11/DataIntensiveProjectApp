import React from 'react'

//Displays single book on '/home'
function Book({book}) {
    return (
        <div>
            <p>{book.Title}</p>
            <p>{book.AuthorId}</p>
            <p>{book.Price}</p>
        </div>
    )
}

export default Book