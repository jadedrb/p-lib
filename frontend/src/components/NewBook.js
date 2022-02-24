import React, { useState, useEffect, useContext, useRef } from "react";
import { ADD_BOOK, Context } from "../context";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { pretendId, utilPath } from "../services/utility";

const NewBook = ({ book, setCurrShelf }) => {
  const { dispatch } = useContext(Context);

  let { shid, rid, bcid } = useParams();
  let navigate = useNavigate()
  let path = useLocation()

  let firstInput = useRef();
  let colorInput = useRef()

  let [colorType, setColorType] = useState(true)
  let [inputs, setInputs] = useState({
    title: book ? "book" : "",
    author: book ? "book" : "",
    genre: book ? "book" : "",
    pcount: book ? "book" : "",
    pdate: book ? "book" : ""
  });
console.log(book)
  let [currentFocus, setCurrentFocus] = useState(null);

  useEffect(() => {
    setCurrentFocus(firstInput.current);
  }, []);

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
      let book = { ...inputs, id, color: colorInput.current.value }
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
        value={inputs.input1}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Author"
        name="author"
        value={inputs.input2}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Color"
        name="color"
        type={colorType ? "text" : "color"}
        ref={colorInput}
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
        value={inputs.input4}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Page Count"
        name="pcount"
        value={inputs.input5}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
      />
      <input
        placeholder="Publish Date"
        name="pdate"
        value={inputs.input6}
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