import { useState, useContext, useEffect } from "react"
import NewBookcase from "./NewBookcase"
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Context } from "../context"
import { utilitySelector } from "../services/utility";

const Bookcases = () => {
    let { rooms, current, dispatch } = useContext(Context);
    
    let params = useParams()
    let { rid, bcid, shid, bid } = params
    let navigate = useNavigate()
    let path = useLocation()

    let [showBookcases, setShowBookcases] = useState(true)
    let [currentRoom, setCurrentRoom] = useState(null)
    let [currentBookcase, setCurrentBookcase] = useState(null)
    // let currentRoom, currentBookcase;


    useEffect(() => {
        let { room, bkcase } = utilitySelector(rid, bcid, shid, rooms)
        setCurrentRoom(room)
        setCurrentBookcase(bkcase)
    }, [shid, rid, bcid, rooms])

    return (
        <div className="bookcases">
            <div className="b-sec-center">
                <button className="b-section" onClick={() => setShowBookcases(!showBookcases)}>Bookcase</button>
                <div className="b-sec-line" style={{ display: showBookcases ? "block" : "none" }}/>
            </div>
            {showBookcases &&
                <div>
                    <NewBookcase 
                        current={current} 
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
                    />
                </div> 
            }
            <Outlet />
        </div>
    )
}

export default Bookcases