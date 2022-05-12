import { useState, useContext, useEffect, useRef } from "react"
import NewRoom from "./NewRoom"
import { Context, SET_USER } from '../context'
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

import Bookz from '../services/BookService'
import UserService from '../services/UserService'
import SearchResults from "./SearchResults"

import { utilPath } from "../services/utility";
import Settings from "./Settings"
import BookService from "../services/BookService"

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
    let [extraStuff, setExtraStuff] = useState(false)
    let [extraStuffHeight, setExtraStuffHeight] = useState(false)
    let [searchIn, setSearchIn] = useState("library")
    let [searchType, setSearchType] = useState("title")
    let [showUserDet, setShowUserDet] = useState(false)
    let [userDetails, setUserDetails] = useState({})
    let [categoryDetails, setCategoryDetails] = useState(null)

    useEffect(() => {
        let delay;
        setTyping(true)
        setShowResults(true)
        if (search.charAt(0) === "#" || search.charAt(0) === "?") return
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
                    return results.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.genre.toLowerCase().includes(search.toLowerCase()) || b.more.toLowerCase().includes(search.toLowerCase()) || b.color.toLowerCase().includes(search.toLowerCase()))
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

    const rollRandomBook = async () => {
        let book = await BookService.getRandomBookForUser(user)
        let coord = await BookService.getBookCoordinates(book.id)
        navigate(utilPath(coord, "coord"))
    }

    const handleSearchChange = (e) => {
        let { value } = e.target
        if (value === "#genre" || value === "#all" || value === "#title" || value === "#more" || value === "#color" || value === "#author" || value === "#published" || value === "#pages") {
            setSearchType(value.slice(1))
            setSearch("")
        } else if (value === "#roll") {
            setSearch("")
            rollRandomBook() 
        } else if (value === "?genres" || value === "?authors" || value === "?colors") {
            BookService.getUserCategoryCount(user, value.slice(1)).then(details => setCategoryDetails(details))
            setSearchType(value.slice(1, value.length - 1))
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
            if (categoryDetails) 
                setCategoryDetails(null)
        }
    }

    // const recordSearchParams = () => {
    //     setSearchParams(`${search} in ${searchType}`)
    // }

    wrapperRef.current = { determineSearchArea } 

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("time")
        dispatch({
            type: SET_USER,
            payload: ""
        })
        navigate("/home")
    }

    const handleShowDetails = async () => {
        if (!showUserDet) {
            // setTimeout(() => loading(".u-modal"), 1)
            setShowUserDet(!showUserDet)
            let usr = await UserService.getUserDetails(user)
            setUserDetails(usr.filter(ud => ud.hasOwnProperty(user))[0])
            // clearLoading()
        } else {
            setShowUserDet(!showUserDet)
        }
    }

    return (
        <div className="rooms">
            {(search && !typing && showResults) || results.length || (!results.length && searchIn === 'results') ? 
                <SearchResults 
                    search={search} 
                    searchType={searchType} 
                    books={results} bid={Number(bid)} 
                    setShowResults={setShowResults} 
                    searchIn={searchIn}
                    setResults={setResults} /> 
            : null}

            {!extraStuff &&
            <svg style={{ zIndex: '1' }} onClick={() => {
                setExtraStuff(!extraStuff)
                let body = document.querySelector('body')
                setExtraStuffHeight(body.clientHeight > window.innerHeight ? body.clientHeight + 100 : window.innerHeight)
            }} xmlns="http://www.w3.org/2000/svg" className="extra-stuff" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>}

            {extraStuff &&
            <svg onClick={() => setExtraStuff(!extraStuff)} xmlns="http://www.w3.org/2000/svg" className="extra-stuff" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>}

            {extraStuff &&
            <div style={{ height: extraStuffHeight }} className="extra-stuff-clicked" onClick={(e) => {
                if (e.target.classList.contains('extra-stuff-clicked')) 
                    setExtraStuff(!extraStuff) 
            }}>
                
            </div>
            }

            {extraStuff &&
            <>
                <div className="top-extra"></div>
                <div className="dropdown-extra">
                    <div className="drop" onClick={() => {
                        setExtraStuff(!extraStuff)
                        handleShowDetails()
                    }}>Settings</div>
                    <div className="drop" onClick={handleLogout}>Logout</div>
                </div>
            </>
            }

            <button className="logout" onClick={handleLogout}>Logout</button>
            <h4 className="welcome"><span>{user && `welcome`}</span> <span onClick={handleShowDetails}>{user}</span></h4>
            <div className={user ? "b-sec-center" : "b-sec-center b-sec-fade"}>
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
                {categoryDetails &&
                <div className="cat-deet">
                    {Object.keys(categoryDetails).map((details, i) =>
                        <div style={{ color: searchType === 'color' ? details : null }} key={i} onClick={() => {
                            setSearch(details)
                            setCategoryDetails(null)
                        }}>
                            <span>({categoryDetails[details]})</span>
                            {details}
                        </div> 
                    )}
                </div>
                }
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
                        settings={settings}
                    />
                </div> 
            }

            {showUserDet && 
                <Settings
                    rooms={rooms} 
                    settings={settings} 
                    user={user}
                    dispatch={dispatch}
                    setShowUserDet={setShowUserDet}
                    showUserDet={showUserDet}
                    userDetails={userDetails}
                    handleLogout={handleLogout}
                    handleShowDetails={handleShowDetails}
                />
            }
            <Outlet />
        </div>
    )
}

export default Rooms