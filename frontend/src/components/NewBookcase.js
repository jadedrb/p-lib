import { useState, useEffect } from "react";
import { UPDATE_BOOKCASE } from "../context";

const NewBookcase = ({ dispatch, currentRoom, currentBookcase, navigate, path }) => {

  let [location, setLocation] = useState("Bookcase Location");
  let [shelves, setShelves] = useState("");
  let [width, setWidth] = useState(100);
  let [shelfHeight, setShelfHeight] = useState(30)

  useEffect(() => {
    if (currentRoom && currentBookcase) {
      setLocation(currentBookcase.location ? currentBookcase.location : "Bookcase Location")
      setShelves(currentBookcase.shelves.length)
      setWidth(currentBookcase.bcWidth)
      setShelfHeight(currentBookcase.shHeight)
    }
  }, [currentRoom, currentBookcase, currentBookcase?.location, currentBookcase?.shelves.length, currentBookcase?.bcWidth, currentBookcase?.shHeight])

  const handleSubmit = e => {
      e.preventDefault()
      /*
      NOTE: 
        Temporary setup. In the future, you can set the initial amount of shelves,
        but afterwards you can only add or remove one at a time. The input field
        for setting a specific number will be disabled. 
      */
      let newShelves;
      let cbLength = currentBookcase.shelves.length
      if (cbLength && cbLength === Number(shelves))
          newShelves = currentBookcase.shelves
      else
        newShelves = constructShelves(shelves)
//[...Array(Number(shelves)).keys()]
  console.log(newShelves, shelves)
      dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: currentRoom.id, bcId: currentBookcase.id, bc: { location, bcWidth: width, shHeight: shelfHeight, shelves: newShelves } }})
  }

  const randomNum = () => Math.floor(Math.random() * 255)

  const constructShelves = (amount) => {
    let shelves = []
    for (let i = 0; i < amount; i++) {
      shelves.push(shelfConstruct())
    }
    return shelves
  }

  const shelfConstruct = () => {
    return {
      shelfId: randomNum() + randomNum() + randomNum(),
      books: []
    }
  }

  const navToShelf = (id) => {
    // console.log(path)
    // console.log(path.pathname + '/shelf/' + id)
    // console.log(path.pathname.split("/").slice(0, 5).join("/"))
    navigate(path.pathname.split("/").slice(0, 5).join("/") + '/shelf/' + id)
  }

  const renderBookcases = () => {
      let arr = currentBookcase.shelves.length ? currentBookcase.shelves : [...Array(Number(shelves)).keys()]
      return arr.map((sh,i) => 
        <p 
          key={i} 
          className="shelf" 
          style={{ height: `${shelfHeight}px` }}
          onClick={() => navToShelf(sh.shelfId)}
        >
        </p>
      )
  }

console.log(shelves)

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
