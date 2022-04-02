import { useState, useContext, useEffect } from "react"
import NewBookcase from "./NewBookcase"
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Context, CURRENT_BOOK } from "../context"
import { utilitySelector, utilPath } from "../services/utility";

const Bookcases = () => {
    let { rooms, current, dispatch, settings, currentBook } = useContext(Context);
    
    let params = useParams()
    let { rid, bcid, shid, bid } = params
    let navigate = useNavigate()
    let path = useLocation()

    let [showBookcases, setShowBookcases] = useState(true)
    let [currentRoom, setCurrentRoom] = useState(null)
    let [currentBookcase, setCurrentBookcase] = useState(null)
    // let currentRoom, currentBookcase;


    useEffect(() => {
        let { room, bkcase, book } = utilitySelector(rid, bcid, shid, rooms, bid)
        setCurrentRoom(room)
        setCurrentBookcase(bkcase)

        if (bid && book && book.id !== currentBook?.id) {
            dispatch({
                type: CURRENT_BOOK,
                payload: book
            })
        } 

    }, [shid, rid, bcid, rooms, bid, dispatch, currentBook])

    return (
        <div className="bookcases">
            <div className="b-sec-center">
                <button className="b-section" onClick={() => setShowBookcases(!showBookcases)} onDoubleClick={() => { navigate(utilPath(path, "room", rid)); setShowBookcases(false) } }>Bookcase</button>
                <div className="b-sec-line" style={{ display: showBookcases ? "block" : "none" }}/>
            </div>
            {showBookcases &&
                <div>
                    <NewBookcase 
                        current={current} 
                        currentBook={currentBook}
                        dispatch={dispatch} 
                        currentRoom={currentRoom}
                        currentBookcase={currentBookcase}
                        navigate={navigate}
                        path={path}
                        rooms={rooms}
                        params={params}
                        shid={Number(shid)}
                        bid={Number(bid)}
                        bcid={Number(bcid)}
                        rid={Number(rid)}
                        settings={settings}
                    />
                </div> 
            }
            <Outlet />
        </div>
    )
}

export default Bookcases