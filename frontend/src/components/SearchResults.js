import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { utilPath, utilOrder } from '../services/utility';
import Books from '../services/BookService';

const SearchResults = ({ books, bid, setResults, setShowResults }) => {

    let [order, setOrder] = useState("")
    let [ascDesc, setAscDesc] = useState(true)

    let prevCoord = useRef()

    let navigate = useNavigate()

    const whereIsThisBook = async (id) => {
        if (prevCoord.current === id) return
        let coord = await Books.getBookCoordinates(id)
        navigate(utilPath(coord, "coord"))
        prevCoord.current = id
    }

    const closeSearchResults = () => {
        setShowResults(false)
        setResults([])
    }

    const handleOrder = (o) => {
        if (order === o)
            setAscDesc(!ascDesc)
        else 
            setOrder(o)
    }

    let renderedBooks = utilOrder(books, order, ascDesc)

    renderedBooks = renderedBooks.map((b,i) => {
        return (
            <tr 
                className='table-head'
                key={i} 
                onClick={() => whereIsThisBook(b.id)} 
                onDoubleClick={closeSearchResults}
                style={{ outline: bid === b.id ? '2px solid black' : 'none' }}
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
        <div className={`table-contain search-c ${!renderedBooks.length && 'table-cc'}`}>
            <div className="pm-r min-room x-results" onClick={closeSearchResults}>X</div>
            {renderedBooks.length ? <h5>results: {renderedBooks.length}</h5> : null}
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
            : <span>No results found</span>}
        </div>
    )
}

export default SearchResults;