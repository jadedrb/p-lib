import React, { useContext, useEffect, useRef } from 'react'
import { Context, SETUP_COMPLETE, SET_ROOMS, SET_USER, UPDATE_SETTINGS } from './context'
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

import { loading, clearLoading } from './services/utility'

function App() {

  let { selected, user, dispatch, setup, settings } = useContext(Context)

  let navigate = useNavigate()
  let navigateRef = useRef()
  let mounted = useRef()

  navigateRef.current = navigate

  useEffect(() => {
    const validate = async () => {
      let token = localStorage.getItem("token")

      if (token) {
        
        let user = await UserService.validateUserToken()

        if (user) {
    
          dispatch({
              type: SET_USER,
              payload: user
          })

          let payload = await RoomService.getRoomsForUser(user)
          let currentSettings = await UserService.getUserByName(user)

          if (currentSettings.other) {
            let other = JSON.parse(currentSettings.other)
            dispatch({
              type: UPDATE_SETTINGS,
              payload: { ...other, temp: other.default === "Read Only" ? "Read Only" : "Read/Write" }
            })
          }
            

          if (payload.length) {
            dispatch({ type: SET_ROOMS, payload })
            dispatch({ type: SETUP_COMPLETE })
            return
          }
        }
        else { // if user validation failed with current token
          localStorage.removeItem("token")
          dispatch({ type: SETUP_COMPLETE })
          return
        }
      } 
      dispatch({ type: SETUP_COMPLETE })
    }

    if (!mounted.current) {
      console.time('time')
      validate()
      mounted.current = true
      console.log('v1.14')

      if (document.querySelector('.rooms'))
        loading('.rooms', true)
      else if (document.querySelector('.load-spot'))
        loading('.load-spot', true)
      else 
        setTimeout(() => loading('.load-spot', true), 100)

      UserService
        .awaken()
        .then(r => {
          console.log('Server response: ' + r.data)
          let test = console.timeEnd('time')
          console.log(test)
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