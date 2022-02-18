import React, { useState, useEffect, useContext, useRef } from "react";
import { ADD_BOOK, Context } from "../context";
import { useParams } from "react-router-dom";

const NewBook = ({ book, setCurrShelf }) => {
  const { dispatch } = useContext(Context);

  let { shid, rid, bcid } = useParams();

  let firstInput = useRef();

  let [inputs, setInputs] = useState({
    title: book ? "book" : "",
    author: book ? "book" : "",
    genre: book ? "book" : "",
    pcount: book ? "book" : "",
    pdate: book ? "book" : "",
  });

  let [currentFocus, setCurrentFocus] = useState(null);

  useEffect(() => {
    setCurrentFocus(firstInput.current);
  }, []);

  const randomNum = () => Math.floor(Math.random() * 255)

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
      nextInput.focus();
      setCurrentFocus(nextInput);
    }

    if (nextInput === currentFocus) {
      firstInput.current.focus();
      setCurrentFocus(firstInput.current);
      let book = { ...inputs }
      book.id = randomNum() + randomNum() + randomNum()
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
        value={inputs.input3}
        onChange={handleInput}
        onKeyPress={handleEnter}
        onClick={handleClick}
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
