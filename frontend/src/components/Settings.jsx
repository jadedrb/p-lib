import { utilTime } from "../services/utility"
import UserService from '../services/UserService'
import RoomService from '../services/RoomService'
import { UPDATE_SETTINGS } from '../context'

import { useRef, useEffect, useState } from 'react'

function Settings({ rooms, user, userDetails, dispatch, setShowUserDet, showUserDet, handleLogout, handleShowDetails, settings }) {

    const [responsiveHeight, setResponsiveHeight] = useState(window.innerHeight)
    const [tempSettings, setTempSettings] = useState({ ...settings })

    const hubRef = useRef()
    let wrapperRef = useRef()

    const updateOnExit = async () => {
        const changesWereMade = Object.keys(tempSettings).some((prop) => tempSettings[prop] !== settings[prop])

        if (changesWereMade) {

            if (tempSettings.local === 'No' && localStorage.getItem('rooms')) {
                console.log('removing existing local data...')
                localStorage.removeItem('rooms')
            }
            else if (tempSettings.local === 'Yes' && !localStorage.getItem('rooms')) {
                console.log('storing data locally now...')
                localStorage.setItem('rooms', JSON.stringify(rooms))
            }

            await UserService.updateUser({ other: JSON.stringify(tempSettings) }, userDetails[user]) 
            dispatch({
                type: UPDATE_SETTINGS,
                payload: tempSettings
            })
        }
    }

    wrapperRef.current = { mount: false, updateOnExit }

    useEffect(() => {
        const resize = (e) => setResponsiveHeight(e.target.innerHeight)
        window.addEventListener('resize', resize);

        let { mount } = wrapperRef.current
        let timeout = setTimeout(() => {
            mount = true
        }, 100)

        return () => {
            window.removeEventListener('resize', resize)
            clearTimeout(timeout)
            if (mount){
                wrapperRef.current.mount = 'exit'
            }
        }
    }, [])

    useEffect(() => {
        return () => {
            let { mount, updateOnExit } = wrapperRef.current
            if (mount === 'exit') {
                updateOnExit()
            }
        }
    }, [tempSettings])

    const handleAccountDeletion = async () => {
        const confirm = window.confirm("Are you sure you want to delete your account?")
        if (confirm) {
            let confirmMsg = `Yes, I, ${user}, would like to delete my account`
            const confirmAgain = window.prompt(`One more step. Please confirm by typing: ${confirmMsg}`)
            if (confirmMsg === confirmAgain) {
                // remove rooms first (and any related rows)
                for (let rm of rooms) {
                    await RoomService.removeRoomFromUser(rm.id)
                }
                // then remove user
                let deletion = await UserService.removeUser()
                if (deletion.deleted) {
                    alert('Account deleted.')
                    setShowUserDet(!showUserDet)
                    handleLogout()
                } else {
                    alert('Attempt to delete account was unsuccessful.')
                }
            }
        }
    }

    const handleUpdateSettings = (__, setting) => {
        const alteredSettings = { ...tempSettings, [Object.keys(setting)[0]]: Object.values(setting)[0] }
        console.log(alteredSettings)
        setTempSettings(alteredSettings)
    }

    const handleCreationTime = (ud) => utilTime(Object.keys(ud).filter(udp => /[0-9]/.test(udp))[0])

     const readWrite = tempSettings.default === 'Read Only'

    let responsiveHeightObj = (hubRef.current?.offsetHeight + 100) > responsiveHeight ? {
        height: `${responsiveHeight - 100}px` 
    } : {
        height: '50vh'
    }

    return ( 
        
                    <div className="u-modal" style={responsiveHeightObj} ref={hubRef}>
                        <div>
                            <h3><span>{user}</span> <span>library</span> <span>settings</span></h3>
                            <h6>Account created on: {handleCreationTime(userDetails)}</h6>
                            <ul>
                                <li>Your library has:</li>
                                <li>{userDetails.rooms} rooms</li>
                                <li>{userDetails.bookcases} bookcases</li>
                                <li>{userDetails.shelves} shelves</li>
                                <li>{userDetails.books} books</li>
                            </ul>
                            <br/>
                            <div className="u-modal-set">
                                {/* <p>Make {lastFirst ? "first" : "last"} names appear before {lastFirst ? "last" : "first"} names (Example: {lastFirst ? "George Washington" : "Washington, George"})</p>
                                <button onClick={() => handleOtherSettings(userDetails[user], { names: lastFirst ? "first, last" : "last, first" })}>Switch</button> */}
                                <p>Currently set to {tempSettings.default ? tempSettings.default : "Read/Write"} by default. Change default to {!readWrite ? "Read Only" : "Read/Write"}</p>
                                <button onClick={() => handleUpdateSettings(userDetails[user], { default: !readWrite ? "Read Only" : "Read/Write" })}>
                                    {!readWrite ? "Read Only" : "Read/Write"}
                                </button>
                                <p>Your account is {tempSettings.temp ? tempSettings.temp : "Read/Write"}. Temporarily switch to {tempSettings.temp === "Read/Write" ? "Read Only" : "Read/Write"}</p>
                                <button onClick={() => handleUpdateSettings(userDetails[user], { temp: tempSettings.temp === "Read/Write" ? "Read Only" : "Read/Write" })}>
                                    {tempSettings.temp === "Read/Write"  ? "Read Only" : "Read/Write"}
                                </button>
                                {rooms.length ?
                                <>
                                    <p>Jump to {rooms[tempSettings.jump] ? rooms[tempSettings.jump].name : rooms[0]?.name} on login</p>
                                
                                    <select value={tempSettings.jump} onChange={(e) => handleUpdateSettings(userDetails[user], { jump: e.target.value })} style={{ backgroundColor: 'lightgrey'}}>
                                        {rooms.map((room, i) => 
                                            <option key={room.id} value={i}>
                                                {`${room.name} (${i + 1})`}
                                            </option>
                                        )}
                                    </select>
                                </> : ''}

                                <p>{!tempSettings.roll || tempSettings.roll === "Dont Roll" ? "Don't roll" : "Roll"} to a random book by default</p>
                                <button onClick={() => handleUpdateSettings(userDetails[user], { roll: !tempSettings.roll || tempSettings.roll === "Dont Roll" ? "Roll" : "Dont Roll" })}>{!tempSettings.roll || tempSettings.roll === "Dont Roll" ? "Roll" : "Don't Roll"}</button>

                                <p>Data related to books is {!tempSettings.local || tempSettings.local === "No" ? "NOT" : " currently "} stored locally (localStorage)</p>
                                <button onClick={() => handleUpdateSettings(userDetails[user], { local: !tempSettings.local || tempSettings.local === "No" ? "Yes" : "No" })}>{!tempSettings.local || tempSettings.local === "No" ? "Store" : "Dont Store" }</button>

                                {/* <p>{!tempSettings.offline || tempSettings.offline === "Off" ? "Do NOT use" : "Utilize"} local book data for offline mode</p>
                                <button 
                                    disabled={!tempSettings.local || tempSettings.local === "No" ? true : false} 
                                    onClick={() => handleUpdateSettings(userDetails[user], { offline: !tempSettings.offline || tempSettings.offline === "Off" ? "On" : "Off" })}
                                >
                                        {!tempSettings.offline || tempSettings.offline === "Off" ? "Use" : "Dont Use" }
                                </button> */}

                                <p>Delete my personal library and account information</p>
                                <button onClick={() => handleAccountDeletion(userDetails[user])}>Delete</button>
                                
                                <details>
                                    <summary>Learn More</summary>
                                    <ol style={{ fontSize: '12px'}}>
                                        <li>The <i>color</i> of a book is meant to correspond to the color of its spine, which is what you'd see first on the shelf.</li>
                                        <li>When searching for a book, you can choose a different search parameter other than title by typing hashtag (#) and then the category (Example: <i>#author</i> or <i>#published</i>).</li>
                                        <li>Discover a completely random book from your library by typing <i>#roll</i> in the search box.</li>
                                        <li>Search multiple categories with <i>#all</i></li>
                                        <li>You can use the greater than symbol ({'>'}) and the less than symbol ({'<'}) with publish date and pages. You can also combine them to find in-between values (Example: <i>{'>'} 1920</i> or <i>{'>'} 100 {'<'} 300</i>) </li>
                                        <li>For publish date and pages, you can add the letter <i>s</i> at the end to search a ten year period or a span of one hundred pages. (Example: <i>1980s</i> or <i>400s</i>) </li>
                                        <li>Type <i>?authors</i>, <i>?genres</i>, or <i>?colors</i> to see a list of potential search options for each category.</li>
                                        <li>Feel free to separate authors and genres with an ampersand ({'&'}) or a slash (/) when inputting data.</li>
                                        <li>When entering new book information, you can use the <i>tilde</i> key ({'~'}) to copy the current text in the input field. Press it again on an empty version of the same input field of a future book entry to paste what you copied.</li>
                                        <li>You can mark a book by locating it in the <i>Shelf</i> view and clicking on the title. Depending on the popularity of the book, it may also show a picture of its cover.</li>
                                        <li>You can mark a book as <i>Favorited</i> (dark blue), <i>Selected</i> (light blue), and/or <i>Missing</i> (yellow). Use the <i>Selected</i> marker to easily copy, move, or delete multiple books in different locations - ideal for moments where you need to reorganize your library.</li>
                                    </ol>
                                </details>

                            </div>
                        </div>
                    </div>
               
     );
}

export default Settings;