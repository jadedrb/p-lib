import React, { useState, useEffect } from 'react'
import { utilitySelector } from "../services/utility";

function Move({ book, params, rooms }) {

    let { bid } = params

    let [action, setAction] = useState("Move")

    let [selRoom, setSelRoom] = useState("select")
    let [selBkcase, setSelBkcase] = useState("select")
    let [selShelf, setSelShelf] = useState("select")

    let [roomInfo, setRoomInfo] = useState({})
    let [bkcaseInfo, setBkcaseInfo] = useState({})
    let [, setShelfInfo] = useState({})

    useEffect(() => {
        let { bkcase, room, shelf } = utilitySelector(selRoom, selBkcase, selShelf, rooms)
        setRoomInfo(room)
        setBkcaseInfo(bkcase)
        setShelfInfo(shelf)
    }, [selRoom, selBkcase, selShelf, rooms])

    const handleChange = (e) => {
        let { value, name } = e.target
        if (name === "action") 
            setAction(value)
        if (name === "room") {
            setSelRoom(value)
            setSelBkcase("select")
            setSelShelf("select")
        }
        if (name === "bkcase") {
            setSelBkcase(value)
            setSelShelf("select")
        }
        if (name === "shelf")
            setSelShelf(value)
    }

    const confirmBut = () => selRoom === "select" || selBkcase === "select" || selShelf === "select" ? true : false

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("go")
        // console.log('room: ', selRoom, ', bkcase: ', selBkcase, ', shelf: ', selShelf)
    }

    return ( 
        <div>
            <p style={{ opacity: ".4" }}>I want to...</p>
            <select name="action" value={action} onChange={handleChange}>
                <option>Move</option>
                <option>Copy</option>
            </select>
            <p>Book(s):</p>
            <p style={{ fontWeight: "bold" }}>{book.title} (id: {bid})</p>
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
                {bkcaseInfo?.shelves?.map((sh,i) => <option value={sh.id} key={sh.id}>{i + 1 === 1 ? "1st" : i + 1 === 2 ? "2nd" : i + 1 === 3 ? "3rd" : i + 1 + "th"} from the top (id: {sh.id})</option>)}
            </select>
            <br /><br /><br />
            <input disabled={confirmBut()} type="button" onClick={handleSubmit} value={action.toUpperCase()}/>
        </div>
    );
}

export default Move;