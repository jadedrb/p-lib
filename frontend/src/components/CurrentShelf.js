import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Context, REMOVE_SHELF } from "../context"
import { utilitySelector } from '../services/utility';
import BookList from './BookList';
import NewBook from './NewBook';
import { utilPath } from '../services/utility';
import Shelves from '../services/ShelfService'

function CurrentShelf() {

    let { rooms, dispatch } = useContext(Context)

    let [showShelf, setShowShelf] = useState(true)
    let [currShelf, setCurrShelf] = useState(null)

    let [edit, setEdit] = useState(false)

    let { shid, rid, bcid, bid } = useParams()

    let path = useLocation()
    let navigate = useNavigate()

    useEffect(() => {
        let { shelf } = utilitySelector(rid, bcid, shid, rooms)
        console.log(shelf)
        setCurrShelf(shelf)
    }, [shid, rid, bcid, rooms])

    const removeShelf = async () => {
        await Shelves.removeShelfFromBookcase(shid, bcid)
        dispatch({ type: REMOVE_SHELF, payload: { shid, bcid, rid } })
        navigate(utilPath(path, 'bookcase', bcid))
    }

    return ( 
        <div className='sh-b'>
            <div className="pm">
                <div className="pm-r ed" onClick={() => setEdit(!edit)}>=</div>
                {edit && <div className="pm-r min-room">-</div>}
            </div>
            
            <button onClick={() => setShowShelf(!showShelf)}>Shelf</button>
            {showShelf && 
                currShelf ?
                <div>
                    <h5>Shelf ID: {shid}</h5>
                    <BookList 
                        books={currShelf?.books} 
                        path={path}
                        bid={Number(bid)}
                        navigate={navigate}
                    />
                    {edit && <NewBook book={'test'} setCurrShelf={setCurrShelf} />}
                </div>
                : !currShelf ?
                <div>No shelf selected</div>
                : null
            }
        </div>
    );
}

export default CurrentShelf;