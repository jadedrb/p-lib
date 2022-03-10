import React from 'react';
import { utilPath } from '../services/utility';

const BookList = ({ books, bid, path, navigate }) => {

    let renderedBooks = books?.map((b,i) => {
        return (
            <tr 
                key={i} 
                onClick={() => navigate(utilPath(path, 'book', b.id))} 
                style={{ outline: bid === b.id ? '3px solid black' : 'none' }}
            >
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.color}</td>
                <td>{b.genre}</td>
                <td>{b.pages}</td>
                <td>{b.pdate}</td>
                <td>{b.more}</td>
            </tr>
        )
    })

    return (
        <div className="table-contain booklist-r">
            {renderedBooks?.length ? 
                <table className='booklist'>
                    <tbody>
                        {renderedBooks}
                    </tbody>    
                </table>
            : "This shelf is empty"}
        </div>
    )
}

export default BookList;