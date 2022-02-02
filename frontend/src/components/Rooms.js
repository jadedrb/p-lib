import { useState, useContext } from "react"
import NewRoom from "./NewRoom"
import { Context } from '../context'

const Rooms = () => {

    const { rooms, dispatch } = useContext(Context)

    let [showRooms, setShowRooms] = useState(false)

    const toggleRoomsView = () => {
        setShowRooms(!showRooms)
    }

    return (
        <div className="rooms">
            <button onClick={toggleRoomsView}>Rooms</button>
            {showRooms &&
                <div>
                    <NewRoom rooms={rooms} dispatch={dispatch} />
                </div> 
            }
        </div>
    )
}

export default Rooms