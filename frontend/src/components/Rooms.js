import { useState, useContext, useEffect, useRef } from "react"
import NewRoom from "./NewRoom"
import { Context, SET_ROOMS, SET_USER } from '../context'
import { Outlet, useParams } from "react-router-dom"

import Roomz from '../services/RoomService'
import Userz from '../services/UserService'
import Bookz from '../services/BookService'
import SearchResults from "./SearchResults"

const Rooms = () => {

    const { rooms, dispatch, user } = useContext(Context)

    let { bcid, rid, bid } = useParams()
    let initialRoomSetup = useRef()

    initialRoomSetup.current = async () => {
        let tempUsr = "bob"
        if (!rooms.length) {
            let usr = await Userz.getUserByName(tempUsr)
            let payload;

            if (!usr)
                usr = await Userz.addUser({ username: tempUsr, password: "", email: "" })
                
            payload = await Roomz.getRoomsForUser(user)
            console.log('start?')
            dispatch({ type: SET_USER, payload: tempUsr })
            dispatch({ type: SET_ROOMS, payload })
        }
    }

    let [showRooms, setShowRooms] = useState(rid ? true : false) // rid ? true : false
    let [search, setSearch] = useState("")
    let [results, setResults] = useState([])
    let [typing, setTyping] = useState(false)
    let [showResults, setShowResults] = useState(true)

    useEffect(() => {
        initialRoomSetup.current()
    }, [])

    useEffect(() => {
        let delay;
        setTyping(true)
        setShowResults(true)
        if (search) {
            delay = setTimeout(async () => {
                let res = await Bookz.getAllForUser(search, user)
                setResults(res)
                setTyping(false)
            }, 1000)
        }
        return () => clearTimeout(delay)
    }, [search, user])

    const toggleRoomsView = async () => {
        if (!showRooms) {
            initialRoomSetup.current()
        }
        setShowRooms(!showRooms)
    }

    return (
        <div className="rooms">

            <button onClick={toggleRoomsView}>Rooms</button>

            <label className="search-lib">
                Search Library:
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                />
            </label>
            <br />
            {(search && !typing && showResults) || results.length ? <SearchResults books={results} bid={Number(bid)} setShowResults={setShowResults} setResults={setResults} /> : null}

            {showRooms &&
                <div>
                    <NewRoom 
                        rooms={rooms} 
                        dispatch={dispatch} 
                        bcid={Number(bcid)} 
                        rid={Number(rid)}
                        user={user}
                    />
                </div> 
            }
            <Outlet />
        </div>
    )
}

export default Rooms