import React, { useState, useEffect, useRef, useContext } from 'react'
import { utilitySelector, utilPath } from "../services/utility";

import BookService from "../services/BookService"
import RoomService from "../services/RoomService"
import BookcaseService from "../services/BookcaseService"

import { ADD_BULK, REMOVE_BOOK, TOGGLE_BKCASE_SELECT, TOGGLE_SELECT, UPDATE_BOOKCASE, UPDATE_ROOM } from '../context';
import { Context } from "../context"

function Move({ book, params, navigate, path, from, selected, bkcase, room }) {

    let { rooms, dispatch, user, reposition } = useContext(Context);

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
        } else if (selected?.length) {
            dispatch({
                type: TOGGLE_SELECT,
                payload: []
            })
        }
    }

    const handleToggleMount = (mount) => {
        if (mount) {
            dispatch({
                type: TOGGLE_BKCASE_SELECT,
                payload: true
            })
        } else {
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
        if (action === "Copy") {
            if (from === "book") {
                console.log('copy origin... 1')
                await handleCopy([book])
            }
            else {
                if (selBulk === "selected") {
                    console.log('copy origin... 2')
                    await handleCopy(currShelf.filter(b => selected.includes(b.id + "")))
                } else {
                    console.log('copy origin... 3')
                    await handleCopy(currShelf)
                }
                let payload = await RoomService.getRoomOfId(selRoom)
                dispatch({ type: UPDATE_ROOM, payload });
            }
            navigate(utilPath(path, 'shelf', selShelf))
        } else {
            if (from === "book") {
                console.log('copy/move origin... 4')
                await handleCopy([book])
                await handleMove(bid)
            } else {
                if (selBulk === "selected") {
                    console.log('copy origin... 5')
                    let filter = currShelf.filter(b => selected.includes(b.id + ""))
                    await handleCopy(filter)
                    await handleMove(filter)
                } else {
                    console.log('copy origin... 6')
                    await handleCopy(currShelf)
                    await handleMove(currShelf)
                }
                let payload = await RoomService.getRoomOfId(selRoom)
                dispatch({ type: UPDATE_ROOM, payload });
            }
        }
       // 
    }

    const handleBookcaseAdjust = async (e) => {
        e.preventDefault()
        console.log(bkcase)
        // navigate(utilPath(path, "room", rid))
        
        let bkcaseFinal = { ...reposition.newBc }

        delete bkcaseFinal.location
        delete bkcaseFinal.bcWidth
        delete bkcaseFinal.color
        delete bkcaseFinal.shHeight
        delete bkcaseFinal.reposition
    
        let nBk = await BookcaseService.updateBookcaseForRoom(bkcaseFinal, bcid)
        console.log(nBk, ": updated bookcase")
        dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: Number(rid), bcId: Number(bcid), bc: nBk }})
  
        navigate(utilPath(path, "room", rid))
    }

    const handleCopy = async (bks) => {
        console.log('copy running...')
 
        if (from === 'shelf') 
            bks = bks.map(bk => {
                let { title, author, genre, pdate, pages, color, more } = bk
                return { title, author, genre, pdate, pages, color, more }
            })
   
        let books = await BookService.addBooksForShelfAndUser(bks, selShelf, user)
        dispatch({
            type: ADD_BULK,
            payload: { shid: selShelf, rid: selRoom, bcid: selBkcase, books },
        });
        // for (let i = 0; i < books.length; i++) {
        //     console.log(books[i], " : in loop")
        //     dispatch({
        //         type: ADD_BOOK,
        //         payload: { shid: selShelf, rid: selRoom, bcid: selBkcase, book: books[i] },
        //     });
        // }
        console.log('copy finishing...')
    }

    const handleMove = async (bks) => {
        console.log('move/delete running...')
        for (let i = 0; i < bks.length; i++) {
            try {
                await BookService.removeBookFromShelfAndUser(from === "book" ? bid : bks[i].id, shid, user)
                dispatch({
                    type: REMOVE_BOOK,
                    payload: { bcid, rid, shid, bid: from === "book" ? bid : bks[i].id }
                })
            } catch(e) {
                console.log(e)
            }
        }
        console.log('move/delete finishing...')
    }

console.log(reposition)
    return ( 
        <div>
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
            <p style={{ fontWeight: "bold" }}>{bkcase.location} (id: {bkcase.id})</p>
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
                    {bkcaseInfo?.shelves?.map((sh,i) => <option value={sh.id} key={sh.id} disabled={sh.id === Number(shid) ? true : false}>{i + 1 === 1 ? "1st" : i + 1 === 2 ? "2nd" : i + 1 === 3 ? "3rd" : i + 1 + "th"} from the top (id: {sh.id})</option>)}
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