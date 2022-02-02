import { useState, useRef, useEffect } from "react";
import { ADD_ROOM, REMOVE_ROOM, SET_CURRENT, UPDATE_ROOM } from '../context'
import { useNavigate, useLocation } from "react-router-dom";

const NewRoom = ({ rooms, dispatch }) => {

  const defaultRoom = { height: 10, width: 10, tile: 25, roomName: "New Room", bookcases: [] }

  let [rIndex, setRIndex] = useState(0)

  const currentRoom = rooms.length && rooms[rIndex] ? rooms[rIndex] : defaultRoom

  let [height, setHeight] = useState(currentRoom.height);
  let [width, setWidth] = useState(currentRoom.width);
  let [tile, setTile] = useState(currentRoom.tile);
  let [roomName, setRoomName] = useState(currentRoom.roomName);

  let [bcStart, setBcStart] = useState("");
  let [bcEnd, setBcEnd] = useState("");

  let [bookcases, setBookcases] = useState(currentRoom.bookcases)

  let mapRef = useRef();
  let mount = useRef()

  let navigate = useNavigate()
  let { pathname } = useLocation()

  useEffect(() => { 
    // mount keeps track of the index of the current room between renders
    // it will either be undefined (unmounted) or a number (mounted)
    if (typeof mount.current === 'number') {
      if (mount.current !== rIndex) {
        mount.current = rIndex
        navigate(`${pathname.slice(0, 6) + currentRoom.id}`)
      } else {
        switchRoom(0, rooms)
        navigate(currentRoom.id ? `${pathname.slice(0, 6) + currentRoom.id}` : `${pathname.slice(0, 6)}`)
      }
    } else {
      // on mount
      switchRoom(0, rooms)
      mount.current = rIndex
      navigate(currentRoom.id ? `${pathname + currentRoom.id}` : `${pathname}`)
    }
  }, [rooms.length, rIndex])

  useEffect(() => {
    return () => {
      navigate('/room/')
    }
  }, [])

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
      dispatch({ type: SET_CURRENT, payload: { rm: currentRoom.id, bc: currentBookcase.id }})
      //setCurrent({ rm: currentRoom.id, bc: currentBookcase.id })
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
            id: randomNum() + randomNum() + randomNum(),
            location: '',
            bcWidth: 100,
            shHeight: 30,
            shelves: []
        }
        setBookcases([...bookcases, newBc])

      setBcStart("");
      setBcEnd("");
    }
  };

  const roomConstruct = (h, w, rn, ti, bc) => {
    return {
      height: h ? h : height,
      width: w ? w : width,
      roomName: rn ? rn : roomName,
      tile: ti ? ti : tile,
      bookcases: bc ? bc : bookcases,
    }
  }

  function switchRoom (prevOrNex, currentRooms) {
    let newIndex = rIndex + prevOrNex
    if (!prevOrNex) newIndex = currentRooms.length - 1
    console.log(newIndex, currentRooms.length)

    if (currentRooms.length) {
      if (newIndex < 0 || newIndex > currentRooms.length - 1) return
    }
    
    let newRoom = currentRooms[newIndex]

    // If we deleted the last saved room
    if (newIndex < 0) {
      newRoom = roomConstruct(10, 10, "New Room", 25, [])
      newRoom.id = randomNum() + randomNum() + randomNum()
      console.log('last deleted: ', newRoom)
      newIndex = 0
      navigate(`/room/`)
    }

    setBcEnd("")
    setBcStart("")
    setRIndex(newIndex)
    setHeight(newRoom.height)
    setWidth(newRoom.width)
    setTile(newRoom.tile)
    setRoomName(newRoom.roomName)
    setBookcases(newRoom.bookcases)

   // navigate(`${pathname + newRoom.id}`)
    // setCurrent({ rm: null, bc: null })
    dispatch({ type: SET_CURRENT, payload: { rm: null, bc: null }})

  }

  function handleSubmit (e) {
    e.preventDefault()

    let room = roomConstruct()

    if (currentRoom.id) {
      room.id = currentRoom.id
      dispatch({ type: UPDATE_ROOM, payload: room })
    }
    else {
      room.id = randomNum() + randomNum() + randomNum()
      navigate(`${pathname.slice(0, 6) + room.id}`)
      dispatch({ type: ADD_ROOM, payload: { room } })
    }
  }

  const newBlankRoom = () => {
    alert('newblank')
    let room = roomConstruct(10, 10, "New Room", 25, [])
    room.id = randomNum() + randomNum() + randomNum()
    dispatch({ type: ADD_ROOM, payload: { room } })
  }

  const removeARoom = () => {
    let room = roomConstruct()
    room.id = currentRoom.id
    dispatch({ type: REMOVE_ROOM, payload: { room } })
  }


  return (
    <div className="newroom">
      <h3>{roomName} ({rIndex})</h3>
      <div className="pm-r pl-room" onClick={newBlankRoom}>+</div>
      <div className="pm-r min-room" style={rooms.length ? null : { opacity: .2, pointerEvents: 'none' }} onClick={removeARoom}>-</div>
      <div className="room-sec">
        <div className={`arrw ${!rIndex ? 'hde' : ''}`} id="lft" onClick={() => switchRoom(-1, rooms)}>
          <span>{'<'}</span>
        </div>
        <div className="room-map" ref={mapRef} onClick={handleBoxClick}></div>
        <div className={`arrw ${!rooms.length || rIndex + 1 === rooms.length ? 'hde' : ''}`} id="rit" onClick={() => switchRoom(1, rooms)}>
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
