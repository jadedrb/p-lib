import { useState, useRef, useEffect } from "react";
import { ADD_ROOM, REMOVE_ROOM, SET_ROOMS, TOGGLE_BKCASE_SELECT, UPDATE_ROOM } from "../context";
import { randomNum, utilMsg, utilPath, rgbToHex } from "../services/utility";

import Rooms from "../services/RoomService";
import Bookcases from "../services/BookcaseService";
import BookService from "../services/BookService";

const NewRoom = ({ rooms, dispatch, bcid, rid, user, reposition, navigate, path, settings, setup }) => {

  let [rIndex, setRIndex] = useState(0);

  let defaultRoom = {
    height: 10,
    width: 10,
    tile: 25,
    name: "New Room",
    bookcases: [],
    perspective: '',
    id: 0,
  };

  let [currentRoom, setCurrentRoom] = useState(
    !rid && rooms[0] ? rooms[0] : defaultRoom
  );

  let [height, setHeight] = useState(currentRoom.height);
  let [width, setWidth] = useState(currentRoom.width);
  let [tile, setTile] = useState(currentRoom.tile);
  let [name, setName] = useState(currentRoom.name);
  let [perspective, setPerspective] = useState(currentRoom.perspective ?? "")

  let [bcStart, setBcStart] = useState("");
  let [bcEnd, setBcEnd] = useState("");

  let [bookcases, setBookcases] = useState(currentRoom.bookcases)

  let [edit, setEdit] = useState(false);

  let mapRef = useRef();
  let wrapper = useRef()
  let afterDeletionRef = useRef();

  const rollRandomBook = async () => {
    let coord = await BookService.getBookCoordinates('random')
    navigate(utilPath(coord, "coord"))
  }

  const respondToRoomLengthChange = () => {
    if (rooms.length) {
      let initialJumpIndex = settings.jump ? settings.jump : 0
      if (rid) {
        let idx = rooms.findIndex(r => r.id == rid)
        if (idx >= 0) {
          roomSetup(idx)
        } else if (!afterDeletionRef.current) {
          /* 
            Handles situations where the typed URL has an id that doesn't correspond to an existing room.
            In that case, default to the first room. The afterDeletionRef is to prevent this from 
            also happening when a room is deleted - it sees the old id as a non-existing room. Without this, 
            it will always switch to the first room after deleting any other room, which is not ideal.
          */
          roomSetup(0)

          // Depends on the "roll" and "jump" settings
          if (!settings.roll || settings.roll === "Dont Roll") {
            navigate(utilPath(path, "room", rooms[initialJumpIndex].id))
          } else {
            rollRandomBook()
          }
        }
      } else {
        roomSetup(0)
        // The timeout is to trick React and prevent the warning about using useNavigate on first render
        // Depends on the "roll" and "jump" settings
        if (!settings.roll || settings.roll === "Dont Roll") {
          setTimeout(() => navigate(utilPath(path, "room", rooms[initialJumpIndex].id)), 1)
        } else {
          setTimeout(() => rollRandomBook(), 1)     
        }
        // navigate(utilPath(path, "room", rooms[0].id))
      }
    } else {
      if (rid && setup)
        setTimeout(() => navigate(utilPath(path, "room", "")), 1)
      initialRoomSetup()
    }
    if (afterDeletionRef.current) 
      afterDeletionRef.current = false
  }

  const respondToRidChange = () => {
    if (rooms.length) {
      let idx = rooms.findIndex(r => r.id == rid)
      if (idx >= 0) {
        roomSetup(idx)
      }
    } 
  }

  wrapper.current = { respondToRoomLengthChange, respondToRidChange }
  
  useEffect(() => {
    wrapper.current.respondToRoomLengthChange()
  }, [rooms, setup])

  useEffect(() => {
    wrapper.current.respondToRidChange()
  }, [rid])

  const switchRoom = (value) => {
    let newIdx = rIndex + value
    if (newIdx < 0 || newIdx > rooms.length - 1)
      return
    roomSetup(newIdx)
    navigate(utilPath(path, "room", rooms[newIdx].id))
  }

  const roomSetup = (idx) => {
    setRIndex(idx)
    setCurrentRoom(rooms[idx])
    setHeight(rooms[idx].height)
    setWidth(rooms[idx].width)
    setTile(rooms[idx].tile)
    setName(rooms[idx].name)
    setBookcases(rooms[idx].bookcases)
    setPerspective(rooms[idx].perspective ?? "")
    setBcStart('')
    setBcEnd('')
  }

  const initialRoomSetup = () => {
    setRIndex(0)
    setCurrentRoom(defaultRoom)
    setHeight(defaultRoom.height)
    setWidth(defaultRoom.width)
    setTile(defaultRoom.tile)
    setName(defaultRoom.name)
    setBookcases(defaultRoom.bookcases)
    setPerspective(defaultRoom.perspective)
    setBcStart('')
    setBcEnd('')
  }

  useEffect(() => {
   
    let map = mapRef.current;

    if (!map) return

    map.innerHTML = "";
    map.style.gridTemplateColumns = `repeat(${width}, ${tile}px)`;
    map.style.gridTemplateRows = `repeat(${height}, ${tile}px)`;
    
    for (let r = 1; r <= height; r++) {
      for (let c = 1; c <= width; c++) {
        let div = document.createElement("div");
        div.classList.add('box')
        div.classList.add(`r-${r}-c-${c}`)

        if (
          (bcStart[0] === r && bcStart[1] === c) ||
          (bcEnd[0] === r && bcEnd[1] === c)
        ) {
          div.style.backgroundColor = "blue";
        }
       
        let currentBookcase;

        let tiles = bookcases.length
          ? bookcases.some((b) => {
              let result =
                r >= b.row_low &&
                r <= b.row_high &&
                c >= b.col_low &&
                c <= b.col_high;
              if (result) currentBookcase = b;
              return result;
            })
          : false;

        if (tiles) {
          div.style.backgroundColor = currentBookcase.color;

        if (currentBookcase.location) {
          div.classList.add('bookcase-tag')
          div.setAttribute('data-bk-tag', currentBookcase.location)
        }

          if (currentBookcase.id == bcid) {
            if (reposition.toggle) {
              div.style.opacity = ".3"
              div.style.outline = "3px solid white"
            } else {
              div.style.outline = "3px solid black";
            }
          } else {
            if (bcid && !reposition.toggle && currentBookcase.id) {
              div.style.opacity = ".3"
            }
          }
        }

        map.appendChild(div);
      }
    }
  
  }, [height, width, tile, bcStart, bcEnd, bookcases, bcid, reposition]);

  const handleBoxClick = async (e) => {
    if (e.target.className[0] !== "b") return;
    let [row, column] = e.target.className
      .split(" ")[1]
      .split("-")
      .filter((c) => c !== "r" && c !== "c");

    row = Number(row);
    column = Number(column);

    let currentBookcase;

    let overlap = bookcases.some((b) => {
      let result =
        row >= b.row_low &&
        row <= b.row_high &&
        column >= b.col_low &&
        column <= b.col_high;
      if (result) currentBookcase = b;
      return result;
    });

    if (overlap) {
      setBcStart("");
      setBcEnd("");
      if (currentBookcase.id && !reposition.toggle)
        navigate(utilPath(path, "bookcase", currentBookcase.id));
      return;
    }

    if (!edit && !reposition.toggle) return
    // 1ST click when repositioning a bookcase (creates the first blue box)
    if (!bcStart) {
      setBcStart([row, column]);

      if (reposition.toggle) {
        setBookcases(bookcases.filter(bk => bk.reposition !== true));
        dispatch({
          type: TOGGLE_BKCASE_SELECT,
          payload: { toggle: true }
        })
      }
    // 2ND click when repositioning a bookcase (creates the second blue box)
    } else if (bcStart && !bcEnd) {
      setBcEnd([row, column]);
    // 3RD click when repositioning a bookcase (turns the in-between boxes to blue to fill in space)
    } else {
      let newBc = {
        row_low: Math.min(bcStart[0], bcEnd[0]),
        col_low: Math.min(bcStart[1], bcEnd[1]),
        row_high: Math.max(bcStart[0], bcEnd[0]),
        col_high: Math.max(bcStart[1], bcEnd[1]),
        color: reposition.toggle ? "#2e2af8" : rgbToHex(randomNum(), randomNum(), randomNum()),
        location: "",
        width: 100,
        height: 30,
      };

      if (reposition.toggle) {
        newBc.reposition = true
        dispatch({
          type: TOGGLE_BKCASE_SELECT,
          payload: { toggle: true, newBc }
        })
      }

      setBookcases([...bookcases, newBc]);

      setBcStart("");
      setBcEnd("");
    }
  };

  useEffect(() => {
    if (!reposition.toggle) {
      setBcStart("");
      setBcEnd("");
      setBookcases(bk => bk.filter(bk => bk.reposition !== true));
    } else {
      if (edit) {
        setEdit(false)
      }
    }
  }, [reposition, edit])

  const roomConstruct = (h, w, rn, ti, bc, per) => {
    return {
      height: h ? h : height,
      width: w ? w : width,
      name: rn ? rn : name,
      tile: ti ? ti : tile,
      bookcases: bc ? bc : bookcases,
      perspective: per === 'null' ? null : perspective
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let room = roomConstruct();
    setEdit(false)

    if (rid) {
      // comeback to this later...
      delete room.bookcases
      let payload = await Rooms.updateRoomOfId(room, rid);
      dispatch({ type: UPDATE_ROOM, payload: { rid, rm: payload } });
    } else {
      let payload = await Rooms.addRoomForUser(room);
      navigate(utilPath(path, "room", payload.id));
      dispatch({ type: ADD_ROOM, payload });
      room = payload.id;
    }
    let bkcasesAdded = bookcases.filter(bk => !bk.hasOwnProperty("id")).map(bk => ({ ...bk, room_id: rid }))
    if (bkcasesAdded.length) {
        const newBookcases = await Bookcases.addBookcaseForRoom(bkcasesAdded);
        room.bookcases = newBookcases
        dispatch({ type: UPDATE_ROOM, payload: { rid, rm: room } });
    }
  };

  const newBlankRoom = async () => {
    let rm = roomConstruct(10, 10, "New Room", 25, [], 'null');
   
    let payload = await Rooms.addRoomForUser(rm);
    navigate(utilPath(path, "room", payload.id));
    dispatch({ type: ADD_ROOM, payload })
  };

  const removeARoom = async () => {
    let confirm = window.confirm(utilMsg({ type: 'room', details: { room: currentRoom } }))
    if (!confirm) return
    await Rooms.removeRoomFromUser(rid);
    dispatch({ type: REMOVE_ROOM, payload: rid });
    afterDeletionRef.current = true
    if (rIndex)
      switchRoom(-1)
    else {
      let simulateRooms = rooms.filter(r => r.id !== Number(rid))
      if (simulateRooms.length) {
        navigate(utilPath(path, "room", simulateRooms[0].id))
      } else {
        navigate(utilPath(path, "room", ""))
      }
    }
  };

  return (
    <div className="newroom">
     
        <figure>
          <span>{name}</span> ({rIndex + 1})
          {perspective && <figcaption>({perspective})</figcaption>}
        </figure> 
 
      <div className="pm">
        <div className="pm-r ed" onClick={() => { 
          if (bcStart) setBcStart("");
          if (bcEnd) setBcEnd("");
          if (!reposition.toggle && settings.temp !== "Read Only") {
            setEdit(!edit)
          }
        }}>
          =
        </div>
        { edit &&
        <>
          <div className="pm-r pl-room" onClick={newBlankRoom}>
            +
          </div>
          <div
            className="pm-r min-room"
            style={rooms.length ? null : { opacity: 0.2, pointerEvents: "none" }}
            onClick={removeARoom}
          >
            -
          </div>
        </>}
      </div>
      <div className="room-sec">
        {/* <div className="room-map-wrap"> */}
          <div className="room-map" ref={mapRef} onClick={handleBoxClick}></div>
        {/* </div> */}
      </div>

      <div className="arrows">
      <div
          className={`arrw ${rIndex <= 0 ? "hde" : ""}`}
          id="lft"
          onClick={() => switchRoom(-1)}
        >
          <span>{"<"}</span>
        </div>
        <div
          className={`arrw ${
            !rooms.length || rIndex + 1 === rooms.length ? "hde" : ""
          }`}
          id="rit"
          onClick={() => switchRoom(1)}
        >
          <span>{">"}</span>
        </div>
      </div>

      {edit &&
      <div className="nr-ff">
        <form onSubmit={handleSubmit}>
          <label htmlFor="height">Height</label>
          <input
            id="height"
            onChange={(e) => setHeight(e.target.value)}
            placeholder="height"
            type="number"
            value={height}
          />
          <label htmlFor="width">Width</label>
          <input
            id="width"
            onChange={(e) => setWidth(e.target.value)}
            placeholder="width"
            type="number"
            value={width}
          />
          <label htmlFor="tiles">Tile Size</label>
          <input
            id="tiles"
            onChange={(e) => setTile(e.target.value)}
            placeholder="tile size"
            type="number"
            value={tile}
          />
          <label htmlFor="rname">Room Name</label>
          <input
            id="rname"
            onChange={(e) => setName(e.target.value)}
            placeholder="room name"
            value={name}
          />
          <label htmlFor="per">Perspective</label>
          <input
            id="per"
            onChange={(e) => setPerspective(e.target.value)}
            placeholder="ex: facing the window"
            value={perspective}
          />
          <button>Save</button>
        </form>
      </div>}
    </div>
  );
};

export default NewRoom;