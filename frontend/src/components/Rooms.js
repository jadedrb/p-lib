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

    let { bcid, rid, bid, shid } = useParams()
    let wrapperRef = useRef()
    
    const initialRoomSetup = async () => {
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
    let [searchIn, setSearchIn] = useState("library")
    let [searchType, setSearchType] = useState("title")

    useEffect(() => {
        wrapperRef.current.initialRoomSetup()
    }, [])

    useEffect(() => {
        let delay;
        setTyping(true)
        setShowResults(true)
        if (search.charAt(0) === "#") return
        if (search) {
            delay = setTimeout(async () => {
                let res = await wrapperRef.current.determineSearchArea(search, user)
                setResults(res)
                setTyping(false)
            }, 1000)
        }
        return () => clearTimeout(delay)
    }, [search, user])

    useEffect(() => {
        setSearchIn("library")
    }, [rid, shid, bcid])

    const determineSearchArea = (search, user) => {
        switch(searchIn) {
            case "library":
                if (searchType === "title") 
                    return Bookz.getTitleForUser(search, user)
                if (searchType === "genre")
                    return Bookz.getGenreForUser(search, user)
                if (searchType === "more")
                    return Bookz.getMoreForUser(search, user)
                if (searchType === "color")
                    return Bookz.getColorForUser(search, user)
                if (searchType === "published")
                    return Bookz.getPublishDateForUser(search, user)
                if (searchType === "pages")
                    return Bookz.getPagesForUser(search, user)
                return []
            case "room":
                if (searchType === "title") 
                    return Bookz.getTitleInRoom(search, rid)
                if (searchType === "genre") 
                    return Bookz.getGenreInRoom(search, rid)
                if (searchType === "color") 
                    return Bookz.getColorInRoom(search, rid)
                if (searchType === "published") 
                    return Bookz.getPublishDateInRoom(search, rid)
                if (searchType === "pages") 
                    return Bookz.getPagesInRoom(search, rid)
                return []
            case "bookcase":
                if (searchType === "title") 
                    return Bookz.getTitleInBookcase(search, bcid)
                if (searchType === "genre") 
                    return Bookz.getGenreInBookcase(search, bcid)
                if (searchType === "color") 
                    return Bookz.getColorInBookcase(search, bcid)
                if (searchType === "published") 
                    return Bookz.getPublishDateInBookcase(search, rid)
                if (searchType === "pages") 
                    return Bookz.getPagesInBookcase(search, rid)
                return []
            case "shelf":
                if (searchType === "title") 
                    return Bookz.getTitleInShelf(search, shid)
                if (searchType === "genre") 
                    return Bookz.getGenreInShelf(search, shid)
                if (searchType === "color") 
                    return Bookz.getColorInShelf(search, shid)
                if (searchType === "published") 
                    return Bookz.getPublishDateInShelf(search, rid)
                if (searchType === "pages") 
                    return Bookz.getPagesInShelf(search, rid)
                return []
            default:
                return []
        }
    }
    const toggleRoomsView = async () => {
        if (!showRooms) {
            wrapperRef.current.initialRoomSetup()
        }
        setShowRooms(!showRooms)
    }

    const handleSearchChange = (e) => {
        if (e.target.value === "#genre") {
            setSearchType("genre")
            setSearch("")
        } else if (e.target.value === "#all") {
            setSearchType("all")
            setSearch("")
        } else if (e.target.value === "#title") {
            setSearchType("title")
            setSearch("")
        } else if (e.target.value === "#more") {
            setSearchType("more")
            setSearch("")
        } else if (e.target.value === "#color") {
            setSearchType("color")
            setSearch("")
        } else if (e.target.value === "#published") {
            setSearchType("published")
            setSearch("")
        } else if (e.target.value === "#pages") {
            setSearchType("pages")
            setSearch("")
        } else {
            setSearch(e.target.value)
        }
    }

    wrapperRef.current = { initialRoomSetup, determineSearchArea } 

    return (
        <div className="rooms">

            <button onClick={toggleRoomsView}>Rooms</button>

            <label className="search-lib">
                <select value={searchIn} onChange={(e) => setSearchIn(e.target.value)}>
                    <option value="library">Search Library:</option>
                    {rid && <option value="room">Search Room:</option>}
                    {bcid && <option value="bookcase">Search Bookcase:</option>}
                    {shid && <option value="shelf">Search Shelf:</option>}
                </select>
                <input 
                    value={search} 
                    placeholder={searchType}
                    onChange={handleSearchChange}
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