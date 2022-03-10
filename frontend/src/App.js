import './App.css';

import Rooms from './components/Rooms';
import Bookcases from './components/Bookcases';
import CurrentShelf from './components/CurrentShelf';

import { Routes, Route, Navigate, Link } from 'react-router-dom'

function App() {

  // This app uses SpringJPA as backend - Workspace: /Users/JadeDRB/springboot

  return (
    <>
      Personal Library
        <Routes>
          <Route path={"/"} element={<Navigate to={"/room/"} />} />
          <Route path={"/room/"} element={<Rooms />} />
          <Route path={"/room/:rid/*"} element={<Rooms />}>
            <Route path={"bookcase/:bcid/*"} element={<Bookcases />}>
              <Route path={"shelf/:shid/*"} element={<CurrentShelf />}>
                <Route path={"book/:bid"} element={<CurrentShelf />} />
              </Route>
            </Route>
          </Route>
          <Route path={"*"} element={<div>Page not found... whoops!</div>}/>
        </Routes>
      </>
  );
}

export default App;


/*

THINGS TO DO:

Bugs:

1. (DONE) Clicking a bookcase or shelf before saving it messes up path

Small potatos:

1. (DONE) Add a loading indicator (spinner)
2. (DONE) Make it so "1980s" or "300s" works in searches
3. Give result columns clickable headers that orders the results
4. Add a move bookcase and move books feature
5. (maybe) Double-clicking a result opens up the edit window 
6. (maybe) Create a "pinned" books page

Big potatos:

1. Implement authentication in backend (tokens)
2. Figure out how to export and import database data (for backup purposes)

*/