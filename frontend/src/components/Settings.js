import { utilTime, loading, clearLoading } from "../services/utility"
import GeneralModal from './GeneralModal'
import UserService from '../services/UserService'
import { UPDATE_SETTINGS } from '../context'

function Settings({ rooms, user, userDetails, dispatch, setShowUserDet, showUserDet, handleLogout, handleShowDetails, settings }) {

    const handleAccountDeletion = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete your account?")
        if (confirm) {
            let confirmMsg = `Yes, I, ${user}, would like to delete my account`
            const confirmAgain = window.prompt(`One more step. Please confirm by typing: ${confirmMsg}`)
            if (confirmMsg === confirmAgain) {
                let deletion = await UserService.removeUser(id)
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

    const handleOtherSettings = async (id, setting) => {

        loading(".u-modal")
        let currentSettings = await UserService.getUserByName(user)
        let other = {}

        if (currentSettings.other)
            other = JSON.parse(currentSettings.other)
   
        other = { ...other, [Object.keys(setting)[0]]: Object.values(setting)[0] }
        await UserService.updateUserOfId({ other: JSON.stringify(other)}, id) 
        
        dispatch({
            type: UPDATE_SETTINGS,
            payload: other
        })

        clearLoading()
    }

    const handleTempReadWrite = () => {
        dispatch({ 
            type: UPDATE_SETTINGS, 
            payload: { temp: settings.temp === "Read/Write" ? "Read Only" : "Read/Write" }
        })
    }

    const handleJumpChange = (e) => {
        handleOtherSettings(userDetails[user], { jump: e.target.value })
    }

    const handleCreationTime = (ud) => utilTime(Object.keys(ud).filter(udp => /[0-9]/.test(udp))[0])

     // const lastFirst = settings.names === 'last, first'
     const readWrite = settings.default === 'Read Only'

    return ( 
        <GeneralModal toggle={handleShowDetails}>
                    <div className="u-modal" style={{ height: `${window.innerHeight - 400}px` }}>
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
                                <p>Currently set to {settings.default ? settings.default : "Read/Write"} by default. Change default to {!readWrite ? "Read Only" : "Read/Write"}</p>
                                <button onClick={() => handleOtherSettings(userDetails[user], { default: !readWrite ? "Read Only" : "Read/Write" })}>{!readWrite ? "Read Only" : "Read/Write"}</button>
                                <p>Your account is {settings.temp ? settings.temp : "Read/Write"}. Temporarily switch to {settings.temp === "Read/Write" ? "Read Only" : "Read/Write"}</p>
                                <button onClick={handleTempReadWrite}>{settings.temp === "Read/Write"  ? "Read Only" : "Read/Write"}</button>
                                {rooms.length ?
                                <>
                                    <p>Jump to {rooms[settings.jump] ? rooms[settings.jump].name : rooms[0]?.name} on login</p>
                                
                                    <select value={settings.jump} onChange={handleJumpChange} style={{ backgroundColor: 'lightgrey'}}>
                                        {rooms.map((room, i) => 
                                            <option key={room.id} value={i}>
                                                {`${room.name} (${i + 1})`}
                                            </option>
                                        )}
                                    </select>
                                </> : ''}

                                <p>{!settings.roll || settings.roll === "Don't Roll" ? "Don't roll" : "Roll"} to a random book by default</p>
                                <button onClick={() => handleOtherSettings(userDetails[user], { roll: !settings.roll || settings.roll === "Don't Roll" ? "Roll" : "Don't Roll" })}>{!settings.roll || settings.roll === "Don't Roll" ? "Roll" : "Don't Roll"}</button>

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

                                    </ol>
                                </details>

                            </div>
                        </div>
                    </div>
                </GeneralModal>
     );
}

export default Settings;