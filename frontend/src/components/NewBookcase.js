import { useContext, useState } from "react";
import { Context } from "../context";

const NewBookcase = () => {
  let { rooms, current } = useContext(Context);
  let [location, setLocation] = useState("Bookcase Location");
  let [shelves, setShelves] = useState("");
  let [width, setWidth] = useState(100);

  let currentRoom, currentBookcase;

  if (current && current.rm) {
    currentRoom = rooms[rooms.findIndex((r) => r.id === current.rm)];
    currentBookcase =
      currentRoom.bookcases[
        currentRoom.bookcases.findIndex((r) => r.id === current.bc)
      ];
  }

  const handleSubmit = e => {
      console.log('submit')
  }

  if (currentRoom && currentBookcase) {
    return (
      <div>
        <h4>
            <span style={{ color: 'blue' }}>{location}</span> in {currentRoom.roomName}</h4>
        <h5>
          Room ID: {currentRoom?.id}, Bookcase ID: {currentBookcase?.id}
        </h5>
        <div className="bookcase" style={{ width: `${width}%` }}>
            bookcase here
        </div>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setLocation(e.target.value)}
            placeholder="bookcase location"
            value={location}
          />
          <input
            onChange={(e) => setShelves(e.target.value)}
            placeholder="number of shelves"
            value={shelves}
          />
          <input
            onChange={(e) => setWidth(e.target.value)}
            placeholder="number of shelves"
            type="range"
            value={width}
          />
          <button>Save</button>
        </form>
      </div>
    );
  } else return <div>No bookcase selected</div>;
};

export default NewBookcase;
