import { useContext } from 'react'
import { Context } from '../context'


const NewBookcase = () => {

    let { rooms, current } = useContext(Context)

    let currentRoom, currentBookcase;

    if (current && current.rm) {
        currentRoom = rooms[rooms.findIndex(r => r.id === current.rm)]
        currentBookcase = currentRoom.bookcases[currentRoom.bookcases.findIndex(r => r.id === current.bc)]
    }

    return (
        <div>
            Room ID: {currentRoom?.id},
            Bookcase ID: {currentBookcase?.id} 
        </div>
    )
}

export default NewBookcase