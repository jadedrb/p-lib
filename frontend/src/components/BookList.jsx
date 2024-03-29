import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { utilPath, utilOrder, loading, clearLoading } from '../services/utility';
import GeneralModal from './GeneralModal'
import Markers from './Markers';

const BookList = ({ books, bid, path, navigate, selected }) => {

    let [order, setOrder] = useState("")
    let [ascDesc, setAscDesc] = useState(true)

    let [focusOn, setFocusOn] = useState(false)

    let renderedBooks = utilOrder(books, order, ascDesc)

    let intoViewRef = useRef(true)

    let [modalPic, setModalPic] = useState(false)
    let [selectedBook, setSelectedBook] = useState(false)

    useEffect(() => {
   
        if (bid) {
            setFocusOn(true)
        } else {
            setFocusOn(false)
        }
        
        if (intoViewRef.current) {
            setTimeout(() => {
                const section = document.querySelector(`.bk-${bid}`);
                
                if (section)
                    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100)
       
        } else {
            intoViewRef.current = true
        }
    }, [bid])

    const thumbnailPreview = async (b) => {
        loading(`.sh-b`, false, 'thumb')
        let result;

        try {
            result = await axios.get(`${import.meta.env.VITE_GOOGLE_API}${b.title}`)
        } catch (e) {
            console.log(e)
        }
                        
        let pics = result.data.items.reduce((acc, curr) => {
            if (curr.volumeInfo?.authors?.includes(b.author)) {
                if (curr.volumeInfo?.title === b.title) {
                    let thumb = curr?.volumeInfo?.imageLinks?.thumbnail
                    if (thumb)
                        if (!thumb.includes("https"))
                            thumb = `https${thumb.slice(4)}`
                        return [...acc, thumb]
                    }
                }
                return acc
        }, [])

        let pic = pics[Math.floor(Math.random() * pics.length)]
        setModalPic(pic ? pic : b.title)
        setSelectedBook(b)
        clearLoading()
    }

    renderedBooks = renderedBooks?.map((b,i) => {
        
        const styleMarkedBooks = { 
            backgroundColor: b.markers?.includes('missing') ? 'gold'
            :
            b.markers?.includes('favorite') ? '#6363FF'
            :
            b.markers?.includes('select') ? 'lightskyblue'
            :
            'inherit'
        }

        return (
            <tr 
                className={`bk-${b.id}`}
                key={i} 
                onClick={async () => { 
                    intoViewRef.current = false; 
                    navigate(utilPath(path, 'book', b.id)); 
                    if (!focusOn && b.id == bid) 
                        thumbnailPreview(b)
                }} 
                style={{ outline: selected.highlight.includes(b?.id + "") ? '3px solid rgb(74, 74, 255)' : bid == b?.id ? '3px solid black' : 'none', opacity: (bid == b?.id || selected.highlight.includes(b?.id + "")) && focusOn ? '1' : !focusOn ? '1' : '.3' }}
            >
                <td 
                    style={styleMarkedBooks}
                    onMouseOver={(e) => {
                        if (b.id == bid) {
                            if (b.color === "white" || b.color === "black") 
                                e.target.style.backgroundColor = 'lightgrey'
                            e.target.style.color = b.color
                        }
                    }}
                    onMouseLeave={(e) => { e.target.style.color = 'black'; e.target.style.backgroundColor = styleMarkedBooks.backgroundColor }}
                    onClick={(e) => { if (b.id == bid && e.target.style.color === b.color) thumbnailPreview(b); }}
                >{b.title}</td>
                <td style={styleMarkedBooks}>{b.author}</td>
                <td style={{ color: bid == b?.id && focusOn ? b.color : 'black', backgroundColor: bid == b?.id && focusOn && b.color === "white" ? "lightgrey" : styleMarkedBooks.backgroundColor }}>{b.color}</td>
                <td style={styleMarkedBooks}>{b.genre}</td>
                <td style={styleMarkedBooks}>{b.lang}</td>
                <td style={styleMarkedBooks}>{b.pdate}</td>
                <td style={styleMarkedBooks}>{b.pages}</td>
                <td style={styleMarkedBooks} className={`${b.id != bid ? 'bk-more' : ''}`}>{b.more}</td>
            </tr>
        )
    })

    const handleOrder = (o) => {
        if (order === o)
            setAscDesc(!ascDesc)
        else 
            setOrder(o)
    }

    const height =  !renderedBooks.length ? 50 : renderedBooks.length * 50 < 350 ? renderedBooks.length * 50 : 350 

    return (
        <div style={{ height }} className={`table-contain booklist-r ${!renderedBooks.length && 'table-cc'}`} onClick={(e) => { if (e.target.type !== "td") setFocusOn(false) }}>
            {renderedBooks.length ? <h5>books: {renderedBooks.length}</h5> : null}
            {renderedBooks?.length ? 
                <table className='booklist'>
                    <thead>
                        <tr style={{ backgroundColor: "lightgrey", fontSize: "13px" }}>
                            <th onClick={() => handleOrder("title")}>title</th>
                            <th onClick={() => handleOrder("author")}>author</th>
                            <th onClick={() => handleOrder("color")}>color</th>
                            <th onClick={() => handleOrder("genre")}>genre</th>
                            <th onClick={() => handleOrder("lang")}>language</th>
                            <th onClick={() => handleOrder("pdate")}>published</th>
                            <th onClick={() => handleOrder("pages")}>pages</th>
                            <th onClick={() => handleOrder("more")}>more</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedBooks}
                    </tbody>    
                </table>
            : <span>This shelf is empty</span>}

            {modalPic && 
            <GeneralModal toggle={() => setModalPic(false)}>
                <>
                {modalPic.includes("http") ? 
                <div className="u-modal" style={{ backgroundColor: 'black', width: 'fit-content'}}>
                        <img src={modalPic} alt={"cover"} />
                </div> : <h4 className='title-modal'>{modalPic}</h4>}
                <Markers modalPic={modalPic} selectedBook={selectedBook} />
                </>
            </GeneralModal>}
        </div>
    )
}

export default BookList;