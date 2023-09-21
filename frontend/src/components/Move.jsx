import React, { useState, useEffect, useRef } from 'react'
import { utilitySelector, utilPath } from "../services/utility";

import BookService from "../services/BookService"
// import RoomService from "../services/RoomService"
import BookcaseService from "../services/BookcaseService"

import { ADD_BULK, REMOVE_BOOK, TOGGLE_BKCASE_SELECT, TOGGLE_SELECT, UPDATE_BOOKCASE, ADD_BOOK } from '../context';
import { useLibContext } from "../context"

function Move({ book, params, navigate, path, from, selected, bkcase, room, setShowMarkers }) {

    let { rooms, dispatch, user, reposition } = useLibContext()

    let { bid, shid, bcid, rid } = params

    let [action, setAction] = useState("Move")

    let [selBulk, setBulk] = useState("select")

    let [selRoom, setSelRoom] = useState("select")
    let [selBkcase, setSelBkcase] = useState("select")
    let [selShelf, setSelShelf] = useState("select")

    let [roomInfo, setRoomInfo] = useState({})
    let [bkcaseInfo, setBkcaseInfo] = useState({})
    let [, setShelfInfo] = useState({})

    let [currShelf, setCurrShelf] = useState({})

    let wrapper = useRef()

    useEffect(() => {
        let { bkcase, room, shelf } = utilitySelector(selRoom, selBkcase, selShelf, rooms)
        setRoomInfo(room)
        setBkcaseInfo(bkcase)
        setShelfInfo(shelf)
    }, [selRoom, selBkcase, selShelf, rooms])

    useEffect(() => {
        if (from === "shelf") {
            let { shelf } = utilitySelector(rid, bcid, shid, rooms)
            setCurrShelf(shelf.books)
        }
    }, [rid, bcid, shid, rooms, from])

    useEffect(() => { 
        wrapper.current.handleToggleSelect()
    }, [bid, selBulk])

    const handleToggleSelect = () => {
        if (selBulk === "selected") {
            if (bid) {
                dispatch({
                    type: TOGGLE_SELECT,
                    payload: bid
                })
            }
        } else if (selected?.highlight?.length) {
            dispatch({
                type: TOGGLE_SELECT,
                payload: []
            })
        }
    }

    const handleToggleMount = (mount) => {
        if (mount && from === "bkcase") {
            dispatch({
                type: TOGGLE_BKCASE_SELECT,
                payload: true
            })
        } else if (from !== 'hub') {
            dispatch({
                type: TOGGLE_SELECT,
                payload: []
            })
            dispatch({
                type: TOGGLE_BKCASE_SELECT,
                payload: false
            })
        }
    }

    wrapper.current = { handleToggleSelect, handleToggleMount }
    
    useEffect(() => {
        wrapper.current.handleToggleMount(true)
        return () => {
            wrapper.current.handleToggleMount(false)
        }
    }, [])

 

    const handleChange = (e) => {
        let { value, name } = e.target
        if (name === "action") 
            setAction(value)
        else if (name === "room") {
            setSelRoom(value)
            setSelBkcase("select")
            setSelShelf("select")
        }
        else if (name === "bkcase") {
            setSelBkcase(value)
            setSelShelf("select")
        }
        else if (name === "shelf")
            setSelShelf(value)
        else if (name === 'bulk')
            setBulk(value)
    }

    const confirmBut = () => selRoom === "select" || selBkcase === "select" || selShelf === "select" ? true : false

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            let result;

            if (action === 'Copy') {
                if (from === 'book') {
                    result = await handleCopy([book])
                } else if (from !== 'hub') {
                    if (selBulk === "selected") {
                        result = await handleCopy(currShelf.filter(b => selected.highlight.includes(b.id + "")))
                    } else {
                        result = await handleCopy(currShelf)
                    }
                } else {
                    setShowMarkers(false)
                    result = await handleMove(selected)
                }
            } else {
                if (from === "book") {
                    result = await handleMove([{ ...book, id: bid }])
                } else if (from !== 'hub') {
                    if (selBulk === "selected") {
                        let filter = currShelf.filter(b => selected.highlight.includes(b.id + ""))
                        result = await handleMove(filter)
                    } else {
                        result = await handleMove(currShelf)
                    }
                } else {
                    setShowMarkers(false)
                    result = await handleMove(selected)
                }
            }

            console.log(result)
            navigate(utilPath({ room: selRoom, bookcase: selBkcase, shelf: selShelf }, "coord"))
            setTimeout(() => alert(`${action === 'Copy' ? 'Copied' : 'Moved'} all ${result.amount} book(s)`), 1000)

        } catch(err) {
            console.log(err)
            alert(err)
        }
    }

    const handleBookcaseAdjust = async (e) => {
        e.preventDefault()
        
        let bkcaseFinal = { ...reposition.newBc }

        delete bkcaseFinal.location
        delete bkcaseFinal.bcWidth
        delete bkcaseFinal.color
        delete bkcaseFinal.shHeight
        delete bkcaseFinal.reposition
    
        let nBk = await BookcaseService.updateBookcaseForRoom(bkcaseFinal, bcid)

        dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: Number(rid), bcId: Number(bcid), bc: nBk }})
  
        navigate(utilPath(path, "room", rid))
    }

    const handleCopy = async (bks) => {
        try {
            
            const copiedBooksWithUpdatedLocation = await BookService.addBooksToShelf(bks.map(bk => ({ ...bk, rid: selRoom, bcid: selBkcase, shid: selShelf })))

            dispatch({
                type: ADD_BULK,
                payload: { shid: selShelf, rid: selRoom, bcid: selBkcase, books: copiedBooksWithUpdatedLocation },
            });

        } catch(e) {
            throw new Error(e.response?.data?.error)
        }

        return { success: true, amount: bks.length }
    }

    const handleMove = async (bks) => {
 
        for (let bk of bks) {
            try {
     
                bk = {
                    ...bk,
                    room_id: selRoom, 
                    bookcase_id: selBkcase, 
                    shelf_id: selShelf 
                }

                const updatedBook = await BookService.updateBookForShelf(bk, bk.id)

                dispatch({
                    type: REMOVE_BOOK,
                    payload: { bcid, rid, shid, bid: bk.id }
                })

                dispatch({
                    type: ADD_BOOK,
                    payload: { shid: selShelf, rid: selRoom, bcid: selBkcase, setCurrShelf, book: updatedBook },
                });

            } catch(e) {
                throw new Error(e.response?.data?.error)
            }
        }

        return { success: true, amount: bks.length }
    }

    return ( 
        <div className='move-area'>
            <p style={{ opacity: ".4" }}>I want to...</p>

            {from !== "bkcase" ? 
            <select name="action" value={action} onChange={handleChange}>
                <option>Move</option>
                <option>Copy</option>
            </select> :
                "Reposition:"
            }

            {from !== "bkcase" && <p>Book(s):</p>}
            {from === "book" ?
            <p style={{ fontWeight: "bold" }}>{book.title} (id: {bid})</p> : 
            from === "shelf" ?
            <select name="bulk" value={selBulk} onChange={handleChange}>
                <option value="select" disabled>Select</option>
                <option value="contents">Every book on this shelf</option>
                <option value="selected">Selected books from this shelf</option>
            </select> :
            from === "hub" ?
            <p style={{ fontWeight: "bold" }}>All selected books</p> :
            <p style={{ fontWeight: "bold" }}>{bkcase.location ? bkcase.location : "Untitled Bookcase"} (id: {bkcase.id})</p>
            }
            <p style={{ opacity: ".4" }}>{from !== "bkcase" ? "To..." : "In..."}</p>

            {from === "bkcase" && <p style={{ fontWeight: "bold" }}>{room.name} (id: {room.id})</p>}

            {from !== "bkcase" ?
            <>
                <p>Room:</p>
                <select name="room" value={selRoom} onChange={handleChange}>
                    <option value="select" disabled>Select</option>
                    {rooms.map(r => <option value={r.id} key={r.id}>{r.name} (id: {r.id})</option>)}
                </select>
                <p>Bookcase:</p>
                <select name="bkcase" value={selBkcase} onChange={handleChange}>
                <option value="select" disabled>Select</option>
                    {roomInfo?.bookcases?.map(bk => <option value={bk.id} key={bk.id}>{bk.location} (id: {bk.id})</option>)}
                </select>
                <p>Shelf:</p>
                <select name="shelf" value={selShelf} onChange={handleChange}>
                <option value="select" disabled>Select</option>
                    {bkcaseInfo?.shelves?.map((sh,i) => <option value={sh.id} key={sh.id} disabled={sh.id === shid && from !== 'hub' ? true : false}>{i + 1 === 1 ? "1st" : i + 1 === 2 ? "2nd" : i + 1 === 3 ? "3rd" : i + 1 + "th"} from the top (id: {sh.id})</option>)}
                </select>
                <br /><br /><br />
                <input disabled={confirmBut()} type="button" onClick={handleSubmit} value={action.toUpperCase()}/>  
            </>:
            
            <>
                <p style={{ opacity: ".4" }}>(Select new location in current Room grid)</p>
                <input disabled={reposition.newBc ? false : true} type="button" onClick={handleBookcaseAdjust} value={action.toUpperCase()}/>  
            </>
            }
        </div>
    );
}

export default Move;