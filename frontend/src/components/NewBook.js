import React, { useState, useEffect, useContext, useRef } from "react";
import { ADD_BOOK, Context, UPDATE_BOOK } from "../context";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { pretendId, utilPath, utilitySelector } from "../services/utility";

const NewBook = ({ setCurrShelf }) => {
  const { rooms, dispatch } = useContext(Context);

  let { shid, rid, bcid, bid } = useParams();
  let navigate = useNavigate()
  let path = useLocation()

  let firstInput = useRef();

  let initialInputs = useRef({
    title: "",
    author: "",
    genre: "",
    pcount: "",
    pdate: "",
    color: ""
  })

  let [colorType, setColorType] = useState(true)
  let [inputs, setInputs] = useState(initialInputs.current);

  let [currentFocus, setCurrentFocus] = useState(null);

  useEffect(() => {
    setCurrentFocus(firstInput.current);
  }, []);

  useEffect(() => {
    if (bid) {
      let { book } = utilitySelector(rid, bcid, shid, rooms, bid)
      if (book) { 
        let { title, author, genre, pcount, pdate, color } = book
        setInputs({ title, author, genre, pcount, pdate, color })
      }
    } else {
      setInputs(initialInputs.current)
    }
  }, [rid, bcid, shid, rooms, bid])

  const handleInput = (e) => {
    let { name, value } = e.target;
    let newInputs = { ...inputs };
    newInputs[name] = value;
    setInputs(newInputs);
  };

  const handleClick = (e) => {
    setCurrentFocus(e.target);
  };

  const handleEnter = (e) => {
    let nextInput;

    if (e.key === "Enter") {
      nextInput = currentFocus.nextSibling
        ? currentFocus.nextSibling
        : currentFocus;

      // When pressing enter, skip the color input type button and Save button
      if (nextInput.name === 'skip' || nextInput.name === 'save') 
        nextInput = nextInput.nextSibling

      nextInput.focus();
      nextInput.select();
      setCurrentFocus(nextInput);
    }

    // If enter press on the last input OR if they click the Save button
    if (nextInput?.name === "reset" || e.target.name === "save") {
      if (bid) {
        let book = { ...inputs, id: Number(bid) }
        dispatch({
          type: UPDATE_BOOK,
          payload: { shid, rid, bcid, book, bid },
        });
      } else {
        let id = pretendId()
        let book = { ...inputs, id }
        navigate(utilPath(path, 'book', id))
        dispatch({
          type: ADD_BOOK,
          payload: { shid, rid, bcid, book, setCurrShelf },
        });
      }
    }

    // If enter press leads nowhere OR if Reset button is pressed
    if (nextInput === currentFocus || e.target.name === "reset") {
      firstInput.current.focus();
      setCurrentFocus(firstInput.current);
      navigate(utilPath(path, 'shelf', shid))
    }
  };
console.log(rooms)
  return (
    <form id="ff">
      <input
        autoFocus
        placeholder="Title"
        name="title"
        ref={firstInput}
        value={inputs.title}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Author"
        name="author"
        value={inputs.author}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Color"
        name="color"
        type={colorType ? "text" : "color"}
        value={!colorType && inputs.color.slice(0,1) !== "#" ? "#ffffff" : inputs.color}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input 
        type="button"
        value=" "
        name="skip"
        onClick={() => setColorType(!colorType)}
      />
      <input
        placeholder="Genre/Type"
        name="genre"
        value={inputs.genre}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Page Count"
        name="pcount"
        value={inputs.pcount}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Publish Date"
        name="pdate"
        value={inputs.pdate}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input 
        type="button"
        value="Save"
        name="save"
        onClick={handleEnter}
        onKeyPress={handleEnter}
      />
      <input 
        type="button"
        value="Reset"
        name="reset"
        onClick={handleEnter}
        onKeyPress={handleEnter}
      />
    </form>
  );
};

export default NewBook;


/*

TO DO:

Have it so when you click on a book, it's entries populate the input fields.
You'll need to add another layer to the utility selector.

*/