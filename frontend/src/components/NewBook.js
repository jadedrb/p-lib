import React, { useState, useEffect } from 'react';
// import { Context } from '../context'

const NewEntryField = (props) => {
    // const context = useContext(Context)
    
    let [inputs, setInputs] = useState({ 
        title: props.book ? 'book' : '',
        author: props.book ? 'book' : '',
        type: props.book ? 'book' : '',
        genre: props.book ? 'book' : '',
        location: props.book ? 'book' : '',
        shelf: props.book ? 'book' : ''
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
        }
    }

    return (
        
        <form id='ff'>
            <input autoFocus placeholder='Title' value={inputs.input1} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Author' value={inputs.input2} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Type' value={inputs.input3} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Genre' value={inputs.input4} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Location' value={inputs.input5} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
            <input placeholder='Shelf' value={inputs.input6} onChange={handleInput} onKeyPress={handleEnter} onClick={handleClick} />
        </form>
    )
}

export default NewEntryField;