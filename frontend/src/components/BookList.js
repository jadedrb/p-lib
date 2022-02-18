import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// import { Context } from '../context'
// import RoomService from '../services/RoomService';

// let RoomServe = new RoomService();

const BookList = ({ books }) => {

    let { pathname } = useLocation()
    let navigate = useNavigate()
    let { bid } = useParams()
    // console.log(pathname.split("/").slice(0, 7).join("/") + '/book/' + 353)
console.log(bid)
    const navToBook = (id) => {
        navigate(pathname.split("/").slice(0, 7).join("/") + '/book/' + id)
    }

    let renderedBooks = books?.map((b,i) => {
        return (
            <tr key={i} onClick={() => navToBook(b.id)} style={{ outline: Number(bid) === b.id ? '3px solid black' : 'none' }}>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.genre}</td>
                <td>{b.pcount}</td>
                <td>{b.pdate}</td>
                <td>{b.color}</td>
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
        <div className="table-contain">
            {renderedBooks?.length ? 
                <table className='booklist'>
                    <tbody>
                        {renderedBooks}
                    </tbody>    
                </table>
            : null}
        </div>
    )
}

export default BookList;