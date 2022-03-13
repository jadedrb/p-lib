import React, { useState, useEffect } from 'react'
import { utilitySelector, utilPath } from "../services/utility";
import BookService from "../services/BookService"
import { ADD_BOOK, REMOVE_BOOK } from '../context';

function Move({ book, params, rooms, user, dispatch, navigate, path, from }) {

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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (action === "Copy") {
            if (from === "book")
                handleCopy([book])
            else 
                handleCopy(currShelf)
        } else {
            if (from === "book") {
                handleCopy([book])
                handleMove(bid)
            } else {
                handleCopy(currShelf)
                handleMove(currShelf)
            }
        }
        navigate(utilPath(path, 'shelf', selShelf))
    }

    const handleCopy = async (bks) => {
        if (from === 'shelf') 
            bks = bks.map(bk => {
                let { title, author, genre, pdate, pages, color, more } = bk
                return { title, author, genre, pdate, pages, color, more }
            })

        let books = await BookService.addBooksForShelfAndUser(bks, selShelf, user)
        dispatch({
            type: ADD_BOOK,
            payload: { shid: selShelf, rid: selRoom, bcid: selBkcase, books },
        });
    }

    const handleMove = async (bks) => {
        console.log(bks)
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
    }

    return ( 
        <div>
            <p style={{ opacity: ".4" }}>I want to...</p>
            <select name="action" value={action} onChange={handleChange}>
                <option>Move</option>
                <option>Copy</option>
            </select>
            <p>Book(s):</p>
            {from === "book" ? 
            <p style={{ fontWeight: "bold" }}>{book.title} (id: {bid})</p> : 
            <select name="bulk" value={selBulk} onChange={handleChange}>
                <option value="select" disabled>Select</option>
                <option value="contents">Every book on this shelf</option>
                <option value="selected">Selected books from this shelf</option>
            </select>}
            <p style={{ opacity: ".4" }}>To...</p>
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
        </div>
    );
}

export default Move;