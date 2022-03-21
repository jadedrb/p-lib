import { utilTime, loading, clearLoading } from "../services/utility"
import GeneralModal from './GeneralModal'
import UserService from '../services/UserService'
import { UPDATE_SETTINGS } from '../context'

function Settings({ user, settings, userDetails, dispatch, setShowUserDet, showUserDet, handleLogout, handleShowDetails }) {

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

    const handleCreationTime = (ud) => utilTime(Object.keys(ud).filter(udp => /[0-9]/.test(udp))[0])

     // const lastFirst = settings.names === 'last, first'
     const readWrite = settings.default === 'Read Only'

    return ( 
        <GeneralModal toggle={handleShowDetails}>
                    <div className="u-modal">
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
                                <p>Delete my personal library and account information</p>
                                <button onClick={() => handleAccountDeletion(userDetails[user])}>Delete</button>
                            </div>
                        </div>
                    </div>
                </GeneralModal>
     );
}

export default Settings;