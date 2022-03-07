import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { utilPath } from '../services/utility';

import Shelves from '../services/ShelfService'
import { REMOVE_SHELF } from '../context';

const BookList = ({ books, dispatch }) => {

    let path = useLocation()
    let navigate = useNavigate()
    let { bcid, shid, rid, bid } = useParams()

    const removeShelf = async () => {
        await Shelves.removeShelfFromBookcase(shid, bcid)
        dispatch({ type: REMOVE_SHELF, payload: { shid, bcid, rid } })
        navigate(utilPath(path, 'bookcase', bcid))
    }

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
            <div className="pm-sh" onClick={removeShelf}>-</div>
            {renderedBooks?.length ? 
                <table className='booklist'>
                    <tbody>
                        {renderedBooks}
                    </tbody>    
                </table>
            : "This shelf is empty"}
        </div>
    )
}

export default BookList;