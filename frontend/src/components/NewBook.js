import React, { useState, useEffect, useContext } from 'react';
import { ADD_BOOK, Context } from '../context'
import { useParams } from 'react-router-dom';

const NewEntryField = ({ book, setCurrShelf }) => {
    const { dispatch } = useContext(Context)

    let { shid, rid, bcid } = useParams()
    
    let [inputs, setInputs] = useState({ 
        title: book ? 'book' : '',
        author: book ? 'book' : '',
        genre: book ? 'book' : '',
        pcount: book ? 'book' : '',
        pdate: book ? 'book' : ''
    })

    let [currentFocus, setCurrentFocus] = useState(null)

    useEffect(() => {
        setCurrentFocus(document.getElementById('ff').children[0])
    }, [])

    const handleInput = (e) => {

        let { placeholder, value } = e.target

        let property = placeholder[0].toLowerCase() + placeholder.slice(1)
        let newInputs = {...inputs}

        newInputs[property] = value
        setInputs(newInputs)
    }

    const handleClick = e => {
        setCurrentFocus(e.target)
    }

    const handleEnter = e => {
        let nextInput;

        if (e.key === 'Enter') {
            nextInput = currentFocus.nextSibling ? currentFocus.nextSibling : currentFocus
            nextInput.focus()
            setCurrentFocus(nextInput)
        }

        if (nextInput === currentFocus) {
            console.log(inputs)
            // context.postNewBook(inputs);
            // context.getAllBooks()
            dispatch({ type: ADD_BOOK, payload: { shid, rid, bcid, book: inputs, setCurrShelf } })
            // let { shelf } = utilitySelector(rid, bcid, shid, rooms)
            // setCurrShelf({ ...shelf })
        }
    }

    return (
        
        <form id='ff'>
            <input autoFocus placeholder='Title' value={inputs.input1} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Author' value={inputs.input2} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Color' value={inputs.input3} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Genre/Type' value={inputs.input4} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Page Count' value={inputs.input5} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Publish Date' value={inputs.input6} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
        </form>
    )
}

export default NewEntryField;