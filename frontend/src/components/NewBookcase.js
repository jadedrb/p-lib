import { useState, useEffect } from "react";
import { UPDATE_BOOKCASE } from "../context";

const NewBookcase = ({ current, dispatch, currentRoom, currentBookcase }) => {

  let [location, setLocation] = useState("Bookcase Location");
  let [shelves, setShelves] = useState("");
  let [width, setWidth] = useState(100);
  let [shelfHeight, setShelfHeight] = useState(30)

  useEffect(() => {
    if (current && current.rm) {
      setLocation(currentBookcase.location ? currentBookcase.location : "Bookcase Location")
      setShelves(currentBookcase.shelves.length)
      setWidth(currentBookcase.bcWidth)
      setShelfHeight(currentBookcase.shHeight)
    }
  }, [current, currentBookcase?.location, currentBookcase?.shelves.length, currentBookcase?.bcWidth, currentBookcase?.shHeight])

  const handleSubmit = e => {
      e.preventDefault()
      let newShelves;
      if (currentBookcase.shelves.length) 
        newShelves = shelves
      else
        newShelves = [...Array(Number(shelves)).keys()]

  
      dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: currentRoom.id, bcId: currentBookcase.id, bc: { location, bcWidth: width, shHeight: shelfHeight, shelves: newShelves } }})
  }

  const renderBookcases = () => {
      console.log([...Array(Number(shelves)).keys()])
      let arr = [...Array(Number(shelves)).keys()]
      return arr.map((sh,i) => <p key={i} className="shelf" style={{ height: `${shelfHeight}px` }}></p>)
  }

  if (currentRoom && currentBookcase) {
    return (
      <div className="new-bookcase">
        <h4>
            <span style={{ color: 'blue' }}>{location}</span> in {currentRoom.roomName}</h4>
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
          <input
            onChange={(e) => setShelves(e.target.value)}
            placeholder="number of shelves"
            type='number'
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
        </form>
      </div>
    );
  } else return <div>No bookcase selected</div>;
};

export default NewBookcase;
