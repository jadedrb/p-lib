import React, { useState, useEffect, useContext, useRef } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Context, REMOVE_SHELF } from "../context"
import { utilitySelector, utilMsg } from '../services/utility';
import BookList from './BookList';
// import NewBook from './NewBook';
import { utilPath } from '../services/utility';
import Shelves from '../services/ShelfService'

function CurrentShelf() {

    let { rooms, dispatch } = useContext(Context)

    let [showShelf, setShowShelf] = useState(true)
    let [currShelf, setCurrShelf] = useState(null)
    let [shelfPos, setShelfPos] = useState({})

    let wrapper = useRef()

    let [edit, setEdit] = useState(false)

    let { shid, rid, bcid, bid } = useParams()

    let path = useLocation()
    let navigate = useNavigate()

    useEffect(() => {
        let { shelf, bkcase } = utilitySelector(rid, bcid, shid, rooms)
        
        let top, bot, swap;
        let pos = bkcase?.shelves?.findIndex(sh => sh.id === Number(shid))
     
        if (typeof pos === "number") {
            bot = bkcase.shelves.length - pos
            top = pos + 1
        }

        swap = wrapper.current.swapem()
    
        setShelfPos({ top, bot, swap })

        setCurrShelf(shelf)
    }, [shid, rid, bcid, rooms])

    const removeShelf = async () => {
        let confirm = window.confirm(utilMsg({ type: 'shelf', details: { shelf: currShelf } }))
        if (!confirm) return
        await Shelves.removeShelfFromBookcase(shid, bcid)
        dispatch({ type: REMOVE_SHELF, payload: { shid, bcid, rid } })
        navigate(utilPath(path, 'bookcase', bcid))
    }

    const swapem = () => shelfPos.top > shelfPos.bot ? "bottom" : "top"

    wrapper.current = { swapem }

    let tob = shelfPos.swap === "top" ? shelfPos.top : shelfPos.bot
    let position = tob === 1 ? "1st" : tob === 2 ? "2nd" : tob === 3 ? "3rd" : tob + "th"

    return ( 
        <div className='sh-b'>
            {showShelf && <div className="pm">
                <div className="pm-r ed" onClick={() => setEdit(!edit)}>=</div>
                {edit && <div className="pm-r min-room" onClick={removeShelf}>-</div>}
            </div>}
            <div className="b-sec-center">
                <button className="b-section" onClick={() => setShowShelf(!showShelf)}>Shelf</button>
                <div className="b-sec-line" style={{ display: showShelf ? "block" : "none" }}/>
            </div>
            {showShelf && 
            <h4 style={{ cursor: "pointer" }} onClick={() => setShelfPos((prev) => ({ ...prev, swap: prev.swap === "top" ? "bot" : "top" }))}>
                <span style={{ color: "rgb(74, 74, 255)" }}>{position}</span> shelf 
                <span style={{ opacity: ".4" }}> (from the {shelfPos.swap})</span>
            </h4>}
            {showShelf && 
                currShelf ?
                <div>
                    {/* <h5>Shelf ID: {shid}</h5> */}
                    <BookList 
                        books={currShelf?.books} 
                        path={path}
                        bid={Number(bid)}
                        navigate={navigate}
                    />
                    {/* {edit && <NewBook book={'test'} setCurrShelf={setCurrShelf} />} */}
                </div>
                : !currShelf ?
                <div>No shelf selected</div>
                : null
            }

            <div className="b-sec-center">
                <button className="b-section" onClick={() => {
                    if (path.pathname.includes("/book/")) 
                        navigate(utilPath(path, "shelf", shid))
                    else
                        navigate(utilPath(path, "book", ""))
                }}>Book</button>
                <div className="b-sec-line" style={{ display: path.pathname.includes("/book/") ? "block" : "none" }}/>
            </div>
            <Outlet />
        </div>
    );
}

export default CurrentShelf;