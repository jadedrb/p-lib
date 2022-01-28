import { useContext, useState } from "react";
import { Context, UPDATE_BOOKCASE } from "../context";

const NewBookcase = () => {
  let { rooms, current, dispatch } = useContext(Context);

  let currentRoom, currentBookcase;

  if (current && current.rm) {
    currentRoom = rooms[rooms.findIndex((r) => r.id === current.rm)];
    currentBookcase =
      currentRoom.bookcases[
        currentRoom.bookcases.findIndex((r) => r.id === current.bc)
      ];
  }

  let [location, setLocation] = useState(currentBookcase?.location ? currentBookcase.location : "Bookcase Location");
  let [shelves, setShelves] = useState(currentBookcase?.shelves?.length ? currentBookcase.shelves.length : "");
  let [width, setWidth] = useState(currentBookcase?.bcWidth ? currentBookcase.bcWidth : 100);
  let [shelfHeight, setShelfHeight] = useState(currentBookcase?.shHeight ? currentBookcase.shHeight : 30)

  const handleSubmit = e => {
      e.preventDefault()
      alert('updating bookcase')
      dispatch({ type: UPDATE_BOOKCASE, payload: { rmId: currentRoom.id, bcId: currentBookcase.id, bc: { location, bcWidth: width, shHeight: shelfHeight } }})
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
