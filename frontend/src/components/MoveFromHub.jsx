import { useState, useEffect } from "react";
import { UPDATE_ROOM, REMOVE_BOOK, ADD_BULK } from "../context";
import BookService from "../services/BookService";
import RoomService from "../services/RoomService";
import { utilitySelector } from "../services/utility";


function MoveFromHub({ rooms, dispatch, selected, user, setShowMarkers }) {

  let [selRoom, setSelRoom] = useState('select');
  let [selBkcase, setSelBkcase] = useState({});
  let [selShelf, setSelShelf] = useState({});
  let [action, setAction] = useState("");

  let [roomInfo, setRoomInfo] = useState({});
  let [bkcaseInfo, setBkcaseInfo] = useState({});
  let [, setShelfInfo] = useState({});

  useEffect(() => {
    let { bkcase, room, shelf } = utilitySelector(
      selRoom,
      selBkcase,
      selShelf,
      rooms
    );
    setRoomInfo(room);
    setBkcaseInfo(bkcase);
    setShelfInfo(shelf);
  }, [selRoom, selBkcase, selShelf, rooms]);

  useEffect(() => {
    setAction("move");
  }, []);

  const handleChange = (e) => {
    let { value, name } = e.target;

    if (name === "action") setAction(value);
    else if (name === "room") {
      setSelRoom(value);
      setSelBkcase("select");
      setSelShelf("select");
    } else if (name === "bkcase") {
      setSelBkcase(value);
      setSelShelf("select");
    } else if (name === "shelf") setSelShelf(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (action === "Copy") {
      await handleCopy(selected)
      let payload = await RoomService.getRoomOfId(selRoom);
      dispatch({ type: UPDATE_ROOM, payload });
      alert(`Copied all ${selected?.length} book(s).`)
    } else {
      await handleCopy(selected);
      await handleMove(selected);
      let payload = await RoomService.getRoomOfId(selRoom);
      dispatch({ type: UPDATE_ROOM, payload });
      alert(`Moved all ${selected?.length} book(s).`)
    }
  };

  const handleCopy = async (bks) => {
    setShowMarkers(false)
        bks = bks.map(bk => {
            let { title, author, genre, pdate, pages, color, more, lang, markers } = bk
            return { title, author, genre, pdate, pages, color, more, lang, markers }
        })
    let books = await BookService.addBooksForShelfAndUser(bks, selShelf, user)
    dispatch({
        type: ADD_BULK,
        payload: { shid: selShelf, rid: selRoom, bcid: selBkcase, books },
    });
}

const handleMove = async (bks) => {
    setShowMarkers(false)
    for (let i = 0; i < bks.length; i++) {
        try {
            await BookService.removeBookFrom(bks[i].id)
            dispatch({
                type: REMOVE_BOOK,
                payload: { bcid: selBkcase, rid: selRoom, shid: selShelf, bid: bks[i].id }
            })
        } catch(e) {
            console.log(e)
        }
    }
}

  const confirmBut = () =>
    selRoom === "select" || selBkcase === "select" || selShelf === "select"
      ? true
      : false;

  return (
    <section className="m-hub-move">
      <p style={{ opacity: ".4" }}>I want to...</p>

      <select name="action" value={action} onChange={handleChange}>
        <option>Move</option>
        <option>Copy</option>
      </select>

      <p style={{ fontWeight: "bold" }}>All {selected?.length} selected book(s)</p>
      <p style={{ opacity: ".4" }}>"To..."</p>

      <>
        <p>Room:</p>
        <select name="room" value={selRoom} onChange={handleChange}>
          <option value="select" disabled>
            Select
          </option>
          {rooms.map((r) => (
            <option value={r.id} key={r.id}>
              {r.name} (id: {r.id})
            </option>
          ))}
        </select>
        <p>Bookcase:</p>
        <select name="bkcase" value={selBkcase} onChange={handleChange}>
          <option value="select" disabled>
            Select
          </option>
          {roomInfo?.bookcases?.map((bk) => (
            <option value={bk.id} key={bk.id}>
              {bk.location} (id: {bk.id})
            </option>
          ))}
        </select>
        <p>Shelf:</p>
        <select name="shelf" value={selShelf} onChange={handleChange}>
          <option value="select" disabled>
            Select
          </option>
          {bkcaseInfo?.shelves?.map((sh, i) => (
            <option value={sh.id} key={sh.id}>
              {i + 1 === 1
                ? "1st"
                : i + 1 === 2
                ? "2nd"
                : i + 1 === 3
                ? "3rd"
                : i + 1 + "th"}{" "}
              from the top (id: {sh.id})
            </option>
          ))}
        </select>
        {/* <br />
        <br />
        <br /> */}
        <input
          disabled={confirmBut()}
          type="button"
          onClick={handleSubmit}
          value={action.toUpperCase()}
        />
      </>
    </section>
  );
}

export default MoveFromHub;
