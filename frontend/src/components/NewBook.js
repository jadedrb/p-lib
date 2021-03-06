import React, { useState, useEffect, useRef } from "react";
import { useLibContext, ADD_BOOK, CURRENT_BOOK, REMOVE_BOOK, UPDATE_BOOK } from "../context";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { utilPath, utilitySelector, utilMsg, utilTime, loading, clearLoading } from "../services/utility";

import BookService from "../services/BookService"
import Move from "./Move";
import axios from "axios";

const NewBook = ({ setCurrShelf }) => {
  const { rooms, dispatch, user, settings } = useLibContext()

  let params = useParams();
  let { shid, rid, bcid, bid } = params
  let navigate = useNavigate()
  let path = useLocation()

  let firstInput = useRef();
  let inputRetrieval = useRef();
  let inputMania = useRef();

  /*
    ORIGINAL PROBLEM: Pressing Enter in the "more" textfield counted also as
    an onClick of the Reset button, even though it's two buttons down and the
    Enter should only click the Save button. Some weird difference between 
    onKeyPress (what it was originally) and onKeyDown (what it is now). The 
    inputMania ref provides a 200ms delay to let all this settle before the 
    next valid user keyPress.
  */

  let initialInputs = useRef({
    title: "",
    author: "",
    genre: "",
    pages: "",
    pdate: "",
    color: "",
    more: "",
    lang: ""
  })

  let [edit, setEdit] = useState(bid ? false : true)
  let [move, setMove] = useState(false)

  let [colorType, setColorType] = useState(true)
  let [inputs, setInputs] = useState(initialInputs.current);

  let [currentFocus, setCurrentFocus] = useState(null);
  let [shelfPres, setShelfPres] = useState(null);
  let [currentBook, setCurrentBook] = useState(null);

  // let [extraData, setExtraData] = useState('');

  useEffect(() => {
    setCurrentFocus(firstInput.current);
  }, []);

  useEffect(() => {
    let { book, shelf } = utilitySelector(rid, bcid, shid, rooms, bid)
    if (bid) {
      if (book) { 
        let { title, author, genre, pages, pdate, color, more, lang } = book
        setInputs({ title, author, genre, pages, pdate, color, more, lang })
      }
    } else {
      setInputs(initialInputs.current)
    }
    setShelfPres(shelf)
    setCurrentBook(book)

  }, [rid, bcid, shid, rooms, bid])

  useEffect(() => {
    dispatch({
      type: CURRENT_BOOK,
      payload: currentBook
    })
  }, [currentBook, dispatch])

  const handleInput = (e) => {
    let { name, value } = e.target;
    if ((name === 'pdate' || name === 'pages') && value.length > 9) return
    if (value.includes('`')) return
    let newInputs = { ...inputs };
    newInputs[name] = value;
    setInputs(newInputs);
  };

  const handleClick = (e) => {
    setCurrentFocus(e.target);
  };

  const handleEnter = (e) => {
    if (!edit) return

    let nextInput;

    if (e.key === 'Enter' || e.key === "ArrowUp" || e.key === "ArrowDown") {
      let sibling = e.key === "Enter" || e.key === "ArrowDown" ? 'nextSibling' : 'previousSibling'

      if (e.key === "ArrowUp" || e.key === "ArrowDown") 
        e.preventDefault() // which would be the increment/decrement of numbers in a type=number input field

      if (currentFocus.id === 'more' && e.key === "ArrowDown")
        return

      nextInput = currentFocus[sibling] ? currentFocus[sibling] : currentFocus

      if (nextInput?.nodeName === "LABEL")
        nextInput = nextInput[sibling]

        // When pressing enter, skip the color input type button and Save button
      if (nextInput?.name === 'skip' || nextInput?.name === 'save') 
        nextInput = nextInput[sibling]

      if (nextInput?.nodeName === "LABEL")
        nextInput = nextInput[sibling]

      if (nextInput) {
        nextInput.focus();
        // nextInput.select();
        setCurrentFocus(nextInput);
      }
    }

    // If enter press on the last input OR if they click the Save button
    if ((nextInput?.name === "reset" || e.target.name === "save") && (nextInput?.name !== e.target.name)) {
      handleSaveCreate()
      console.log('here2')
      inputMania.current = true
      setTimeout(() => inputMania.current = false, 200)
    }

    // If enter press leads nowhere OR if Reset button is pressed
    if (nextInput === currentFocus || e.target.name === "reset") {
      if (inputMania.current) return
      firstInput.current.focus();
      setCurrentFocus(firstInput.current);
      navigate(utilPath(path, 'book', ""))
    }

    if (e.key === '`') {
      if (inputRetrieval.current && e.target.id in inputRetrieval.current && !inputs[e.target.id])
        handleInput({ target: { value: inputRetrieval.current[e.target.id], name: e.target.id } })
      else 
        inputRetrieval.current = { ...inputRetrieval.current, [e.target.id] : inputs[e.target.id] } 
    }
  };

  const handleResetPress = () => {
    if (inputMania.current) return
    firstInput.current.focus();
    setCurrentFocus(firstInput.current);
    navigate(utilPath(path, 'book', ""))
    setInputs(initialInputs.current)
  }

  const handleSaveCreate = async (e) => {
    // loading(`.sh-b`, false, 'thumb')
    if (bid) {
      let book = await BookService.updateBookForShelf(inputs, bid)
      dispatch({
        type: UPDATE_BOOK,
        payload: { shid, rid, bcid, bid, book },
      });
    } else {
      let [ book ] = await BookService.addBooksForShelfAndUser([inputs], shid, user)
      navigate(utilPath(path, 'book', book.id))
      dispatch({
        type: ADD_BOOK,
        payload: { shid, rid, bcid, setCurrShelf, book },
      });
    }
    // clearLoading()
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

  const handleDataHelper = async () => {
    let result, valid;
    loading('.ff-contain')
    try {
      result = await axios.get(`${process.env.REACT_APP_GOOGLE_API}${inputs.title}`)
    } catch (e) {
      console.log(e)
    }
    clearLoading()

      valid = result.data?.items?.reduce((acc, curr) => {
        let obj = curr.volumeInfo
        let pckge = {}
        if (obj?.title === inputs.title) {
          pckge.author = obj?.authors?.[0] ? obj?.authors?.[0] : ''
          pckge.more = obj?.description?.length <= 255 ? obj?.description : obj?.description ? obj?.description?.slice(0,252) + '...' : ''
          pckge.pages = obj?.pageCount ? obj?.pageCount : ''
          pckge.pdate = obj.publishedDate & obj?.publishedDate?.length < 5 ? obj.publishedDate : obj.publishedDate?.slice(0,4)
          pckge.genre = obj?.categories?.[0] ? obj?.categories?.[0] : ''
          // pckge.extraData = obj?.description?.length <= 255 ? '' : obj?.description
          return [...acc, pckge]
        }
        return acc
      }, [])

      if (inputs.author) {
        valid = valid.filter(obj => obj.author === inputs.author)
      }   
      valid = valid[Math.floor(Math.random() * valid.length)]

      setInputs({ ...inputs, ...valid });
  }

  return (
    <div className="nb-contain">
      {shelfPres ?
          <>
          <div className="pm">
                {bid && <div className="pm-r ed" onClick={() => { 
                  if (settings.temp !== "Read Only")
                    setEdit(!edit); 
                  if(move) 
                    setMove(false); 
          }}>=</div>}
                {bid && edit && <div className="pm-r ed" onClick={() => setMove(!move)}>~</div>}
                {bid && edit && <div className="pm-b" onClick={removeBook}>-</div>}
                
          </div>
          {bid && <div className="lst-up">Last updated: {utilTime(currentBook?.recorded_on)}</div>}
          </>
          : null}

      
        {(shelfPres && !move) || (move && !edit) ?

      <div className="ff-contain">
        <form className="ff">
          <label htmlFor="title">
            Title 
            {edit && inputs.title && 
              <span onClick={handleDataHelper} className="get-details">
                O
              </span>}
          </label>
          <input
            readOnly={edit ? false : true}
            id="title"
            placeholder="Title"
            name="title"
            ref={firstInput}
            value={inputs.title}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            maxLength={255}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
          />
          <label htmlFor="author">Author</label>
          <input
            readOnly={edit ? false : true}
            id="author"
            placeholder="Author"
            name="author"
            value={inputs.author}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            maxLength={255}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
          />
          <label htmlFor="color">
            Color
            {edit && <span style={{ backgroundColor: inputs.color }} onClick={() => setColorType(!colorType)} className="color-alt" />}
          </label>
          <input
            readOnly={edit ? false : true}
            id="color"
            placeholder="Color"
            name="color"
            type={colorType ? "text" : "color"}
            value={!colorType && inputs.color.slice(0,1) !== "#" ? "#ffffff" : inputs.color}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            maxLength={255}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
          />
          <label htmlFor="genre">Genre</label>
          <input
            readOnly={edit ? false : true}
            id="genre"
            placeholder="Genre/Type"
            name="genre"
            value={inputs.genre}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            maxLength={255}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
          />
          <label htmlFor="lang">Language</label>
          <input
            readOnly={edit ? false : true}
            id="lang"
            placeholder="Language"
            name="lang"
            maxLength={255}
            value={inputs.lang}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
          />
          <label htmlFor="pdate">Published</label>
          <input
            readOnly={edit ? false : true}
            id="pdate"
            placeholder="Publish Date"
            name="pdate"
            type="number"
            max="999"
            value={inputs.pdate}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
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
            onKeyDown={handleEnter}
            onClick={handleClick}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC' }}
          />
          <label htmlFor="more">More</label>
          <textarea
            readOnly={edit ? false : true}
            id="more"
            placeholder="More"
            name="more"
            value={inputs.more}
            onChange={handleInput}
            onKeyDown={handleEnter}
            onClick={handleClick}
            maxLength={255}
            style={{ backgroundColor: edit ? 'white' : '#ECECEC', minHeight: "100px" }}
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
      : edit && move ? 
      <Move 
        from={"book"}
        book={inputs} 
        params={params} 
        path={path}
        navigate={navigate}
      /> : "No book selected"}
    </div>
  );
};

export default NewBook;

