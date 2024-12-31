import { useEffect } from "react"
import { useLibContext, SET_INITIAL_STATE, SET_ROOMS, SET_USER, UPDATE_SETTINGS } from '../context'
import { useNavigate } from "react-router-dom"

import UserService from '../services/UserService'
import RoomService from "../services/RoomService"
import BookService from "../services/BookService"

import React, { useState } from 'react'
import { loading, clearLoading } from "../services/utility"

function LoginAndRegister(props) {

    const { dispatch } = useLibContext()

    let navigate = useNavigate()

    let [username, setUsername] = useState('')
    let [password, setPassword] = useState('')
    let [email, setEmail] = useState('')

    useEffect(() => {
        setUsername('')
        setEmail('')
        setPassword('')
    }, [props.which])

    useEffect(() => {
        dispatch({ type: SET_INITIAL_STATE })
    }, [dispatch])

    const validate = (token) => {
        if (token && token.length < 50) {
            setTimeout(() => alert(token), 100)
            return false
        }
        if (username.length < 3) {
            alert('Please enter a longer username (more than 2 characters)')
            return false
        } else if (password.length < 3) {
            alert('Please enter a longer password (more than 2 characters)')
            return false
        } 
        if (!props.which && email.length < 5) {
            alert('Please enter a longer email (more than 5 characters)')
            return false
        } 
        if (token?.response?.data?.error) {
            alert(token?.response?.data?.error)
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // for test or guest users
        if (username === 'testing') {
            loading('.home', 'maybe')
            console.log('test user detected...')
            let token = await UserService.loginUser({ username })
            localStorage.setItem("token", token)
            let room = await RoomService.getRoomsForUser('testing')
            console.log(room)
            dispatch({ type: SET_ROOMS, payload: [room] })
            dispatch({
                type: UPDATE_SETTINGS,
                payload: { temp: "Read Only", offline: true }
            })
            dispatch({
                type: SET_USER,
                payload: 'to testing mode'
            })
            localStorage.removeItem("token")
            setTimeout(() => alert('Welcome to testing mode! This is a preview, so features are limited here - but feel free to explore.'), 1000)
            return
        }

        if (!validate()) return

        let token;

        loading('.home', 'maybe')

        try {
            if (props.which) {
                console.log('logging in...')
                
                token = await UserService.loginUser({ username, password })
  
                if (!validate(token)) {
                    clearLoading()
                    return
                }
  
                localStorage.setItem("token", token)
                // localStorage.setItem("time", new Date())
    
                let payload = await RoomService.getRoomsForUser(username)
    
                let currentSettings = await UserService.getUserByName(username)
    
                if (currentSettings.other) {
                    let other = JSON.parse(currentSettings.other)
    
                    dispatch({
                      type: UPDATE_SETTINGS,
                      payload: { ...other, temp: other.default === "Read Only" ? "Read Only" : "Read/Write" }
                    })
    
                    // if local is true then set localStorage after fetch
                    if (other.local === 'Yes') {
                        localStorage.setItem('rooms', JSON.stringify(payload))
                        console.log('setting up local data after login...')
                        const [ lastUpdatedBookFromDb ] = await BookService.getLatest(1)
                        if (lastUpdatedBookFromDb)
                            localStorage.setItem('updated', lastUpdatedBookFromDb?.recorded_on)
                    }
                }
    
    
                if (payload)
                    dispatch({ type: SET_ROOMS, payload })
            
                // setTimeout(() => navigate(`/room/${payload[initialJumpIndex] ? payload[initialJumpIndex].id : ''}`), 1)
            }
            else {
    
                token = await UserService.registerUser({ username, password, email })
     
                if (!validate(token)) {
                    clearLoading()
                    return
                }
    
                localStorage.setItem("token", token)
                // localStorage.setItem("time", new Date())
                navigate("/room")
            }
    
            clearLoading()
    
            dispatch({
                type: SET_USER,
                payload: username
            })
        } catch(err) {
            console.log(err.message)
            clearLoading()
        }
    }

    return ( 
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="un-login">Username</label>
                <input 
                    id='un-login' 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    spellCheck={false}
                    autoComplete='username'
                />
            </div>
            <div>
                <label htmlFor="pw-login">Password</label>
                <input 
                    type="password" 
                    id='pw-login' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    autoComplete='current-password'
                />
            </div>
            {!props.which && 
            <>
                <div>
                    <label htmlFor="em-register">Email</label>
                    <input 
                        type="email" 
                        id='em-register' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        autoComplete='email'
                    />
                </div>
            </>}
            <button>{props.which ? "LOGIN" : "REGISTER"}</button>
        </form>
    );
}

export default LoginAndRegister;