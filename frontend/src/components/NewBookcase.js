import { useState, useEffect } from "react";
import { REMOVE_BOOKCASE, UPDATE_BOOKCASE } from "../context";
import { utilMsg, utilPath, utilOrder } from "../services/utility";

import Bookcases from "../services/BookcaseService"
import Shelves from "../services/ShelfService"

const NewBookcase = ({ dispatch, currentRoom, currentBookcase, navigate, path, shid, bid, bcid, rid }) => {

  let [location, setLocation] = useState("Bookcase Location");
  let [shelves, setShelves] = useState("");
  let [width, setWidth] = useState(100);
  let [shelfHeight, setShelfHeight] = useState(30)

  let [edit, setEdit] = useState(false)

  useEffect(() => {
    if (currentRoom && currentBookcase) {
      let { location, shelves, width, height } = currentBookcase
  
      setLocation(location ? location : "Bookcase Location")
      setShelves(shelves.length)
      setWidth(width ? width : 100)
      setShelfHeight(height ? height : 30)
    }
  }, [currentRoom, currentBookcase, currentBookcase?.location, currentBookcase?.shelves.length, currentBookcase?.bcWidth, currentBookcase?.shHeight])

  const handleSubmit = async e => {
      e.preventDefault()

      let bkcase = {
        location, 
        width,
        height: shelfHeight
      }

      // if the current number of shelves is lower than the amount set
      let shelvesAdded = Number(shelves) - currentBookcase.shelves.length
      if (shelvesAdded > 0) {
                                            // Convoluted way of making a dummy array of empty objects
          await Shelves.addShelfForBookcase([...Array(Number(shelvesAdded)).keys()].map(() => { return {} }), bcid)
      }

      let nBk = await Bookcases.updateBookcaseForRoom(bkcase, bcid)
      console.log(nBk, ": updated bookcase")
  
      dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: currentRoom.id, bcId: currentBookcase.id, bc: nBk }})
  }

  const renderBookcases = () => {
      let arr = currentBookcase.shelves.length ? currentBookcase.shelves : [...Array(Number(shelves)).keys()]

      return arr.map((sh,i) => 
        <p 
          key={i} 
          className="shelf" 
          style={{ height: `${shelfHeight}px`, outline: `${sh.id === shid ? '3px solid black' : 'none'}` }}
          onClick={() => {
            if (!shid || !(shid === sh.id)) {
              if (sh.id)
                navigate(utilPath(path, 'shelf', sh.id))
            }
          }}
        >
          {shid === sh.id && sh.books?.length ? 
          sh.books
            .sort((a,b) => utilOrder({ a, b }, "lastname"))
            .map((b,i) => 
              <span 
                key={i} 
                onClick={() => navigate(utilPath(path, 'book', b.id)) }
                style={{ backgroundColor: bid === b?.id ? b.color : 'white' }}
              >
                
              </span>
            ) : 
            null}
        </p>
      )
  }

  const removeBookcase = async () => {
    let confirm = window.confirm(utilMsg({ type: 'bookcase', details: { bookcase: currentBookcase } }))
    if (!confirm) return
    await Bookcases.removeBookcaseFromRoom(bcid, rid)
    dispatch({ type: REMOVE_BOOKCASE, payload: { bcid, rid }})
    navigate(utilPath(path, 'room', rid))
  }

  if (currentRoom && currentBookcase) {
    return (
      <div className="new-bookcase" style={{ paddingBottom: edit ? "none" : "40px"}}>
        <h4>
            <span style={{ color: 'rgb(74, 74, 255)' }}>{location}</span> in {currentRoom.name}</h4>
        {/* <h5>
          Room ID: {currentRoom?.id}, Bookcase ID: {currentBookcase?.id}
        </h5> */}
        <div className="bookcase" style={{ width: `${width}%` }}>
            {renderBookcases()}
        </div>

        <div className="pm">
          <div className="pm-r ed" onClick={() => setEdit(!edit)}>=</div>
          {edit && <div className="pm-r min-room" onClick={removeBookcase}>-</div>}
        </div>
      
       {edit &&
        <form onSubmit={handleSubmit}>
          <label htmlFor="bookcase-loc">Bookcase Location</label>
          <input
            id="bookcase-loc"
            onChange={(e) => setLocation(e.target.value)}
            placeholder="bookcase location"
            value={location}
          />
          <label htmlFor="bookcase-num-sh">Number of Shelves</label>
          <input
              id="bookcase-num-sh"
              onChange={(e) => setShelves(e.target.value)}
              placeholder="number of shelves"
              type='number'
              min={currentBookcase.shelves.length}
              value={shelves}
          />
          <label htmlFor="bookcase-w">Bookcase Width</label>
          <input
            id="bookcase-w"
            onChange={(e) => setWidth(e.target.value)}
            type="range"
            value={width}
          />
          <label htmlFor="shelf-h">Shelf Height</label>
          <input
            id="shelf-h"
            onChange={(e) => setShelfHeight(e.target.value)}
            type="range"
            value={shelfHeight}
          />
          <button>Save</button>
        </form>}
      </div>
    );
  } else return <div>No bookcase selected</div>;
};

export default NewBookcase;


