import { useState, useEffect } from "react";
import { UPDATE_BOOKCASE } from "../context";
import { utilPath } from "../services/utility";

import Bookcases from "../services/BookcaseService"
import Shelves from "../services/ShelfService"

const NewBookcase = ({ dispatch, currentRoom, currentBookcase, navigate, path, shid, bid, bcid, rid }) => {
console.log('rendered??')
  let [location, setLocation] = useState("Bookcase Location");
  let [shelves, setShelves] = useState("");
  let [width, setWidth] = useState(100);
  let [shelfHeight, setShelfHeight] = useState(30)

  useEffect(() => {
    if (currentRoom && currentBookcase) {
      let { location, shelves, width, height } = currentBookcase
      console.log(currentBookcase)
      setLocation(location ? location : "Bookcase Location")
      setShelves(shelves.length)
      setWidth(width ? width : 100)
      setShelfHeight(height ? height : 30)
    }
  }, [currentRoom, currentBookcase, currentBookcase?.location, currentBookcase?.shelves.length, currentBookcase?.bcWidth, currentBookcase?.shHeight])

  const handleSubmit = async e => {
      e.preventDefault()
      /*
      NOTE: 
        Temporary setup. In the future, you can set the initial amount of shelves,
        but afterwards you can only add or remove one at a time. The input field
        for setting a specific number will be disabled. 
      */
      // let newShelves;
      // let cbLength = currentBookcase.shelves.length
      // if (cbLength && cbLength === Number(shelves))
      //     newShelves = currentBookcase.shelves
      // else
      //   newShelves = constructShelves(shelves)
//[...Array(Number(shelves)).keys()]
console.log(bcid, rid, ": here")

    let bkcase = {
      location, 
      width,
      height: shelfHeight
    }

      // if the bookcase has no prior shelves
      if (!currentBookcase.shelves.length && shelves) {
        for (let i = 0; i < shelves; i++) {
          await Shelves.addShelfForBookcase({}, bcid)
        }
      }

      let nBk = await Bookcases.updateBookcaseForRoom(bkcase, bcid)
      console.log(nBk, ": updated bookcase")
  
      // let rm = await Rooms.getRoomsForUser(user)
      // dispatch({ type: SET_ROOMS, payload: rm })
      dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: currentRoom.id, bcId: currentBookcase.id, bc: nBk }})
  }

  // const constructShelves = (amount) => {
  //   let shelves = []
  //   for (let i = 0; i < amount; i++) {
  //     shelves.push(shelfConstruct())
  //   }
  //   return shelves
  // }

  // const shelfConstruct = () => {
  //   return {
  //     shelfId: pretendId(),
  //     books: []
  //   }
  // }

  const renderBookcases = () => {
      let arr = currentBookcase.shelves.length ? currentBookcase.shelves : [...Array(Number(shelves)).keys()]
      // [...Array(Number(sh.books.length)).keys()]
      console.log('rendering again...')
      return arr.map((sh,i) => 
        <p 
          key={i} 
          className="shelf" 
          style={{ height: `${shelfHeight}px`, outline: `${sh.shelfId === shid ? '3px solid black' : 'none'}` }}
          onClick={() => {
            if (!shid || !(shid === sh.shelfId)) 
              navigate(utilPath(path, 'shelf', sh.shelfId))
          }}
        >
          {shid === sh.shelfId && sh.books?.length ? 
          sh.books
            .map((b,i) => 
              <span 
                key={i} 
                onClick={(e) => navigate(utilPath(path, 'book', b.id)) }
                style={{ backgroundColor: bid === b.id ? b.color : 'white' }}
              >
                s
              </span>
            ) : 
            null}
        </p>
      )
  }

  if (currentRoom && currentBookcase) {
    return (
      <div className="new-bookcase">
        <h4>
            <span style={{ color: 'blue' }}>{location}</span> in {currentRoom.name}</h4>
        <h5>
          Room ID: {currentRoom?.id}, Bookcase ID: {currentBookcase?.id}
        </h5>
        <div className="bookcase" style={{ width: `${width}%` }}>
            {renderBookcases()}
        </div>

        <div className="pm-bc" onClick={() => console.log('btn')}>+</div>
        {/* <div className="pm-r min-room" style={rooms.length ? null : { opacity: .2, pointerEvents: 'none' }} onClick={removeARoom}>-</div> */}
       
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setLocation(e.target.value)}
            placeholder="bookcase location"
            value={location}
          />
          {currentBookcase.shelves.length ?
            <input
              onChange={(e) => setShelves(e.target.value)}
              style={{ backgroundColor: "lightgray" }}
              value={shelves}
              readOnly
            />
            :
            <input
              onChange={(e) => setShelves(e.target.value)}
              placeholder="number of shelves"
              type='number'
              min="0"
              value={shelves}
            />
          }
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
        </form>
      </div>
    );
  } else return <div>No bookcase selected</div>;
};

export default NewBookcase;
