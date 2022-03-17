import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context, SET_ROOMS, SET_USER } from './context'
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

function App() {

  let { selected, user, dispatch } = useContext(Context)

  let [loading, setLoading] = useState(true)

  let navigate = useNavigate()
  let navigateRef = useRef()
  let mounted = useRef()

  navigateRef.current = navigate

  useEffect(() => {
    const validate = async () => {
      let token = sessionStorage.getItem("token")
      
      if (token) {
        console.log('...')
        let user = await UserService.validateUserToken()

        if (user) {
    
          dispatch({
              type: SET_USER,
              payload: user
          })

          let payload = await RoomService.getRoomsForUser(user)

          if (payload.length) {
            dispatch({ type: SET_ROOMS, payload })
            // navigateRef.current(`/room/${payload[0].id}`)
          }
        }
        else { // if user validation failed with current token
          sessionStorage.removeItem("token")
          setLoading(false)
        }
      } // if no token found
      else 
        setLoading(false)
    }

    if (!mounted.current) {
      validate()
      mounted.current = true
    }
    
  }, [dispatch])

  useEffect(() => {
    if (mounted.current) {
      if (user) {
        setLoading(false)
      }
    }
  }, [user])

  return (
        <Routes>
          <Route path={"/"} element={<Navigate to={"/home/"} />} />
          <Route path={"/home/"} element={!user ? <Home /> : <Navigate to={"/room/"} />} />
          <Route path={"/room/"} element={<PrivateRoute loading={loading} isAuth={user}><Rooms /></PrivateRoute>} />
          <Route path={"/room/:rid/*"} element={<PrivateRoute loading={loading} isAuth={user}><Rooms /></PrivateRoute>}>
            <Route path={"bookcase/:bcid/*"} element={<Bookcases />}>
              <Route path={"shelf/:shid/*"} element={<CurrentShelf />}>
                <Route path={"book/:bid"} element={selected.toggle ? null : <NewBook />} />
                <Route path={"book"} element={<NewBook />} />
              </Route>
            </Route>
          </Route>
          <Route path={"*"} element={!user && !loading ? <Navigate to={"/home/"} /> : <Navigate to={"/room/"} />}/>
        </Routes>
  );
}

export default App;


/*

THINGS TO DO:

Bugs:

1. (DONE) Clicking a bookcase or shelf before saving it messes up path
2. (DONE) Going to "/book/0000" or similar should revert back to "book"
3. If number is too long in Pages or Published there's an error (string related?)
5. Does clicking Reset update again? 
6. Going to “/room/“ doesn’t direct you to room 1 if you have one
7. Going to “/room/asfslasf” doesn’t direct you back anywhere
8. Adding and removing rooms doesn’t switch rooms like it should (instead resets to room 1 always)

Small potatos:

1. (DONE) Add a loading indicator (spinner)
2. (DONE) Make it so "1980s" or "300s" works in searches
3. (DONE) Give result columns clickable headers that orders the results
4. (DONE) Add a move bookcase and move books feature
5. (BUGGY) Double-clicking a result opens up the edit window 
6. (MAYBE) Create a "pinned" books page
7. (NO) Delete bulk (so you don't have to loop and do X number of delete requests) 
8. (DONE) Default order (shelf options)
9. (DONE) Turn id to Long in backend (for greater range of id's)

Big potatos:

1. (DONE) Implement authentication in backend (tokens)
1b. Only users with a relationship with the record they're trying to edit should be able to 
2. Figure out how to export and import database data (for backup purposes)
3. Deploy backend to Heroku and frontend to something faster (GitHub Pages?)

Other:

Search for const handlePathBackToRoom = () => navigate("/room/");
*/