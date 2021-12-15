import { useState } from "react"
import NewRoom from "./NewRoom"

const Rooms = () => {
    let [showRooms, setShowRooms] = useState(false)
    return (
        <div className="rooms">
            <button onClick={() => setShowRooms(!showRooms)}>Rooms</button>
            {showRooms &&
                <div>
                    <NewRoom />
                </div> 
            }
        </div>
    )
}

export default Rooms