import React, { useState } from 'react';
import { utilPath, utilOrder } from '../services/utility';

const BookList = ({ books, bid, path, navigate }) => {

    let [order, setOrder] = useState("")
    let [ascDesc, setAscDesc] = useState(true)

    let renderedBooks = utilOrder(books, order, ascDesc)

    renderedBooks = renderedBooks?.map((b,i) => {
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

    const handleOrder = (o) => {
        if (order === o)
            setAscDesc(!ascDesc)
        else 
            setOrder(o)
    }

    return (
        <div className="table-contain booklist-r">
            {renderedBooks.length ? <h5>books: {renderedBooks.length}</h5> : null}
            {renderedBooks?.length ? 
                <table className='booklist'>
                    <thead>
                        <tr style={{ backgroundColor: "lightgrey", fontSize: "13px" }}>
                            <th onClick={() => handleOrder("title")}>title</th>
                            <th onClick={() => handleOrder("author")}>author</th>
                            <th onClick={() => handleOrder("color")}>color</th>
                            <th onClick={() => handleOrder("genre")}>genre</th>
                            <th onClick={() => handleOrder("pages")}>pages</th>
                            <th onClick={() => handleOrder("pdate")}>published</th>
                            <th onClick={() => handleOrder("more")}>more</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedBooks}
                    </tbody>    
                </table>
            : <span>This shelf is empty</span>}
        </div>
    )
}

export default BookList;