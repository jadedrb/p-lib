import { useState, useEffect, useRef } from 'react';
import { REMOVE_BOOK } from '../context';
import BookService from '../services/BookService';
import { utilPath, loading } from "../services/utility";
import Markers from './Markers'
import MoveFromHub from './MoveFromHub';

function MarkersHub({ user, navigate, setShowMarkers, dispatch, path, rooms }) {

    const [selectedMarker, setSelectedMarker] = useState('favorited')
    const [markedBooks, setMarkedBooks] = useState([])
    const [enableMarkers, setEnableMarkers] = useState(true)
    const [showMoveStuff, setShowMoveStuff] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [responsiveHeight, setResponsiveHeight] = useState(window.innerHeight)

    const hubRef = useRef()

    useEffect(() => {
        const resize = (e) => setResponsiveHeight(e.target.innerHeight)
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize)
    }, [])

    useEffect(() => {
        // loading('.m-hub-body')
        setIsLoading(true)

        async function getMakers() {
            try {
                const markers = await BookService.getThisInThat({ search: selectedMarker, searchType: 'markers' })
                setMarkedBooks(markers)
                setIsLoading(false)
            } catch(err) {
                console.log(err)
            }
        }
        
        getMakers()

    }, [user, selectedMarker])

    useEffect(() => {
        // The height of the hub changes when it's populated with data
        // So this auto-adjusts it by calculating the styles again on a new render
        if (markedBooks.length) {
            setResponsiveHeight(window.innerHeight - 1)
        }
    }, [markedBooks])

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
        if (isLoading) {
            return null
        }
        return <p style={{ marginBottom: '100px' }}><span>No books {selectedMarker}</span></p>
    }

    let markedBookStyle = selectedMarker === 'favorited' ? selectedStyleFav : selectedMarker === 'selected' ? selectedStyleSel : selectedStyleMis 

    let responsiveHeightObj = {
        maxHeight: `${responsiveHeight - 100}px` 
    }

    return ( 
            <div className="u-modal markers-hub" style={responsiveHeightObj} ref={hubRef}>
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


