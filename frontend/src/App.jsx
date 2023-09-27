import React, { useEffect, useRef } from 'react'
import { useLibContext, SETUP_COMPLETE, SET_ROOMS, SET_USER, UPDATE_SETTINGS } from './context'
import './App.css';

import Rooms from './components/Rooms';
import Bookcases from './components/Bookcases';
import CurrentShelf from './components/CurrentShelf';
import PrivateRoute from './components/PrivateRoute';

import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import NewBook from './components/NewBook';
import Home from './components/Home';

import UserService from './services/UserService';
import RoomService from './services/RoomService';

import { loading, clearLoading, A_WEEKS_TIME } from './services/utility'

function App() {

  let { selected, user, dispatch, setup, settings } = useLibContext()

  let navigate = useNavigate()
  let navigateRef = useRef()
  let mounted = useRef()

  navigateRef.current = navigate

  useEffect(() => {
    const validate = async () => {

      let token = localStorage.getItem("token")
      let time = localStorage.getItem("time")

      try {
  
        if ((new Date() - new Date(time)) > A_WEEKS_TIME) {
          token = false
          localStorage.removeItem("token")
          localStorage.removeItem("time")
        }
  
        if (token) {
          
          let user = await UserService.validateUserToken()
  
          if (user) {
  
            dispatch({
                type: SET_USER,
                payload: user
            })
              
            let currentSettings = await UserService.getUserByName(user)
  
            let other, localRooms;
  
            if (currentSettings.other) {
              other = JSON.parse(currentSettings.other)
              
              dispatch({
                type: UPDATE_SETTINGS,
                payload: { ...other, temp: other.default === "Read Only" ? "Read Only" : "Read/Write" }
              })
            }

            // get local rooms if they exist and setting for local is true
            if (other?.local === 'Yes') {
              localRooms = localStorage.getItem('rooms')
              localRooms = localRooms ? JSON.parse(localRooms) : false
              localRooms = Array.isArray(localRooms) && localRooms.length ? localRooms : false
            }
  
            // if nothing found then fetch as normal
            if (!localRooms) {
              console.log('fetching rooms data...')
              localRooms = await RoomService.getRoomsForUser()
  
              // if local is true then set localStorage after fetch
              if (other?.local === 'Yes') {
                localStorage.setItem('rooms', JSON.stringify(localRooms))
              }
  
              // otherwise local data was found so use it instead
            } else 
              console.log('retrieving local rooms data...')
            
            clearLoading()
            if (localRooms.length) {
              dispatch({ type: SET_ROOMS, payload: localRooms })
              dispatch({ type: SETUP_COMPLETE })
              return
            }
          }
          else { // if user validation failed with current token
            throw new Error('failed')
          }
        } 
        dispatch({ type: SETUP_COMPLETE })

      } catch(err) {

        if (err.message === 'failed') {
          localStorage.removeItem("token")
          localStorage.removeItem("rooms")
          localStorage.removeItem("time")
          console.log('failed')
        } else {
  
          let localData = localStorage.getItem('rooms')

          // should be a valid token and rooms in local storage for offline mode
          if (token && localData && typeof localData === 'string') {
            console.log('offline mode...')
            dispatch({ type: SET_USER, payload: 'to offline mode' })
            dispatch({ type: SET_ROOMS, payload: JSON.parse(localData) })
            dispatch({ type: SETUP_COMPLETE })
            dispatch({
              type: UPDATE_SETTINGS,
              payload: { temp: 'Read Only', offline: true }
            })
            setTimeout(() => clearLoading(), 201)
          }
        }

        console.log(err.message)
        dispatch({ type: SETUP_COMPLETE })
      }
    }

    if (!mounted.current) {
      console.time('time')
      validate()
      mounted.current = true
      console.log('v1.75')

      setTimeout(() => {
        if (document.querySelector('.rooms'))
          loading('.rooms', true)
        else if (document.querySelector('.load-spot'))
          loading('.load-spot', true)
        else 
          loading('.load-spot', true)
      }, 100)

      UserService
        .awaken()
        .then(r => {
          console.log('Server response: ' + r.data)
          console.timeEnd('time')
          
          if (document.querySelector('.home')) {
            setTimeout(() => clearLoading(), 200)
          }
        })
        .catch(_ => {
          console.log('server may be down...')
          setTimeout(() => clearLoading(), 200)
        }) 
        
    }

  }, [dispatch])

  return (
        <Routes>
          <Route path={"/home/"} element={!user ? <Home /> : <Navigate to={"/room/"} />} />
          <Route path={"/room/"} element={<PrivateRoute setup={setup} isAuth={user}><Rooms /></PrivateRoute>} />
          <Route path={"/room/:rid/*"} element={<PrivateRoute setup={setup} isAuth={user}><Rooms /></PrivateRoute>}>
            <Route path={"bookcase/:bcid/*"} element={<Bookcases />}>
              <Route path={"shelf/:shid/*"} element={<CurrentShelf />}>
                <Route path={"book/:bid"} element={selected.toggle ? null : <NewBook />} />
                {settings.temp !== "Read Only" && <Route path={"book"} element={<NewBook />} />}
              </Route>
            </Route>
          </Route>
          <Route path={"*"} element={!user && setup ? <Navigate to={"/home/"} /> : <Navigate to={"/room/"} />}/>
        </Routes>
  );
}

export default App;