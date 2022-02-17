import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { utilitySelector, Context } from '../context';
import NewEntryField from './NewBook';

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
                {currShelf?.books.map((b, i) => <p key={i}>Book {i}</p>)}
                <NewEntryField setCurrShelf={setCurrShelf} />
            </div>
            }
        </>
    );
}

export default CurrentShelf;