import React, { useState, useEffect, useContext, useRef } from "react";
import { ADD_BOOK, Context, REMOVE_BOOK, UPDATE_BOOK } from "../context";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { utilPath, utilitySelector, utilMsg } from "../services/utility";

import BookService from "../services/BookService"

const NewBook = ({ setCurrShelf }) => {
  const { rooms, dispatch, user } = useContext(Context);

  let { shid, rid, bcid, bid } = useParams();
  let navigate = useNavigate()
  let path = useLocation()

  let firstInput = useRef();

  let initialInputs = useRef({
    title: "",
    author: "",
    genre: "",
    pages: "",
    pdate: "",
    color: "",
    more: ""
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
        let { title, author, genre, pages, pdate, color, more } = book
        setInputs({ title, author, genre, pages, pdate, color, more })
      }
    } else {
      setInputs(initialInputs.current)
    }
  }, [rid, bcid, shid, rooms, bid])

  const handleInput = (e) => {
    let { name, value } = e.target;
    let newInputs = { ...inputs };
    newInputs[name] = value;
    console.log(newInputs)
    setInputs(newInputs);
  };

  const handleClick = (e) => {
    setCurrentFocus(e.target);
  };

  const handleEnter = async (e) => {
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
        let book = await BookService.updateBookForShelf(inputs, bid)
        console.log(book)
        dispatch({
          type: UPDATE_BOOK,
          payload: { shid, rid, bcid, bid, book },
        });
      } else {
        let book = await BookService.addBookForShelfAndUser(inputs, shid, user)
        navigate(utilPath(path, 'book', book.id))
        dispatch({
          type: ADD_BOOK,
          payload: { shid, rid, bcid, setCurrShelf, book },
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

  const removeBook = async () => {
    let confirm = window.confirm(utilMsg({ type: 'book', details: { bid, title: inputs.title } }))
    if (!confirm) return
    await BookService.removeBookFromShelfAndUser(bid, shid, user)
    dispatch({ type: REMOVE_BOOK, payload: { bcid, rid, shid, bid }})
    navigate(utilPath(path, 'shelf', shid))
  }

  return (
    <div className="nb-contain">
      {bid && <h5>Book ID: {bid}</h5>}
      {bid && <div className="pm-b" onClick={removeBook}>-</div>}
    
      <form className="ff">
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
          name="pages"
          type="number"
          value={inputs.pages}
          onChange={handleInput}
          onKeyPress={handleEnter}
          onClick={handleClick}
        />
        <input
          placeholder="Publish Date"
          name="pdate"
          type="number"
          value={inputs.pdate}
          onChange={handleInput}
          onKeyPress={handleEnter}
          onClick={handleClick}
        />
        <input
          placeholder="More"
          name="more"
          value={inputs.more}
          onChange={handleInput}
          onKeyPress={handleEnter}
          onClick={handleClick}
        />
        <input 
          type="button"
          value={bid ? "Save" : "Create"}
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
    </div>
  );
};

export default NewBook;

