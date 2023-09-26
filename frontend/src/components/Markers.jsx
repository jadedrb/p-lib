import { useEffect, useState, useRef } from "react";
import { useLibContext, UPDATE_BOOK } from "../context";
import BookService from "../services/BookService";

function Markers({ modalPic, selectedBook, setEnableMarkers, closeOption }) {

    const { dispatch } = useLibContext()

    let [markers, setMarkers] = useState([])

    let wrapperRef = useRef()

    const updateOnEntry = () => {
        let marks;
        try {
            marks = JSON.parse(selectedBook.markers)
            marks.includes('')
        } catch (e) {
            marks = []
        }
        setMarkers(marks)
    }

    const updateOnExit = async (markers) => {

        let mString = JSON.stringify(markers)

        // markers in database starts as "null", so check for those cases too
        // also mSring.length is 2 (ex: '[]') when it's an empty stringified array (meaning no updates)
        if ((mString === selectedBook.markers) || (!selectedBook.markers && mString.length <= 2)) return

        let coord = await BookService.getBookCoordinates(selectedBook.id)
        let book = await BookService.updateBookForShelf({ ...selectedBook, markers: mString }, coord.book)
    
        dispatch({
            type: UPDATE_BOOK,
            payload: { shid: coord.shelf, rid: coord.room, bcid: coord.bookcase, bid: coord.book, book },
        });
    }

    wrapperRef.current = { mount: false, updateOnExit, updateOnEntry }

    useEffect(() => {
        let { mount, updateOnEntry } = wrapperRef.current
        let timeout = setTimeout(() => {
            mount = true
            updateOnEntry()
        }, 100)
        return () => {
            clearTimeout(timeout)
            if (mount){
                wrapperRef.current.mount = 'exit'
            }
        }
    }, [])

    useEffect(() => {
        return () => {
            let { mount, updateOnExit } = wrapperRef.current
            if (mount === 'exit') {
                updateOnExit(markers)
            }
        }
    }, [markers])

    const handleMarker = (name) => {

        if (setEnableMarkers)
            setEnableMarkers(false)
        
        if (markers?.includes(name)) {
            setMarkers(markers.filter(m => m !== name))
        } else {
            setMarkers([...markers, name])
        }

        if (closeOption) {
            setTimeout(() => { 
                closeOption(false)
            }, 500)
        }

    }

    return (  
        <div className="markers" style={{ top: modalPic.includes("http") ? '80%' : modalPic ? '50%' : null }}>
            <svg onClick={() => handleMarker('favorited')} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={markers?.includes('favorited') ? 'blue' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <svg onClick={() => handleMarker('selected')} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={markers?.includes('selected') ? 'lightskyblue' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <svg onClick={() => handleMarker('missing')} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={markers?.includes('missing') ? 'gold' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </div>
    );
}

export default Markers;