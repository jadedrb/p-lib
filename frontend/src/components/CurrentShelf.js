import React, { useState, useEffect, useContext, useRef } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Context, REMOVE_SHELF, UPDATE_SHELF } from "../context"
import { utilitySelector, utilMsg } from '../services/utility';
import BookList from './BookList';

import { utilPath } from '../services/utility';
import Shelves from '../services/ShelfService'
import Move from './Move';

function CurrentShelf() {

    let { rooms, dispatch, selected, settings, user } = useContext(Context)

    let [showShelf, setShowShelf] = useState(true)
    let [showBook, setShowBook] = useState(true)
    let [currShelf, setCurrShelf] = useState(null)
    // let [currBkcase, setCurrBkcase] = useState(null)
    let [shelfPos, setShelfPos] = useState({})

    let wrapper = useRef()

    let [order, setOrder] = useState(false)

    let [move, setMove] = useState(false)
    let [edit, setEdit] = useState(false)

    let params = useParams()
    let { shid, rid, bcid, bid } = params

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
        // setCurrBkcase(bkcase)
        setOrder(shelf?.organize ? shelf.organize : "lastname asc")
        setMove(false)
    }, [shid, rid, bcid, rooms])

    const removeShelf = async () => {
        let confirm = window.confirm(utilMsg({ type: 'shelf', details: { shelf: currShelf } }))
        if (!confirm) return
        await Shelves.removeShelfFromBookcase(shid, bcid)
        dispatch({ type: REMOVE_SHELF, payload: { shid, bcid, rid } })
        navigate(utilPath(path, 'bookcase', bcid))
    }

    const handleShelfUpdate = async (e) => {
        e.preventDefault()
        let updatedShelf = await Shelves.updateShelfOfId({ organize: order }, shid)
        dispatch({ type: UPDATE_SHELF, payload: { bcid, rid, shid, sh: updatedShelf } })
        setEdit(false)
    }

    const swapem = () => shelfPos.top > shelfPos.bot ? "bottom" : "top"

    wrapper.current = { swapem }

    let tob = shelfPos.swap === "top" ? shelfPos.top : shelfPos.bot
    let position = tob === 1 ? "1st" : tob === 2 ? "2nd" : tob === 3 ? "3rd" : tob + "th"

    return ( 
        <div className='sh-b'>
            {showShelf && currShelf && <div className="pm">
                <div className="pm-r ed" onClick={() => { 
                    if (settings.temp !== "Read Only")
                        setEdit(!edit); 
                    if(move) 
                        setMove(false); 
                }}>=</div>
                {shid && edit && <div className="pm-r ed" onClick={() => setMove(!move)}>~</div>}
                {edit && <div className="pm-r min-room" onClick={removeShelf}>-</div>}
            </div>}
            <div className={user ? "b-sec-center" : "b-sec-center b-sec-fade"}>
                <button className="b-section" onClick={() => setShowShelf(!showShelf)} onDoubleClick={() => { navigate(utilPath(path, "bookcase", bcid)); setShowShelf(false) } }>Shelf</button>
                <div className="b-sec-line" style={{ display: showShelf ? "block" : "none" }}/>
            </div>
            {showShelf && currShelf && 
            <h4 style={{ cursor: "pointer" }} onClick={() => { setShelfPos((prev) => ({ ...prev, swap: prev.swap === "top" ? "bottom" : "top" })) }}>
                <span style={{ color: "rgb(74, 74, 255)" }}>{position}</span> shelf 
                <span style={{ opacity: ".4" }}> (from the {shelfPos.swap})</span>
            </h4>}
            {showShelf && 
                currShelf ?
                <div>
                    {/* <h5>Shelf ID: {shid}</h5> */}
                    <BookList 
                        selected={selected}
                        books={currShelf.books} 
                        path={path}
                        bid={Number(bid)}
                        navigate={navigate}
                    />
                    {/* {edit && <NewBook book={'test'} setCurrShelf={setCurrShelf} />} */}
                </div>
                : !currShelf && showShelf ?
                <div>No shelf selected</div>
                : null
            }

            {showShelf && edit && !move ? 
                <>
                    <br /><br />
                    <label htmlFor='order'>Default order of books on this shelf: </label>
                    <br /><br />
                    <select id='order' value={order} onChange={(e) => setOrder(e.target.value)}>
                        <option value="lastname asc">Author's Last Name (A-Z)</option>
                        <option value="lastname desc">Author's Last Name (Z-A)</option>
                        <option value="firstname asc">Author's First Name (A-Z)</option>
                        <option value="firstname desc">Author's First Name (Z-A)</option>
                        <option value="title asc">Title (A-Z)</option>
                        <option value="title desc">Title (Z-A)</option>
                        <option value="genre">Genre</option>
                        <option value="pages">Page Count</option>
                    </select> 
                    <p style={{ opacity: '.3', fontStyle: 'italic', fontSize: '13px' }}>(affects their order in the Bookcase and how they first appear in the table above)</p>
                    <input type="button" value="Save" onClick={handleShelfUpdate}/>
                </>
                  : null}

            {showShelf && edit && move ?  
               <Move
                 from={"shelf"}
                 selected={selected}
                 params={params} 
                 path={path}
                 navigate={navigate} 
                /> 
               : null
            }


            <div className={user ? "b-sec-center" : "b-sec-center b-sec-fade"}>
                <button className="b-section" onClick={() => {
                    if (!path.pathname.includes("/book/"))  {
                        setShowBook(true)
                        navigate(utilPath(path, "book", ""))

                        setTimeout(() => {
                            let section = document.querySelector('.ff')
                            section?.scrollIntoView()
                        }, 100) 
                    } else
                        setShowBook(!showBook)
                    
                    if (!showBook) {
                        setTimeout(() => {
                            let section = document.querySelector('.ff')
                            section?.scrollIntoView()
                        }, 100)    
                    }
                }}>Book</button>
                <div className="b-sec-line" style={{ display: showBook && path.pathname.includes("/book/") ? "block" : "none" }}/>
            </div>
            {showBook && <Outlet />}
        </div>
    );
}

export default CurrentShelf;