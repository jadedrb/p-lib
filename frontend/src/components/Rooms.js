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

    const parsePagesAndDate = (search) => {
        let greater, lesser;
        // All this is to handle better searches for publish date and pages
        if (/s/.test(search) && searchType === "published") {
            let tenYearStart = Number(search.split("s")[0])
            greater = tenYearStart - 1
            lesser = tenYearStart + 11
        } else {
            let hundredYearStart = Number(search.split("s")[0])
            greater = hundredYearStart - 1
            lesser = hundredYearStart + 101
        }
        if (/>/.test(search)) {
            let rinse = search.split(">")
            greater = rinse.filter(p => !/>/.test(p) && p !== "")
            if (greater.length > 1) 
                greater = rinse.filter(p => !/</.test(p)).join().trim()
            else 
                greater = greater.join().split("<")[0].trim()
        }
        if (/</.test(search)) {
            let rinse = search.split("<")
            lesser = rinse.filter(p => !/</.test(p) && p !== "")
            if (lesser.length > 1) 
                lesser = rinse.filter(p => !/>/.test(p)).join().trim()
            else 
                lesser = lesser.join().split(">")[0].trim()
        }
  
        if (!greater && !lesser && search.length > 0) {
            console.log('ye')
            greater = Number(search.trim()) - 1
            lesser = Number(search.trim()) + 1
        } else if (greater && !lesser) {
            lesser = "9999"
        } else if (!greater && lesser) {
            greater = "0"
        }
        console.log("greater: " + greater + ", lesser: " + lesser)
        return { greater: Number(greater), lesser: Number(lesser) }
    }

    // <190>139
    // ['<190', '139']

    // >190<300
    // ['190<300']
    const determineSearchArea = (search, user) => {
        switch(searchIn) {
            case "library":
                if (searchType === "title") 
                    return Bookz.getTitleForUser(search, user)
                if (searchType === "genre")
                    return Bookz.getGenreForUser(search, user)
                if (searchType === "more")
                    return Bookz.getMoreForUser(search, user)
                if (searchType === "all") 
                    return Bookz.getAllForUser(search, user)
                if (searchType === "color")
                    return Bookz.getColorForUser(search, user)
                if (searchType === "author")
                    return Bookz.getAuthorForUser(search, user)
                if (searchType === "published")
                    return Bookz.getPublishDateForUser(parsePagesAndDate(search), user)
                if (searchType === "pages")
                    return Bookz.getPagesForUser(parsePagesAndDate(search), user)
                return []
            case "room":
                if (searchType === "title") 
                    return Bookz.getTitleInRoom(search, rid)
                if (searchType === "genre") 
                    return Bookz.getGenreInRoom(search, rid)
                if (searchType === "color") 
                    return Bookz.getColorInRoom(search, rid)
                if (searchType === "author")
                    return Bookz.getAuthorInRoom(search, rid)
                if (searchType === "all") 
                    return Bookz.getAllInRoom(search, rid)
                if (searchType === "more") 
                    return Bookz.getMoreInRoom(search, rid)
                if (searchType === "published") 
                    return Bookz.getPublishDateInRoom(parsePagesAndDate(search), rid)
                if (searchType === "pages") 
                    return Bookz.getPagesInRoom(parsePagesAndDate(search), rid)
                return []
            case "bookcase":
                if (searchType === "title") 
                    return Bookz.getTitleInBookcase(search, bcid)
                if (searchType === "genre") 
                    return Bookz.getGenreInBookcase(search, bcid)
                if (searchType === "color") 
                    return Bookz.getColorInBookcase(search, bcid)
                if (searchType === "author")
                    return Bookz.getAuthorInBookcase(search, bcid)
                if (searchType === "all") 
                    return Bookz.getAllInBookcase(search, bcid)
                if (searchType === "more") 
                    return Bookz.getMoreInBookcase(search, bcid)
                if (searchType === "published") 
                    return Bookz.getPublishDateInBookcase(parsePagesAndDate(search), rid)
                if (searchType === "pages") 
                    return Bookz.getPagesInBookcase(parsePagesAndDate(search), rid)
                return []
            case "shelf":
                if (searchType === "title") 
                    return Bookz.getTitleInShelf(search, shid)
                if (searchType === "genre") 
                    return Bookz.getGenreInShelf(search, shid)
                if (searchType === "color") 
                    return Bookz.getColorInShelf(search, shid)
                if (searchType === "author")
                    return Bookz.getAuthorInShelf(search, shid)
                if (searchType === "all") 
                    return Bookz.getAllInShelf(search, shid)
                if (searchType === "more") 
                    return Bookz.getMoreInShelf(search, shid)
                if (searchType === "published") 
                    return Bookz.getPublishDateInShelf(parsePagesAndDate(search), rid)
                if (searchType === "pages") 
                    return Bookz.getPagesInShelf(parsePagesAndDate(search), rid)
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
        let { value } = e.target
        if (value === "#genre") {
            setSearchType("genre")
            setSearch("")
        } else if (value === "#all") {
            setSearchType("all")
            setSearch("")
        } else if (value === "#title") {
            setSearchType("title")
            setSearch("")
        } else if (value === "#more") {
            setSearchType("more")
            setSearch("")
        } else if (value === "#color") {
            setSearchType("color")
            setSearch("")
        } else if (value === "#author") {
            setSearchType("author")
            setSearch("")
        } else if (value === "#published") {
            setSearchType("published")
            setSearch("")
        } else if (value === "#pages") {
            setSearchType("pages")
            setSearch("")
        } else {
            if (searchType === "pages" || searchType === "published") {
                let lastChar = value.charAt(value.length - 1)
                let test = /[0-9]/.test(lastChar)
                console.log(value)
                if (test || value.length === 0 || lastChar === " " || lastChar === "<" || lastChar === ">" || value.charAt(0) === "#" || lastChar === "s") 
                    setSearch(value) 
            } else {
                setSearch(value)
            }
        }
    }

    wrapperRef.current = { initialRoomSetup, determineSearchArea } 

    return (
        <div className="rooms">
            <div className="b-sec-center">
                <button className="b-section" onClick={toggleRoomsView}>Room</button>
                <div className="b-sec-line" style={{ display: showRooms ? "block" : "none" }}/>
            </div>
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
                <div className="n-room">
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