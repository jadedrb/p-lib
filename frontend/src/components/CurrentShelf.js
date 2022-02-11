import React, { useState } from 'react'

function CurrentShelf() {

    let [showShelf, setShowShelf] = useState(false)

    return ( 
        <>
            <button onClick={() => setShowShelf(!showShelf)}>Shelf</button>
            {showShelf && 
            <div>
                shelf here!
            </div>
            }
        </>
    );
}

export default CurrentShelf;