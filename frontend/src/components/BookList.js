import React, { useContext, useEffect } from 'react';
import { Context } from '../context'
import RoomService from '../services/RoomService';

let RoomServe = new RoomService();

const BookList = () => {
    const { books, user } = useContext(Context)
   // let [bookz, setBookz] = useState([])

    useEffect(() => {
        if (!user) { // change later
            RoomServe
                .getRooms()
                .then(res => console.log(res.data))
        }
    }, [user])

    let renderedBooks = books.map((b,i) => {
        return (
            <tr key={i}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.type}</td>
                <td>{b.genre}</td>
                <td>{b.location}</td>
                <td>{b.shelf}</td>
                <td>{b.user}</td>
            </tr>
                // title: String,
                // author: String,
                // type: String,
                // genre: String,
                // location: String,
                // shelf: String,
                // user: String,
        )
    })

    return (
        <table className='booklist'>
            {renderedBooks}
        </table>
    )
}

export default BookList;