import { useEffect } from "react"
import { useLibContext, SET_INITIAL_STATE, SET_ROOMS, SET_USER, UPDATE_SETTINGS } from '../context'
import { useNavigate } from "react-router-dom"

import UserService from '../services/UserService'
import RoomService from "../services/RoomService"

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
        } else {
            return true
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return

        let token;

        loading('.home', 'maybe')

        if (props.which) {
            console.log('logging in...')
            
            token = await UserService.loginUser({ username, password })
           console.log('token:', token) 
            if (!validate(token)) {
                clearLoading()
                return
            }

            localStorage.setItem("token", token)
            localStorage.setItem("time", new Date())

            let payload = await RoomService.getRoomsForUser(username)

            let currentSettings = await UserService.getUserByName(username)

            if (currentSettings.other) {
                let other = JSON.parse(currentSettings.other)

                dispatch({
                  type: UPDATE_SETTINGS,
                  payload: { ...other, temp: other.default === "Read Only" ? "Read Only" : "Read/Write" }
                })
              }

            if (payload)
                dispatch({ type: SET_ROOMS, payload })
        
            // setTimeout(() => navigate(`/room/${payload[initialJumpIndex] ? payload[initialJumpIndex].id : ''}`), 1)
        }
        else {
            console.log('registering...')
            token = await UserService.registerUser({ username, password, email })
            
            if (!validate(token)) {
                clearLoading()
                return
            }

            localStorage.setItem("token", token)
            localStorage.setItem("time", new Date())
            navigate("/room")
        }

        clearLoading()

        dispatch({
            type: SET_USER,
            payload: username
        })
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
                />
            </div>
            <div>
                <label htmlFor="pw-login">Password</label>
                <input type="password" id='pw-login' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {!props.which && 
            <>
                <div>
                    <label htmlFor="em-register">Email</label>
                    <input type="email" id='em-register' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </>}
            <button>{props.which ? "LOGIN" : "REGISTER"}</button>
        </form>
    );
}

export default LoginAndRegister;