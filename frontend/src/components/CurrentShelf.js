import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Context } from "../context"
import { utilitySelector } from '../services/utility';
import BookList from './BookList';
import NewBook from './NewBook';

function CurrentShelf() {

    let { rooms } = useContext(Context)

    let [showShelf, setShowShelf] = useState(true)
    let [currShelf, setCurrShelf] = useState(null)

    let { shid, rid, bcid } = useParams()

    useEffect(() => {
        let { shelf } = utilitySelector(rid, bcid, shid, rooms)
        console.log(shelf)
        setCurrShelf(shelf)
    }, [shid, rid, bcid, rooms])

    return ( 
        <>
            <button onClick={() => setShowShelf(!showShelf)}>Shelf</button>
            {showShelf && 
            <div>
                <h5>Shelf ID: {shid}</h5>
                {/* {currShelf?.books.map((b, i) => <p key={i}>Book {i}</p>)} */}
                <BookList books={currShelf?.books}/>
                <NewBook book={'test'} setCurrShelf={setCurrShelf} />
            </div>
            }
        </>
    );
}

export default CurrentShelf;