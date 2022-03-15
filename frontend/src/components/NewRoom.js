import { useState, useRef, useEffect } from "react";
import { ADD_ROOM, REMOVE_ROOM, SET_ROOMS, TOGGLE_BKCASE_SELECT, UPDATE_ROOM } from "../context";
import { randomNum, utilMsg, utilPath,rgbToHex } from "../services/utility";

// import { test0, test1 } from "../services/tests";

import Rooms from "../services/RoomService";
import Bookcases from "../services/BookcaseService";

const NewRoom = ({ rooms, dispatch, bcid, rid, user, reposition, navigate, path }) => {
  let [rIndex, setRIndex] = useState(0);
  // rid ? rooms.findIndex(r => r.id === rid) :
  let defaultRoom = {
    height: 10,
    width: 10,
    tile: 25,
    name: "New Room",
    bookcases: [],
    id: 0,
  };
  let [currentRoom, setCurrentRoom] = useState(
    !rid && rooms[0] ? rooms[0] : defaultRoom
  );

  let [height, setHeight] = useState(currentRoom.height);
  let [width, setWidth] = useState(currentRoom.width);
  let [tile, setTile] = useState(currentRoom.tile);
  let [name, setName] = useState(currentRoom.name);

  let [bcStart, setBcStart] = useState("");
  let [bcEnd, setBcEnd] = useState("");

  let [bookcases, setBookcases] = useState(currentRoom.bookcases)

  let [edit, setEdit] = useState(false);

  let mapRef = useRef();
  let mount = useRef();
  let waitForSwitch = useRef();
  let navAndSwitch = useRef();

  // let navigate = useNavigate();
  // let path = useLocation();
  let pathname = path.pathname;

  const handlePathAndSwitchRoom = () => {
    // mount keeps track of the index of the current room between renders
    // it will either be undefined (unmounted) or a number (mounted)
    //if (!user) return
    if (typeof mount.current === "number") {
      console.log("handlePathAndSwitchRoom");
      if (mount.current !== rIndex) {
        // if the index has changed (current here stores former index)
        mount.current = rIndex;
        if (rooms[rIndex]) {
          if (rooms[rIndex].id !== rid) {
            // only navigate if the room id changed
            navigate(utilPath(path, "room", rooms[rIndex].id));
          }
        }
      } else {
        switchRoom(0, rooms);
        navigate(
          currentRoom.id
            ? utilPath(path, "room", currentRoom.id)
            : `${pathname.slice(0, 6)}`
        );
        //console.log('ye2')
      }
    } else {
      // on mount
      //  let rm = switchRoom(0, rooms)
      mount.current = rIndex;
      if (!bcid)
        navigate(
          utilPath(path, "room", rid ? rid : rooms[0]?.id ? rooms[0].id : "")
        );
    }
  };

  const handleCurrentRoomSetup = () => {
    // if (!user) return
    if (typeof mount.current === "number") {
      //  console.log(rooms, rid)
      if (rid) {
           console.log(rid)
        let indx = rooms.findIndex((r) => r?.id === rid);
        const cr = rooms.length && rooms[indx] ? rooms[indx] : currentRoom;
        // console.log(cr, rooms.length, rooms[indx])

        // if user enters an invalid room id in url
        if (!rooms[indx]) {
          if (rooms.length) navigate(utilPath(path, "room", rooms[0].id));
          return;
        }
        
        setRIndex(indx);
        setCurrentRoom(cr);
        setHeight(cr.height);
        setWidth(cr.width);
        setTile(cr.tile);
        setName(cr.name);
        setBookcases(cr.bookcases);
      }
    }
  };

  const handleSwitchAfterAddOrRemove = () => {
    // if (!user) return
    if (waitForSwitch.current === "add") {
      waitForSwitch.current = false;
      switchRoom(rooms.length - 1 - rIndex, rooms);
    } else if (waitForSwitch.current === "remove") {
      waitForSwitch.current = false;
      switchRoom(-1, rooms);
    }
  };

  // const handlePathBackToRoom = () => navigate("/room/");

  // adding these functions to a ref to avoid warnings about missing dependencies inside useEffect
  navAndSwitch.current = {
    handlePathAndSwitchRoom,
    // handlePathBackToRoom,
    handleCurrentRoomSetup,
    handleSwitchAfterAddOrRemove,
  };

  useEffect(() => {
    console.log("useEffect: rIndex", rIndex);
    console.log('ye')
    navAndSwitch.current.handlePathAndSwitchRoom();
  }, [rIndex]);

  // useEffect(() => {
  //   return () => {
  //     // navAndSwitch.current.handlePathBackToRoom();
  //   };
  // }, []);

  useEffect(() => {
    // const defaultRoom = { height: 10, width: 10, tile: 25, name: "New Room", bookcases: [] }
    navAndSwitch.current.handleCurrentRoomSetup();

    // waits for rooms to update before switching to newest room
    // if a new room was added recently... or removed
    navAndSwitch.current.handleSwitchAfterAddOrRemove();
  }, [rooms, rid]);

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

        let tiles = bookcases.length
          ? bookcases.some((b) => {
              let result =
                r >= b.rowLow &&
                r <= b.rowHigh &&
                c >= b.colLow &&
                c <= b.colHigh;
              if (result) currentBookcase = b;
              return result;
            })
          : false;

        if (tiles) {
          div.style.backgroundColor = currentBookcase.color;
          if (currentBookcase.id === bcid) {
            if (reposition.toggle) {
              div.style.opacity = ".5"
              div.style.outline = "3px solid white"
            } else {
              div.style.outline = "3px solid black";
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
        row >= b.rowLow &&
        row <= b.rowHigh &&
        column >= b.colLow &&
        column <= b.colHigh;
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
    console.log('got here at least')
    console.log(reposition)
    if (!edit && !reposition.toggle) return
    if (!bcStart) {
      setBcStart([row, column]);

      if (reposition.toggle) {
        setBookcases(bookcases.filter(bk => bk.reposition !== true));
        dispatch({
          type: TOGGLE_BKCASE_SELECT,
          payload: { toggle: true }
        })
      }

    } else if (bcStart && !bcEnd) {
      setBcEnd([row, column]);
    } else {
      let newBc = {
        rowLow: Math.min(bcStart[0], bcEnd[0]),
        colLow: Math.min(bcStart[1], bcEnd[1]),
        rowHigh: Math.max(bcStart[0], bcEnd[0]),
        colHigh: Math.max(bcStart[1], bcEnd[1]),
        color: reposition.toggle ? "blue" : rgbToHex(randomNum(), randomNum(), randomNum()),
        location: "",
        bcWidth: 100,
        shHeight: 30,
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

  const roomConstruct = (h, w, rn, ti, bc) => {
    return {
      height: h ? h : height,
      width: w ? w : width,
      name: rn ? rn : name,
      tile: ti ? ti : tile,
      bookcases: bc ? bc : bookcases,
    };
  };

  function switchRoom(prevOrNex, currentRooms) {
    let newIndex = rIndex + prevOrNex;
    if (!prevOrNex) newIndex = currentRooms.length - 1;

    if (currentRooms.length) {
      if (newIndex < 0 || newIndex > currentRooms.length - 1) return;
    }

    let newRoom = currentRooms[newIndex];
    // If we deleted the last saved room
    if (newIndex < 0) {
      //  console.log('in')
      newRoom = roomConstruct(10, 10, "New Room", 25, []);
      newIndex = 0;
      navigate(`/room/`);
    }

    setBcEnd("");
    setBcStart("");
    setRIndex(newIndex);
    setHeight(newRoom.height);
    setWidth(newRoom.width);
    setTile(newRoom.tile);
    setName(newRoom.name);
    setBookcases(newRoom.bookcases);
    return newRoom;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let room = roomConstruct();
    setEdit(false)

    if (rid) {
      let payload = await Rooms.updateRoomOfIdForUser(room, rid, user);
      dispatch({ type: UPDATE_ROOM, payload });
    } else {
      let payload = await Rooms.addRoomForUser(room, user);
      navigate(`${pathname.slice(0, 6) + payload.id}`);
      dispatch({ type: ADD_ROOM, payload });
      room = payload.id;
    }
    let bkcasesAdded = bookcases.filter(bk => !bk.hasOwnProperty("id"))
    if (bkcasesAdded.length) {
        await Bookcases.addBookcaseForRoom(bkcasesAdded, rid ? rid : room);
        let rms = await Rooms.getRoomsForUser(user);
        dispatch({ type: SET_ROOMS, payload: rms });
    }
  };

  const newBlankRoom = async () => {
    let rm = roomConstruct(10, 10, "New Room", 25, []);
    let payload = await Rooms.addRoomForUser(rm, user);
    navigate(utilPath(path, "room", payload.id));
    dispatch({ type: ADD_ROOM, payload });
    waitForSwitch.current = "add";
  };

  const removeARoom = async () => {
    let confirm = window.confirm(utilMsg({ type: 'room', details: { room: currentRoom } }))
    if (!confirm) return
    await Rooms.removeRoomFromUser(rid, user);
    dispatch({ type: REMOVE_ROOM, payload: rid });
    waitForSwitch.current = "remove";
  };

  return (
    <div className="newroom">
      <h3>
        <span>{name}</span> ({rIndex})
      </h3>
      <div className="pm">
        <div className="pm-r ed" onClick={() => { 
          if (bcStart) setBcStart("");
          if (bcEnd) setBcEnd("");
          if (!reposition.toggle) setEdit(!edit)
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
        <div
          className={`arrw ${!rIndex ? "hde" : ""}`}
          id="lft"
          onClick={() => switchRoom(-1, rooms)}
        >
          <span>{"<"}</span>
        </div>
        <div className="room-map" ref={mapRef} onClick={handleBoxClick}></div>
        <div
          className={`arrw ${
            !rooms.length || rIndex + 1 === rooms.length ? "hde" : ""
          }`}
          id="rit"
          onClick={() => switchRoom(1, rooms)}
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
          <button>Save</button>
        </form>
      </div>}
      
      {/* For test purposes...
      <button onClick={test0}>
        TEST EVERYTHING!
      </button>
      <button onClick={test1}>
        TEST Search
      </button> */}
    </div>
  );
};

export default NewRoom;

/*

THINGS TO WORK ON:



*/
