import { useState, useRef, useEffect } from "react";

const NewRoom = () => {
  let [height, setHeight] = useState(10);
  let [width, setWidth] = useState(10);
  let [tile, setTile] = useState(25);
  let [roomName, setRoomName] = useState("New Room");

  let [bcStart, setBcStart] = useState("");
  let [bcEnd, setBcEnd] = useState("");

  let [bookcases, setBookcases] = useState([])

  let mapRef = useRef();

  let temp = {
    display: "flex",
    flexDirection: "column",
  };

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

        console.log(bookcases)

        map.appendChild(div);
      }
    }
  }, [height, width, tile, bcStart, bcEnd]);

  const randomNum = () => Math.floor(Math.random() * 255)

  const handleBoxClick = (e) => {
    if (e.target.className[0] !== "b") return
    let [row, column] = e.target.className
      .split(" ")[1]
      .split("-")
      .filter((c) => c !== "r" && c !== "c");

    row = Number(row)
    column = Number(column)

    let overlap = bookcases.some(b => (row >= b.rowLow && row <= b.rowHigh) && (column >= b.colLow && column <= b.colHigh))
    if (overlap) return

    if (!bcStart) {
      setBcStart([row, column]);
    } else if (bcStart && !bcEnd) {
      setBcEnd([row, column]);
    } else {

        console.log(bcEnd, bcStart)
        let test = Math.min(bcStart[0], bcEnd[0])
        let test2 = Math.min(bcStart[1], bcEnd[1])
        console.log(test, 'rows')
        console.log(test2, 'columns')

        let newBc = {
            rowLow: Math.min(bcStart[0], bcEnd[0]),
            colLow: Math.min(bcStart[1], bcEnd[1]),
            rowHigh: Math.max(bcStart[0], bcEnd[0]),
            colHigh: Math.max(bcStart[1], bcEnd[1]),
            color: `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`
        }
        setBookcases([...bookcases, newBc])

      setBcStart("");
      setBcEnd("");
    }
    console.log(row, column);
    console.log(e.target);
  };

  return (
    <div style={temp} className="newroom">
      <h3>{roomName}</h3>
      <div className="room-map" ref={mapRef} onClick={handleBoxClick}></div>
      <form>
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
      </form>
    </div>
  );
};

export default NewRoom;
