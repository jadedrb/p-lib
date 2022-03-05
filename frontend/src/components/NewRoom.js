import { useState, useRef, useEffect } from "react";
import { ADD_ROOM, REMOVE_ROOM, UPDATE_ROOM } from '../context'
import { useNavigate, useLocation } from "react-router-dom";
import { pretendId, randomNum, utilPath } from "../services/utility";

import { test0, test1 } from "../services/tests";

import Rooms from "../services/RoomService"

const NewRoom = ({ rooms, dispatch, bcid, rid, user }) => {

  let [rIndex, setRIndex] = useState(0)
// rid ? rooms.findIndex(r => r.id === rid) : 
  let [currentRoom, setCurrentRoom] = useState({ height: 10, width: 10, tile: 25, name: "New Room", bookcases: [], id: 0 })

  let [height, setHeight] = useState(currentRoom.height);
  let [width, setWidth] = useState(currentRoom.width);
  let [tile, setTile] = useState(currentRoom.tile);
  let [name, setName] = useState(currentRoom.name);

  let [bcStart, setBcStart] = useState("");
  let [bcEnd, setBcEnd] = useState("");

  let [bookcases, setBookcases] = useState(currentRoom.bookcases)

  let mapRef = useRef();
  let mount = useRef()
  let navAndSwitch = useRef()

  let navigate = useNavigate()
  let path = useLocation()
  let pathname = path.pathname

  const handlePathAndSwitchRoom = () => {
    // mount keeps track of the index of the current room between renders
    // it will either be undefined (unmounted) or a number (mounted)
    if (typeof mount.current === 'number') {
      if (mount.current !== rIndex) {
        mount.current = rIndex
        navigate(`${pathname.slice(0, 6) + rooms[rIndex].id}`)
        console.log('ye1')
      } else {
        switchRoom(0, rooms)
        navigate(currentRoom.id ? `${pathname.slice(0, 6) + currentRoom.id}` : `${pathname.slice(0, 6)}`)
        console.log('ye2')
      }
    } else {
      // on mount
      let rm = switchRoom(0, rooms)
      mount.current = rIndex
      console.log(rid, currentRoom, currentRoom.id ? `${rid ? pathname + rid : pathname + currentRoom.id}` : `${pathname}`)
      // rm.id ? `${rid ? pathname + rid : pathname + rm.id}` : `${pathname}`
      navigate(utilPath(path, 'room', rid ? rid : rm.id))
      console.log('ye3')
    }
  }

  const handlePathBackToRoom = () => navigate('/room/')

  // adding these functions to a ref to avoid warnings about missing dependencies inside useEffect
  navAndSwitch.current = { handlePathAndSwitchRoom, handlePathBackToRoom }

  useEffect(() => { 
    console.log('ye')
      navAndSwitch.current.handlePathAndSwitchRoom()
  }, [rIndex])

  useEffect(() => {
    return () => {
      navAndSwitch.current.handlePathBackToRoom()
    }
  }, [])

  useEffect(() => {
    // const defaultRoom = { height: 10, width: 10, tile: 25, name: "New Room", bookcases: [] }
    if (typeof mount.current === 'number') {
      console.log(rooms, rid)
      if (rid) {
        console.log(rid)
        let indx = rooms.findIndex(r => r?.id === rid)
        const cr = rooms.length && rooms[indx] ? rooms[indx] : currentRoom
        console.log(cr, rooms.length, rooms[indx])
        if (indx > 0)
          setRIndex(indx)

        setCurrentRoom(cr)
        setHeight(cr.height)
        setWidth(cr.width)
        setTile(cr.tile)
        setName(cr.name)
        setBookcases(cr.bookcases)
      }
    }
  }, [rooms, rid])

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
            div.style.backgroundColor = currentBookcase.color
            if (currentBookcase.id === bcid) {
              div.style.outline = '3px solid black'
            }
        }

        map.appendChild(div);
      }
    }
  }, [height, width, tile, bcStart, bcEnd, bookcases, bcid]);

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
      navigate(utilPath(path, 'bookcase', currentBookcase.id))
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
            id: pretendId(),
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
      name: rn ? rn : name,
      tile: ti ? ti : tile,
      bookcases: bc ? bc : bookcases,
    }
  }

  function switchRoom (prevOrNex, currentRooms) {
    let newIndex = rIndex + prevOrNex
    if (!prevOrNex) newIndex = currentRooms.length - 1

    if (currentRooms.length) {
      if (newIndex < 0 || newIndex > currentRooms.length - 1) return
    }
    
    let newRoom = currentRooms[newIndex]

    // If we deleted the last saved room
    if (newIndex < 0) {
      newRoom = roomConstruct(10, 10, "New Room", 25, [])
      newRoom.id = pretendId()
      // console.log('last deleted: ', newRoom)
      newIndex = 0
      // console.log('do we reach here')
      navigate(`/room/`)
    }
console.log(newRoom)
    setBcEnd("")
    setBcStart("")
    setRIndex(newIndex)
    setHeight(newRoom.height)
    setWidth(newRoom.width)
    setTile(newRoom.tile)
    setName(newRoom.name)
    setBookcases(newRoom.bookcases)
    return newRoom
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let room = roomConstruct()

    if (currentRoom.id) {
      room.id = currentRoom.id
      let payload = await Rooms.updateRoomOfIdForUser(room, currentRoom.id, user)
      dispatch({ type: UPDATE_ROOM, payload })
    }
    else {
      let payload = await Rooms.addRoomForUser(room, user)
      navigate(`${pathname.slice(0, 6) + payload.id}`)
      dispatch({ type: ADD_ROOM, payload })
    }
  }

  const newBlankRoom = async () => {
    let rm = roomConstruct(10, 10, "New Room", 25, [])
    let payload = await Rooms.addRoomForUser(rm, user)
    console.log(`${pathname.slice(0, 6) + payload.id}`)
    console.log(payload)
    navigate(`${pathname.slice(0, 6) + payload.id}`)
    // room.id = pretendId()
    dispatch({ type: ADD_ROOM, payload })
  }

  const removeARoom = async () => {
    let room = roomConstruct()
    room.id = currentRoom.id
    dispatch({ type: REMOVE_ROOM, payload: { room } })
  }


  return (
    <div className="newroom">
      <h3>{name} ({rIndex})</h3>
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
          onChange={(e) => setName(e.target.value)}
          placeholder="room name"
          value={name}
        />
        <button>Save</button>
      </form>

{/* For test purposes... */}
      <button onClick={test0}>
        TEST EVERYTHING!
      </button>
      <button onClick={test1}>
        TEST Search
      </button>
    </div>
  );
};

export default NewRoom;
