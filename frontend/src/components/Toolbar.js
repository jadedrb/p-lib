import React, { useContext, useState } from 'react';
import { Context } from '../context'
import NewEntryField from './NewBook'

const Toolbar = () => {
    const context = useContext(Context)
    let [viewNewEntry, setViewNewEntry] = useState(false) 

    const handleClick = () => {
        setViewNewEntry(!viewNewEntry)
        console.log(context)
        // context.getAllBooks()
    }

    const handleResults = () => null

    const handleReset = () => null

    let viewEntryField = viewNewEntry ? <NewEntryField /> : ''

    return (
        <div className="toolbar">
            <div>
                <button onClick={handleClick}>New</button>
                <button onClick={handleResults}>Results (Temp)</button>
                <button onClick={handleReset}>Reset</button>
            </div>
            {viewEntryField}
        </div>
    )
}

export default Toolbar;