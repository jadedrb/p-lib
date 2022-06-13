import { useState, useEffect } from 'react';
import { REMOVE_BOOK } from '../context';
import BookService from '../services/BookService';
import { utilPath, loading, clearLoading } from "../services/utility";
import Markers from './Markers'
import MoveFromHub from './MoveFromHub';

function MarkersHub({ user, navigate, setShowMarkers, dispatch, path, rooms }) {

    const [selectedMarker, setSelectedMarker] = useState('favorited')
    const [markedBooks, setMarkedBooks] = useState([])
    const [enableMarkers, setEnableMarkers] = useState(true)
    const [showMoveStuff, setShowMoveStuff] = useState(false)

    useEffect(() => {
        loading('.m-hub-body')

        BookService
            .getMarkerForUser(selectedMarker, user)
            .then(mb => setMarkedBooks(mb))

    }, [user, selectedMarker])

    let selectedStyleFav = {
        color: selectedMarker === 'favorited' ? 'blue' : 'black',
        outline: selectedMarker === 'favorited' ? '1px solid blue' : 'none',
        opacity: enableMarkers  ? '1' : selectedMarker !== 'favorited' ? '.1' : '1',
        cursor: enableMarkers  ? 'pointer' : selectedMarker !== 'favorited' ? 'default' : 'pointer'
    }
//&& selectedMarker !== 'favorited'
    let selectedStyleSel = {
        color: selectedMarker === 'selected' ? 'lightskyblue' : 'black',
        outline: selectedMarker === 'selected' ? '1px solid lightskyblue' : 'none',
        opacity: enableMarkers ? '1' : selectedMarker !== 'selected' ? '.1' : '1',
        cursor: enableMarkers  ? 'pointer' : selectedMarker !== 'selected' ? 'default' : 'pointer'
    }
// && selectedMarker !== 'selected'
    let selectedStyleMis = {
        color: selectedMarker === 'missing' ? 'gold' : 'black',
        outline: selectedMarker === 'missing' ? '1px solid gold' : 'none',
        opacity: enableMarkers ? '1' :  selectedMarker !== 'missing' ? '.1' : '1',
        cursor: enableMarkers  ? 'pointer' : selectedMarker !== 'missing' ? 'default' : 'pointer'
    }
// && selectedMarker !== 'missing'
    const redirectToBook = async (book) => {
        let coord = await BookService.getBookCoordinates(book.id)
        setShowMarkers(false)
        navigate(utilPath(coord, "coord"))
    }

    const handleDelete = async () => {
        let confirm = window.confirm(`Are you sure you want to delete all ${markedBooks.length} selected books?`)
        if (!confirm) return
        loading('.m-hub-body')
        setShowMarkers(false)
        for (let i = 0; i < markedBooks.length; i++) {
            try {
                let coord = await BookService.getBookCoordinates(markedBooks[i].id)
                await BookService.removeBookFromShelfAndUser(coord.book, coord.shelf, user)
                dispatch({ type: REMOVE_BOOK, payload: { bcid: coord.bookcase, rid: coord.room, shid: coord.shelf, bid: coord.book }})
            } catch (e) {
                alert('Something went wrong. Try again later.')
                return
            }
        }
        alert(`All ${markedBooks.length} selected books have been deleted.`)
        clearLoading()
    }

    const renderMarkerSpace = () => {
        const markerSpace = markedBooks.map(mb => 
            <div key={mb.id} style={markedBookStyle}>
                    <span onClick={() => redirectToBook(mb)}>{mb.title}</span>
                    <Markers modalPic='' selectedBook={mb} setEnableMarkers={setEnableMarkers} />
            </div>
        )
        if (selectedMarker === 'selected') {
            if (showMoveStuff) {
                return <MoveFromHub 
                            rooms={rooms} 
                            selected={markedBooks} 
                            navigate={navigate} 
                            path={path} 
                            dispatch={dispatch} 
                            user={user} 
                            setShowMarkers={setShowMarkers}
                        />
            }
        }
        if (markedBooks.length) {
            return markerSpace
        }
        return <p>No books {selectedMarker}</p>
    }

    let markedBookStyle = selectedMarker === 'favorited' ? selectedStyleFav : selectedMarker === 'selected' ? selectedStyleSel : selectedStyleMis 

    return ( 
            <div className="u-modal markers-hub" style={{ height: `${window.innerHeight - 400}px` }}>
                <div className='m-hub-head'>
                    <div onClick={() => enableMarkers && setSelectedMarker('favorited')} style={selectedStyleFav}>Favorited</div>
                    <div onClick={() => enableMarkers && setSelectedMarker('selected')} style={selectedStyleSel}>Selected</div>
                    <div onClick={() => enableMarkers && setSelectedMarker('missing')} style={selectedStyleMis}>Missing</div>
                </div>
                {selectedMarker === 'selected' && markedBooks.length ? <div className='m-hub-opt' onClick={() => setShowMoveStuff(!showMoveStuff)}><span>~</span><span onClick={handleDelete}>-</span></div> : null}
                <div className='m-hub-body'>
                    {renderMarkerSpace()}
                </div>
            </div>
     );
}

export default MarkersHub;


