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
        <Link to="/">Back to Home</Link>
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

1. Add buttons that hide editing abilities for each section (for those who just want to view)
2. Start implementing search features (search by specific section or in general)

*/