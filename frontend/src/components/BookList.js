import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { utilPath } from '../services/utility';

// import { Context } from '../context'
// import RoomService from '../services/RoomService';

// let RoomServe = new RoomService();

                // title: String,
                // author: String,
                // type: String,
                // genre: String,
                // location: String,
                // shelf: String,
                // user: String,

const BookList = ({ books }) => {

    let path = useLocation()
    let navigate = useNavigate()
    let { bid } = useParams()

    let renderedBooks = books?.map((b,i) => {
        return (
            <tr 
                key={i} 
                onClick={() => navigate(utilPath(path, 'book', b.id))} 
                style={{ outline: Number(bid) === b.id ? '3px solid black' : 'none' }}
            >
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.color}</td>
                <td>{b.genre}</td>
                <td>{b.pages}</td>
                <td>{b.pdate}</td>
                <td>{b.more}</td>
            </tr>
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