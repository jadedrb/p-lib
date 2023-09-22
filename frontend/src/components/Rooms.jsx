import { useState, useEffect, useRef } from "react"
import NewRoom from "./NewRoom"
import { useLibContext, SET_USER } from '../context'
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"

import UserService from '../services/UserService'
import SearchResults from "./SearchResults"

import { utilPath, parsePagesAndDate } from "../services/utility";
import Settings from "./Settings"
import BookService from "../services/BookService"
import MarkersHub from "./MarkersHub"
import GeneralModal from "./GeneralModal"

const Rooms = () => {

    const { rooms, dispatch, user, reposition, setup, settings } = useLibContext()

    let params = useParams()
    let { bcid, rid, bid, shid } = params
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
    let [showMarkers, setShowMarkers] = useState(false)
    let [userDetails, setUserDetails] = useState({})
    let [categoryDetails, setCategoryDetails] = useState(null)
    let [searchGroup, setSearchGroup] = useState("category")

    useEffect(() => {
        let delay;
        setTyping(true)
        setShowResults(true)
        if (search.charAt(0) === "#" || search.charAt(0) === "?") return
        if (search) {
            delay = setTimeout(async () => {
                let res = await wrapperRef.current.determineSearchArea(search)
                console.log(res)
                if (res.error) {
                    alert(res.error)
                    return
                }
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
        if (!results?.length && searchIn === "results")
            setSearchIn("library")
    }, [results?.length, searchIn])

    useEffect(() => {
        if (wrapperRef.current.finish)
            wrapperRef.current.finish = false
    }, [showRooms])

    const determineSearchArea = (search) => {
    
        if (searchIn === 'results') {
            
            if (searchType === "title" || searchType === "genre" || searchType === "color" || searchType === "author" || searchType === "more") 
                return results.filter((b) => b[searchType].toLowerCase().includes(search.toLowerCase()))
            if (searchType === "language")
                return results.filter((b) => b["lang"].toLowerCase().includes(search.toLowerCase()))
            if (searchType === "all") 
                return results.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.genre.toLowerCase().includes(search.toLowerCase()) || b.more.toLowerCase().includes(search.toLowerCase()) || b.color.toLowerCase().includes(search.toLowerCase()))
            if (searchType === "published" || searchType === "pages") {
                let { greater, lesser } = parsePagesAndDate(search, searchType)
                if (searchType === "published")
                    return results.filter((b) => b.pdate > greater && b.pdate < lesser)
                else
                    return results.filter((b) => b.pages > greater && b.pages < lesser)
            }
        } else {

            let searchId = searchIn === 'room' ? rid : searchIn === 'bookcase' ? bcid : searchIn === 'shelf' ? shid : ''
            searchIn = searchIn === 'library' || searchIn === 'results' ? '' : searchIn
            searchType = searchType === 'language' ? searchType = 'lang' : searchType === 'published' ? 'pdate' : searchType
            search = searchType === 'pdate' || searchType === 'pages' ? parsePagesAndDate(search, searchType) : search

            return BookService.getThisInThat({ searchIn, search, searchType, searchId })
        }
    }

    const toggleRoomsView = () => {
        if (wrapperRef.current.finish) return
        setShowRooms(!showRooms)
    }

    const rollRandomBook = async () => {
        let coord = await BookService.getBookCoordinates('random')
        navigate(utilPath(coord, "coord"))
    }

    const handleSearchChange = (e) => {
        let { value } = e.target

        if (value === "#pub")
            value = "#published"
        if (value === "#lang")
            value = "#language"

        if (value === "#genre" || value === "#all" || value === "#title" || value === "#more" || value === "#color" || value === "#author" || value === "#published" || value === "#pages" || value === "#language") {
            setSearchType(value.slice(1))
            setSearch("")
        } else if (value === "#library" || value === "#room" || value === "#bookcase" || value === "#shelf" || value === "#results") {
            if ((value === "#room" && rid) || (value === "#bookcase" && bcid) || (value === "#shelf" && shid) || (value === "#results" && results?.length))
                setSearchIn(value.slice(1))
            setSearch("")
        } else if (value === "#roll") {
            setSearch("")
            rollRandomBook() 
        } else if (value === "?genres" || value === "?authors" || value === "?colors" || value === "?languages") {
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
            let usr = await UserService.getUserDetails()
            console.log(usr)
            setShowUserDet(!showUserDet)
            setUserDetails(usr.filter(ud => ud.hasOwnProperty(user))[0])
            // clearLoading()
        } else {
            setShowUserDet(!showUserDet)
        }
    }

    return (
        <div className="rooms">
            {(search && !typing && showResults) || results?.length || (!results?.length && searchIn === 'results') ? 
                <SearchResults 
                    search={search} 
                    searchType={searchType} 
                    books={results} bid={Number(bid)} 
                    setShowResults={setShowResults} 
                    searchIn={searchIn}
                    setResults={setResults} /> 
            : null}

            {!extraStuff &&
            <svg style={{ zIndex: user ? '1' : '0' }} onClick={() => {
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
                        setShowMarkers(!showMarkers)
                    }}>Markers</div>
                    <div className="drop" onClick={() => {
                        setExtraStuff(!extraStuff)
                        rollRandomBook()
                    }}>Roll</div>
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

            <div className="top-right-contain">

                <svg onClick={() => {
                    setShowMarkers(!showMarkers)
                }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 markers-icon" fill='black' viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>

            

                <label className="search-lib">
                    <select value={searchGroup === "space" ? searchIn : searchType} onChange={(e) => {
                        if (searchGroup === "space") {
                            if (e.target.value === 'category') {
                                setSearchGroup(e.target.value)
                                setSearchType("title")
                            } else {
                                setSearchIn(e.target.value)
                            }
                        } else {
                            if (e.target.value === 'library') {
                                setSearchGroup("space")
                                setSearchIn(e.target.value)
                            } else {
                                setSearchType(e.target.value)
                            }
                        }
                    }}>
                        {searchGroup === "space" && <option value="category">Search by Category:</option>}
                        {searchGroup === "space" && <option disabled>---</option>}
                        <option value="library">Search Library:</option>
                        {searchGroup === "category" && <option disabled>---</option>}

                        {searchGroup === "category" && <option value="title">Search by Title:</option>}
                        {searchGroup === "category" && <option value="author">Search by Author:</option>}
                        {searchGroup === "category" && <option value="color">Search by Color:</option>}
                        {searchGroup === "category" && <option value="genre">Search by Genre:</option>}
                        {searchGroup === "category" && <option value="language">Search by Language:</option>}
                        {searchGroup === "category" && <option value="published">Search by Publish Date:</option>}
                        {searchGroup === "category" && <option value="pages">Search by Pages:</option>}
                        {searchGroup === "category" && <option value="more">Search by More:</option>}
                        {searchGroup === "category" && <option value="all">Search all Categories:</option>}

                        {rid && searchGroup === "space" && <option value="room">Search Room:</option>}
                        {bcid && searchGroup === "space" && <option value="bookcase">Search Bookcase:</option>}
                        {shid && searchGroup === "space" && <option value="shelf">Search Shelf:</option>}
                        {results?.length && searchGroup === "space" && <option value="results">Search Results:</option>}

                    </select>
                    <input 
                        onBlur={() => setTimeout(() => setCategoryDetails(null), 300)}
                        value={search} 
                        placeholder={searchGroup === "space" ? searchType : searchIn}
                        onChange={handleSearchChange}
                    />

            
                {categoryDetails &&
                <div className="cat-deet">
                    {Object.keys(categoryDetails).sort((c,d) => categoryDetails[d] - categoryDetails[c]).map((details, i) =>
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


            </div>

            {showRooms &&
                <div className="n-room">
                    <NewRoom 
                        navigate={navigate}
                        path={path}
                        reposition={reposition}
                        rooms={rooms} 
                        dispatch={dispatch} 
                        bcid={bcid} 
                        rid={rid}
                        user={user}
                        setup={setup}
                        settings={settings}
                    />
                </div> 
            }

            {showUserDet && 
            <GeneralModal toggle={handleShowDetails}>
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
            </GeneralModal>
            }

            {showMarkers && 
            <GeneralModal toggle={() => setShowMarkers(false)}>
               <MarkersHub 
                    rooms={rooms}
                    navigate={navigate} 
                    user={user} 
                    setShowMarkers={setShowMarkers} 
                    dispatch={dispatch}
                    path={path}
                    params={params}
                    settings={settings}
                />
            </GeneralModal>
            }
            <Outlet />
        </div>
    )
}

export default Rooms