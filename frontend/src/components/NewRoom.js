import { useState, useRef, useEffect, useContext } from "react";
import { Context } from '../context'

const NewRoom = () => {

  const { rooms, addRoom, updateRoom } = useContext(Context)

  const defaultRoom = { height: 10, width: 10, tile: 25, roomName: "New Room", bookcases: [] }
  const currentRoom = rooms.length ? rooms[0] : defaultRoom

  let [rIndex, setRIndex] = useState(0)

  let [height, setHeight] = useState(currentRoom.height);
  let [width, setWidth] = useState(currentRoom.width);
  let [tile, setTile] = useState(currentRoom.tile);
  let [roomName, setRoomName] = useState(currentRoom.roomName);

  let [bcStart, setBcStart] = useState("");
  let [bcEnd, setBcEnd] = useState("");

  let [bookcases, setBookcases] = useState(currentRoom.bookcases)

  let mapRef = useRef();



  useEffect(() => {
    let map = mapRef.current;
    map.innerHTML = "";
    map.style.gridTemplateColumns = `repeat(${width}, ${tile}px)`;
    map.style.gridTemplateRows = `repeat(${height}, ${tile}px)`;

    for (let r = 1; r <= height; r++) {
      for (let c = 1; c <= width; c++) {
        let div = document.createElement("div");
        div.setAttribute("class", `box r-${r}-c-${c}`);

        if (
          (bcStart[0] === r && bcStart[1] === c) ||
          (bcEnd[0] === r && bcEnd[1] === c)
        ) {
          console.log("OK");
          div.style.backgroundColor = "blue";
        }

        let currentBookcase;

        let tiles = bookcases.length ? bookcases.some(b => {
            let result = (r >= b.rowLow && r <= b.rowHigh) && (c >= b.colLow && c <= b.colHigh)
            if (result) currentBookcase = b
            return result
        }) : false

        if (tiles) {
            console.log(currentBookcase.color)
            div.style.backgroundColor = currentBookcase.color
        }

        map.appendChild(div);
      }
    }
  }, [height, width, tile, bcStart, bcEnd, bookcases]);

  const randomNum = () => Math.floor(Math.random() * 255)

  const handleBoxClick = (e) => {
    if (e.target.className[0] !== "b") return
    let [row, column] = e.target.className
      .split(" ")[1]
      .split("-")
      .filter((c) => c !== "r" && c !== "c");

    row = Number(row)
    column = Number(column)

    let currentBookcase;

    let overlap = bookcases.some(b => {
      let result = (row >= b.rowLow && row <= b.rowHigh) && (column >= b.colLow && column <= b.colHigh)
      if (result) currentBookcase = b
      return result
    })

    if (overlap) {
      console.log("clicked on: " + currentBookcase.id)
      setBcStart('')
      setBcEnd('')
      return 
    }

    if (!bcStart) {
      setBcStart([row, column])
    } else if (bcStart && !bcEnd) {
      setBcEnd([row, column])
    } else {

        let newBc = {
            rowLow: Math.min(bcStart[0], bcEnd[0]),
            colLow: Math.min(bcStart[1], bcEnd[1]),
            rowHigh: Math.max(bcStart[0], bcEnd[0]),
            colHigh: Math.max(bcStart[1], bcEnd[1]),
            color: `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`,
            id: randomNum() + randomNum() + randomNum()
        }
        setBookcases([...bookcases, newBc])

      setBcStart("");
      setBcEnd("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    let room = {
      height,
      width,
      roomName,
      tile,
      bookcases
    }

    if (currentRoom.id) {
      room.id = currentRoom.id
      updateRoom(room)
    }
    else {
      room.id = randomNum() + randomNum() + randomNum()
      addRoom(room)
    }
  }

  const switchRoom = (prevOrNex) => {
    let newIndex = rIndex + prevOrNex
    if (newIndex < 0 || newIndex > rooms.length - 1) return

    let newRoom = rooms[newIndex]

    setRIndex(rIndex + prevOrNex)
    setHeight(newRoom.height)
    setWidth(newRoom.width)
    setTile(newRoom.tile)
    setBookcases(newRoom.bookcases)
  }
console.log(rooms)
  return (
    <div className="newroom">
      <h3>{roomName}</h3>
      <div className="pm-r pl-room">+</div>
      <div className="pm-r min-room">-</div>
      <div className="room-sec">
        <div className={`arrw ${!rIndex ? 'hde' : ''}`} id="lft" onClick={() => switchRoom(-1)}>
          <span>{'<'}</span>
        </div>
        <div className="room-map" ref={mapRef} onClick={handleBoxClick}></div>
        <div className={`arrw ${!rooms.length || rIndex + 1 === rooms.length ? 'hde' : ''}`} id="rit" onClick={() => switchRoom(1)}>
          <span>{'>'}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setHeight(e.target.value)}
          placeholder="height"
          value={height}
        />
        <input
          onChange={(e) => setWidth(e.target.value)}
          placeholder="width"
          value={width}
        />
        <input
          onChange={(e) => setTile(e.target.value)}
          placeholder="tile size"
          value={tile}
        />
        <input
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="room name"
          value={roomName}
        />
        <button>Save</button>
      </form>
    </div>
  );
};

export default NewRoom;
