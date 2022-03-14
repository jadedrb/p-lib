import React, { useContext } from 'react'
import { Context } from './context'
import './App.css';

import Rooms from './components/Rooms';
import Bookcases from './components/Bookcases';
import CurrentShelf from './components/CurrentShelf';

import { Routes, Route, Navigate } from 'react-router-dom'
import NewBook from './components/NewBook';

function App() {

  let { selected } = useContext(Context)

  // This app uses SpringJPA as backend - Workspace: /Users/JadeDRB/springboot

  return (
        <Routes>
          <Route path={"/"} element={<Navigate to={"/room/"} />} />
          <Route path={"/room/"} element={<Rooms />} />
          <Route path={"/room/:rid/*"} element={<Rooms />}>
            <Route path={"bookcase/:bcid/*"} element={<Bookcases />}>
              <Route path={"shelf/:shid/*"} element={<CurrentShelf />}>
                <Route path={"book/:bid"} element={selected.length ? null : <NewBook />} />
                <Route path={"book"} element={<NewBook />} />
              </Route>
            </Route>
          </Route>
          <Route path={"*"} element={<div>Page not found... whoops!</div>}/>
        </Routes>
  );
}

export default App;


/*

THINGS TO DO:

Bugs:

1. (DONE) Clicking a bookcase or shelf before saving it messes up path
2. Going to "/book/0000" or similar should revert back to "book"
3. If number is too long in Pages or Published there's an error (string related?)
4. Clicking Room should only reset everything if double-clicked
5. Does clicking Reset update again? 

Small potatos:

1. (DONE) Add a loading indicator (spinner)
2. (DONE) Make it so "1980s" or "300s" works in searches
3. Give result columns clickable headers that orders the results
4. Add a move bookcase and move books feature
5. (maybe) Double-clicking a result opens up the edit window 
6. (maybe) Create a "pinned" books page
7. Delete bulk (so you don't have to loop and do X number of delete requests) 
8. Default order (shelf options)
9. Turn id to Long in backend (for greater range of id's)

Big potatos:

1. Implement authentication in backend (tokens)
2. Figure out how to export and import database data (for backup purposes)
3. Deploy backend to Heroku and frontend to something faster (GitHub Pages?)

Other:

Search for const handlePathBackToRoom = () => navigate("/room/");
*/