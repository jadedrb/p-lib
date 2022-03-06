import { useState, useContext, useEffect } from "react"
import NewBookcase from "./NewBookcase"
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Context } from "../context"
import { utilitySelector } from "../services/utility";

const Bookcases = () => {
    let { rooms, current, dispatch } = useContext(Context);
    
    let { rid, bcid, shid, bid } = useParams()
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
            <button onClick={() => setShowBookcases(!showBookcases)}>Bookcases</button>
            {showBookcases &&
                <div>
                    <NewBookcase 
                        current={current} 
                        dispatch={dispatch} 
                        currentRoom={currentRoom}
                        currentBookcase={currentBookcase}
                        navigate={navigate}
                        path={path}
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