import { useContext, useEffect } from "react"
import { Context, SET_ROOMS, SET_USER } from '../context'
import { useNavigate } from "react-router-dom"

import UserService from '../services/UserService'
import RoomService from "../services/RoomService"

import React, { useState } from 'react'
import { loading, clearLoading } from "../services/utility"

function LoginAndRegister(props) {

    const { dispatch } = useContext(Context)

    let navigate = useNavigate()

    let [username, setUsername] = useState('')
    let [password, setPassword] = useState('')
    let [email, setEmail] = useState('')

    useEffect(() => {
        setUsername('')
        setEmail('')
        setPassword('')
    }, [props.which])

    const validate = (token) => {
        if (token && token.length < 50) {
            alert(token)
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

        loading('.home')

        if (props.which) {
            console.log('logging in...')
            
            token = await UserService.loginUser({ username, password })
            if (!validate(token)) return

            sessionStorage.setItem("token", token)

            let payload = await RoomService.getRoomsForUser(username)

            if (payload)
                dispatch({ type: SET_ROOMS, payload })
            
            setTimeout(() => navigate(`/room/${payload[0] ? payload[0].id : ''}`), 1)
        }
        else {
            console.log('registering...')
            token = await UserService.registerUser({ username, password, email })
            if (!validate(token)) return
            sessionStorage.setItem("token", token)
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
            <br />
            <label htmlFor='un-login'>Username</label>
            <br />
            <input id='un-login' value={username} onChange={(e) => setUsername(e.target.value)} />
            <br /><br />
            <label htmlFor='pw-login'>Password</label>
            <br />
            <input type="password" id='pw-login' value={password} onChange={(e) => setPassword(e.target.value)} />
            <br /><br />
            {!props.which && 
            <>
                <label htmlFor='em-register'>Email</label>
                <br />
                <input type="email" id='em-register' value={email} onChange={(e) => setEmail(e.target.value)} />
                <br /><br />
            </>}
            <button>{props.which ? "LOGIN" : "REGISTER"}</button>
        </form>
    );
}

export default LoginAndRegister;