import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Context } from "../context";
import NewEntryField from './NewBook';

function CurrentShelf() {

    let { rooms } = useContext(Context);

    let [showShelf, setShowShelf] = useState(false)

    let { rid, bcid, shid } = useParams()

    let currentRoom, currentBookcase, currShelf;

    if (rid) {
        currentRoom = rooms[rooms.findIndex((r) => r.id === Number(rid))]
        if (bcid) {
            currentBookcase = currentRoom.bookcases[
                currentRoom.bookcases.findIndex((r) => r.id === Number(bcid))
            ]; 
            if (shid) {
                currShelf = currentBookcase.shelves[
                    currentBookcase.shelves.findIndex((r) => r.shelfId === Number(shid))
                ]
            }
        }
    }

console.log(currShelf, currentBookcase, currentRoom)
    return ( 
        <>
            <button onClick={() => setShowShelf(!showShelf)}>Shelf</button>
            {showShelf && 
            <div>
                <h5>Shelf ID: {shid}</h5>
                <p>{shid}</p>
                {currShelf.books.map((b, i) => <p key={i}>Book {i}</p>)}
                <NewEntryField />
            </div>
            }
        </>
    );
}

export default CurrentShelf;