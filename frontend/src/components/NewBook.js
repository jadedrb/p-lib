import React, { useState, useEffect, useContext, useRef } from "react";
import { ADD_BOOK, Context } from "../context";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { pretendId, utilPath, utilitySelector } from "../services/utility";

const NewBook = ({ setCurrShelf }) => {
  const { rooms, dispatch } = useContext(Context);

  let { shid, rid, bcid, bid } = useParams();
  let navigate = useNavigate()
  let path = useLocation()

  let firstInput = useRef();

  let [colorType, setColorType] = useState(true)
  let [inputs, setInputs] = useState({
    title: "",
    author: "",
    genre: "",
    pcount: "",
    pdate: "",
    color: ""
  });

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

      if (nextInput.name === 'skip') 
        nextInput = nextInput.nextSibling

      nextInput.focus();
      nextInput.select();
      setCurrentFocus(nextInput);
    }

    if (nextInput === currentFocus) {
      firstInput.current.focus();
      setCurrentFocus(firstInput.current);
      let id = pretendId()
      let book = { ...inputs, id }
      navigate(utilPath(path, 'book', id))
      dispatch({
        type: ADD_BOOK,
        payload: { shid, rid, bcid, book, setCurrShelf },
      });
    }
  };

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
    </form>
  );
};

export default NewBook;


/*

TO DO:

Have it so when you click on a book, it's entries populate the input fields.
You'll need to add another layer to the utility selector.

*/