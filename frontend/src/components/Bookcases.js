import { useState, useContext } from "react"
import NewBookcase from "./NewBookcase"
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Context } from "../context";

const Bookcases = () => {
    let { rooms, current, dispatch } = useContext(Context);
    
    let { rid, bcid } = useParams()
    let navigate = useNavigate()
    let path = useLocation()

    let [showBookcases, setShowBookcases] = useState(true)

    let currentRoom, currentBookcase;

    if (rid) {
        currentRoom = rooms[rooms.findIndex((r) => r.id === Number(rid))]
        if (bcid) {
            currentBookcase = currentRoom.bookcases[
                currentRoom.bookcases.findIndex((r) => r.id === Number(bcid))
            ]; 
        }
    }

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
                    />
                </div> 
            }
            <Outlet />
        </div>
    )
}

export default Bookcases