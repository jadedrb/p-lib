import React, { useState, useEffect, useRef } from 'react';
import { utilPath, utilOrder } from '../services/utility';

const BookList = ({ books, bid, path, navigate, selected }) => {

    let [order, setOrder] = useState("")
    let [ascDesc, setAscDesc] = useState(true)

    let [focusOn, setFocusOn] = useState(true)

    let renderedBooks = utilOrder(books, order, ascDesc)

    let intoViewRef = useRef(true)
    // console.log(renderedBooks)

    useEffect(() => {
   
        setFocusOn(true)
        
        if (intoViewRef.current) {
            const section = document.querySelector(`.bk-${bid}`);
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
       
        } else {
            intoViewRef.current = true
        }
    }, [bid])

    renderedBooks = renderedBooks?.map((b,i) => {
        return (
            <tr 
                className={`bk-${b.id}`}
                key={i} 
                onClick={() => { intoViewRef.current = false; navigate(utilPath(path, 'book', b.id)); }} 
                style={{ outline: selected.highlight.includes(b?.id + "") ? '3px solid rgb(74, 74, 255)' : bid === b?.id ? '3px solid black' : 'none', opacity: (bid === b?.id || selected.highlight.includes(b?.id + "")) && focusOn ? '1' : !focusOn ? '1' : '.3' }}
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
        <div className={`table-contain booklist-r ${!renderedBooks.length && 'table-cc'}`} onClick={(e) => { if (e.target.type !== "td") setFocusOn(false) }}>
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