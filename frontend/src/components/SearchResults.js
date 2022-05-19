import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { utilPath, utilOrder } from '../services/utility';
import Books from '../services/BookService';

const SearchResults = ({ searchIn, searchType, search, books, bid, setResults, setShowResults }) => {

    let [order, setOrder] = useState("")
    let [recordedSearch, setRecordedSearch] = useState([])
    let [recordedSearchType, setRecordedSearchType] = useState([])
    let [recordedSearchIn, setRecordedSearchIn] = useState('')
    let [ascDesc, setAscDesc] = useState(true)
    let [height, setHeight] = useState(50)
    let [right, setRight] = useState(0)

    let resultRef = useRef()

    const recordWrap = useRef()

    let navigate = useNavigate()

    const recordSetup = () => {
        if (searchIn !== 'results' && books.length) {
            setRecordedSearch([search])
            setRecordedSearchType([searchType])
        } else {
            setRecordedSearch([...recordedSearch, search])
            setRecordedSearchType([...recordedSearchType, searchType])
        }
        if (searchIn !== 'library' && searchIn !== 'results') {
            setRecordedSearchIn(searchIn)
        }
    }

    recordWrap.current = { recordSetup }

    useEffect(() => {
        recordWrap.current.recordSetup()
        
        let height = resultRef?.current?.clientHeight
        height = !height ? height = 49 : height
        height = height < 50 ? 50 : height < 350 ? height : 350
        setHeight(height)
    }, [books])

    const whereIsThisBook = async (id) => {
        if (bid === id) return
        let coord = await Books.getBookCoordinates(id)
        navigate(utilPath(coord, "coord"))
        // prevCoord.current = id
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
                <td>{b.lang}</td>
                <td>{b.pdate}</td>
                <td>{b.pages}</td>
                <td className='bk-more'>{b.more}</td>
            </tr>
        )
    })

    // const height =  !renderedBooks.length ? 50 : renderedBooks.length * 90 < 350 ? renderedBooks.length * 90 : 350 

    return (
        <div style={{ height }} className={`table-contain search-c ${!renderedBooks.length && 'table-cc'}`} onScroll={(e) => setRight(e.target.scrollLeft)}>
            <div className='x-results-wrapper' style={{ height: resultRef?.current?.offsetHeight ? `${resultRef.current.offsetHeight}px` : '100px', right: `-${Math.floor(right)}px` }}><div className="pm-r min-room x-results" onClick={closeSearchResults}>X</div></div>
            {renderedBooks.length ? <h5>results: {renderedBooks.length}</h5> : null}
            <h6>{recordedSearch.map((rec, i, arr) => <span key={i}>{`"${rec}" in ${recordedSearchType[i]}`}{arr.length > 1 && i !== arr.length -1 ? ' & ' : ''}</span>)}{recordedSearchIn ? ` from ${recordedSearchIn}` : ''}</h6>
            {renderedBooks?.length ? 
                <table className='booklist' ref={resultRef}>
                    <thead>
                        <tr style={{ backgroundColor: "lightgrey", fontSize: "13px" }}>
                            <th onClick={() => handleOrder("title")}>title</th>
                            <th onClick={() => handleOrder("author")}>author</th>
                            <th onClick={() => handleOrder("color")}>color</th>
                            <th onClick={() => handleOrder("genre")}>genre</th>
                            <th onClick={() => handleOrder("lang")}>language</th>
                            <th onClick={() => handleOrder("pdate")}>published</th>
                            <th onClick={() => handleOrder("pages")}>pages</th>
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