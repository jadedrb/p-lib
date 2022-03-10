import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { utilPath } from '../services/utility';
import Books from '../services/BookService';

const SearchResults = ({ books, bid, setResults, setShowResults }) => {

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

    let renderedBooks = books?.map((b,i) => {
        return (
            <tr 
                key={i} 
                onClick={() => whereIsThisBook(b.id)} 
                onDoubleClick={closeSearchResults}
                style={{ outline: bid === b.id ? '3px solid lightblue' : 'none' }}
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
        <div className="table-contain search-c">
            <div className="pm-r min-room x-results" onClick={closeSearchResults}>X</div>
            {renderedBooks?.length ? 
                <table className='booklist'>
                    <tbody>
                        {renderedBooks}
                    </tbody>    
                </table>
            : "No results found"}
        </div>
    )
}

export default SearchResults;