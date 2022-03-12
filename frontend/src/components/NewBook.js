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

  let [edit, setEdit] = useState(bid ? false : true)

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

  const handleEnter = (e) => {
    if (!edit) return
    console.log(firstInput)
    let nextInput;

    if (e.key === "Enter") {
      nextInput = currentFocus.nextSibling
        ? currentFocus.nextSibling
        : currentFocus;

    if (nextInput.nodeName === "LABEL")
      nextInput = nextInput.nextSibling

      // When pressing enter, skip the color input type button and Save button
      if (nextInput.name === 'skip' || nextInput.name === 'save') 
        nextInput = nextInput.nextSibling

    if (nextInput.nodeName === "LABEL")
      nextInput = nextInput.nextSibling

      nextInput.focus();
      nextInput.select();
      setCurrentFocus(nextInput);
    }

    // If enter press on the last input OR if they click the Save button
    if (nextInput?.name === "reset" || e.target.name === "save") {
      handleSaveCreate()
    }

    // If enter press leads nowhere OR if Reset button is pressed
    if (nextInput === currentFocus || e.target.name === "reset") {
      console.log(firstInput)
      firstInput.current.focus();
      setCurrentFocus(firstInput.current);
      navigate(utilPath(path, 'book', ""))
    }
  };

  const handleResetPress = () => {
    firstInput.current.focus();
    setCurrentFocus(firstInput.current);
    navigate(utilPath(path, 'book', ""))
    setInputs(initialInputs.current)
  }

  const handleSaveCreate = async (e) => {
    let newBook = { ...inputs, author: inputs.author.split(" ").reverse().join(" ")}
    if (bid) {
      let book = await BookService.updateBookForShelf(newBook, bid)
      console.log(book)
      dispatch({
        type: UPDATE_BOOK,
        payload: { shid, rid, bcid, bid, book },
      });
    } else {
      let book = await BookService.addBookForShelfAndUser(newBook, shid, user)
      navigate(utilPath(path, 'book', book.id))
      dispatch({
        type: ADD_BOOK,
        payload: { shid, rid, bcid, setCurrShelf, book },
      });
    }
    if (e?.target?.value) // to determine whether they clicked a button or pressed Enter
      navigate(utilPath(path, 'shelf', shid))
  }

  const removeBook = async () => {
    let confirm = window.confirm(utilMsg({ type: 'book', details: { bid, title: inputs.title } }))
    if (!confirm) return
    await BookService.removeBookFromShelfAndUser(bid, shid, user)
    dispatch({ type: REMOVE_BOOK, payload: { bcid, rid, shid, bid }})
    navigate(utilPath(path, 'shelf', shid))
  }

  return (
    <div className="nb-contain">

          <div className="pm">
                <div className="pm-r ed" onClick={() => setEdit(!edit)}>=</div>
                {bid && edit && <div className="pm-b" onClick={removeBook}>-</div>}
          </div>


       {/* {bid && <h5>Book ID: {bid}</h5>} */}
      <div className="ff-contain">
        <form className="ff">
          <label htmlFor="title">Title</label>
          <input
            readOnly={edit ? false : true}
            id="title"
            autoFocus
            placeholder="Title"
            name="title"
            ref={firstInput}
            value={inputs.title}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          <label htmlFor="author">Author</label>
          <input
            readOnly={edit ? false : true}
            id="author"
            placeholder="Author"
            name="author"
            value={inputs.author}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          <label htmlFor="color">Color</label>
          <input
            readOnly={edit ? false : true}
            id="color"
            placeholder="Color"
            name="color"
            type={colorType ? "text" : "color"}
            value={!colorType && inputs.color.slice(0,1) !== "#" ? "#ffffff" : inputs.color}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          {edit &&
          <input 
            type="button"
            value=" "
            name="skip"
            onClick={() => setColorType(!colorType)}
          />}
          <label htmlFor="genre">Genre</label>
          <input
            readOnly={edit ? false : true}
            id="genre"
            placeholder="Genre/Type"
            name="genre"
            value={inputs.genre}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          <label htmlFor="pages">Pages</label>
          <input
            readOnly={edit ? false : true}
            id="pages"
            placeholder="Page Count"
            name="pages"
            type="number"
            value={inputs.pages}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          <label htmlFor="pdate">Published</label>
          <input
            readOnly={edit ? false : true}
            id="pdate"
            placeholder="Publish Date"
            name="pdate"
            type="number"
            value={inputs.pdate}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          <label htmlFor="more">More</label>
          <input
            readOnly={edit ? false : true}
            id="more"
            placeholder="More"
            name="more"
            value={inputs.more}
            onChange={handleInput}
            onKeyPress={handleEnter}
            onClick={handleClick}
          />
          {edit &&
          <input 
            type="button"
            value={bid ? "Save" : "Create"}
            name="save"
            onClick={handleSaveCreate}
            onKeyPress={handleEnter}
          />}
          {edit &&
          <input 
            type="button"
            value="Reset"
            name="reset"
            onClick={handleResetPress}
            onKeyPress={handleEnter}
          />}
        </form>
      </div>
    </div>
  );
};

export default NewBook;

