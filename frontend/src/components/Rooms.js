import { useState, useContext, useEffect, useRef } from "react"
import NewRoom from "./NewRoom"
import { Context, SET_USER, UPDATE_SETTINGS } from '../context'
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

import Bookz from '../services/BookService'
import UserService from '../services/UserService'
import SearchResults from "./SearchResults"
import GeneralModal from "./GeneralModal"

import { clearLoading, loading, utilTime } from "../services/utility";

const Rooms = () => {

    const { rooms, dispatch, user, reposition, setup, settings } = useContext(Context)

    let { bcid, rid, bid, shid } = useParams()
    let wrapperRef = useRef()

    let navigate = useNavigate();
    let path = useLocation();

    let [showRooms, setShowRooms] = useState(true) // rid ? true : false
    let [search, setSearch] = useState("")
    let [results, setResults] = useState([])
    let [typing, setTyping] = useState(false)
    let [showResults, setShowResults] = useState(true)
    let [searchIn, setSearchIn] = useState("library")
    let [searchType, setSearchType] = useState("title")
    let [showUserDet, setShowUserDet] = useState(false)
    let [userDetails, setUserDetails] = useState({})

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

    useEffect(() => {
        if (!results.length && searchIn === "results")
            setSearchIn("library")
    }, [results.length, searchIn])

    useEffect(() => {
        if (wrapperRef.current.finish)
            wrapperRef.current.finish = false
    }, [showRooms])

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
            greater = Number(search.trim()) - 1
            lesser = Number(search.trim()) + 1
        } else if (greater && !lesser) {
            lesser = "9999"
        } else if (!greater && lesser) {
            greater = "0"
        }

        return { greater: Number(greater), lesser: Number(lesser) }
    }

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
            case "results":
                if (searchType === "title" || searchType === "genre" || searchType === "color" || searchType === "author" || searchType === "more") 
                    return results.filter((b) => b[searchType].toLowerCase().includes(search.toLowerCase()))
                if (searchType === "all") 
                    return results.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
                if (searchType === "published" || searchType === "pages") {
                    let { greater, lesser } = parsePagesAndDate(search)
                    if (searchType === "published")
                        return results.filter((b) => b.pdate > greater && b.pdate < lesser)
                    else
                        return results.filter((b) => b.pages > greater && b.pages < lesser)
                }
                return []
            default:
                return []
        }
    }
    const toggleRoomsView = () => {
        if (wrapperRef.current.finish) return
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
                if (test || value.length === 0 || lastChar === " " || lastChar === "<" || lastChar === ">" || value.charAt(0) === "#" || lastChar === "s") 
                    setSearch(value) 
            } else {
                setSearch(value)
            }
        }
    }

    wrapperRef.current = { determineSearchArea } 

    const handleLogout = () => {
        localStorage.removeItem("token")
        dispatch({
            type: SET_USER,
            payload: ""
        })
        navigate("/home")
    }

    const handleAccountDeletion = async (id) => {
        console.log(id)
        const confirm = window.confirm("Are you sure you want to delete your account?")
        if (confirm) {
            let confirmMsg = `Yes, I, ${user}, would like to delete my account`
            const confirmAgain = window.prompt(`One more step. Please confirm by typing: ${confirmMsg}`)
            if (confirmMsg === confirmAgain) {
                let deletion = await UserService.removeUser(id)
                if (deletion.deleted) {
                    alert('Account deleted.')
                    setShowUserDet(!showUserDet)
                    handleLogout()
                } else {
                    alert('Attempt to delete account was unsuccessful.')
                }
            }
        }
    }

    const handleOtherSettings = async (id, setting) => {
        console.log('ok')
        loading(".u-modal")
        let currentSettings = await UserService.getUserByName(user)
        console.log(currentSettings)
        let other = {}

        if (currentSettings.other)
            other = JSON.parse(currentSettings.other)
        
        other = { ...other, [Object.keys(setting)[0]]: Object.values(setting)[0] }
        await UserService.updateUserOfId({ other: JSON.stringify(other)}, id) 
        
        dispatch({
            type: UPDATE_SETTINGS,
            payload: other
        })

        clearLoading()
    }

    const handleShowDetails = async () => {
        if (!showUserDet) {
            setTimeout(() => loading(".u-modal"), 1)
            setShowUserDet(!showUserDet)
            let usr = await UserService.getUserDetails(user)
            setUserDetails(usr.filter(ud => ud.hasOwnProperty(user))[0])
            console.log(usr)
            console.log('done')
            clearLoading()
        } else {
            setShowUserDet(!showUserDet)
        }
    }

    const handleCreationTime = (ud) => utilTime(Object.keys(ud).filter(udp => /[0-9]/.test(udp))[0])

    const lastFirst = settings.names === 'last, first'
    const readWrite = settings.default === 'Read/Write'

    return (
        <div className="rooms">
            {(search && !typing && showResults) || results.length ? <SearchResults books={results} bid={Number(bid)} setShowResults={setShowResults} setResults={setResults} /> : null}
            <button className="logout" onClick={handleLogout}>Logout</button>
            <h4 className="welcome"><span>{user && `welcome`}</span> <span onClick={handleShowDetails}>{user}</span></h4>
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
                    {results.length && <option value="results">Search Results:</option>}
                </select>
                <input 
                    value={search} 
                    placeholder={searchType}
                    onChange={handleSearchChange}
                />
            </label>
           

            {showRooms &&
                <div className="n-room">
                    <NewRoom 
                        navigate={navigate}
                        path={path}
                        reposition={reposition}
                        rooms={rooms} 
                        dispatch={dispatch} 
                        bcid={Number(bcid)} 
                        rid={Number(rid)}
                        user={user}
                        setup={setup}
                    />
                </div> 
            }

            {showUserDet &&
                <GeneralModal toggle={handleShowDetails}>
                    <div className="u-modal">
                        <div>
                            <h3><span>{user}</span> <span>library</span> <span>settings</span></h3>
                            <h6>Account created on: {handleCreationTime(userDetails)}</h6>
                            <ul>
                                <li>Your library has:</li>
                                <li>{userDetails.rooms} rooms</li>
                                <li>{userDetails.bookcases} bookcases</li>
                                <li>{userDetails.shelves} shelves</li>
                                <li>{userDetails.books} books</li>
                            </ul>
                            <br/>
                            <div className="u-modal-set">
                                <p>Make {lastFirst ? "first" : "last"} names appear before {lastFirst ? "last" : "first"} names (Example: {lastFirst ? "George Washington" : "Washington, George"})</p>
                                <button onClick={() => handleOtherSettings(userDetails[user], { names: lastFirst ? "first, last" : "last, first" })}>Switch</button>
                                <p>Currently set to {settings.default} by default. Change default to {readWrite ? "Read Only" : "Read/Write"}</p>
                                <button onClick={() => handleOtherSettings(userDetails[user], { default: readWrite ? "Read Only" : "Read/Write" })}>Read/Write</button>
                                <p>Your account is {settings.default}. Temporarily switch to {readWrite ? "Read Only" : "Read/Write"}</p>
                                <button>Read/Write</button>
                                <p>Delete my personal library and account information</p>
                                <button onClick={() => handleAccountDeletion(userDetails[user])}>Delete</button>
                            </div>
                        </div>
                    </div>
                </GeneralModal>
            }
            <Outlet />
        </div>
    )
}

export default Rooms