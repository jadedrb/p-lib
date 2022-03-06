import { useState, useContext, useEffect, useRef } from "react"
import NewRoom from "./NewRoom"
import { Context, SET_ROOMS, SET_USER } from '../context'
import { Outlet, useParams } from "react-router-dom"

import Roomz from '../services/RoomService'
import Userz from '../services/UserService'

const Rooms = () => {

    const { rooms, dispatch, user } = useContext(Context)

    let { bcid, rid } = useParams()
    let initialRoomSetup = useRef()

    initialRoomSetup.current = async () => {
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

    let [showRooms, setShowRooms] = useState(true) // rid ? true : false

    useEffect(() => {
        initialRoomSetup.current()
    }, [])

    const toggleRoomsView = async () => {
        if (!showRooms) {
            initialRoomSetup.current()
        }
        setShowRooms(!showRooms)
    }

    return (
        <div className="rooms">
            <button onClick={toggleRoomsView}>Rooms</button>
            {showRooms &&
                <div>
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