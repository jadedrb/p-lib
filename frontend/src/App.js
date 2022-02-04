import './App.css';
import { Provider } from './context';
// import BookList from './components/BookList';
// import Toolbar from './components/Toolbar';
import Rooms from './components/Rooms';
import Bookcases from './components/Bookcases';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'

function App() {

  // This app uses SpringJPA as backend - Workspace: /Users/JadeDRB/springboot

  return (
    <Provider>
      Personal Library
      <Router>
        <Link to="/">Back to Home</Link>
        <Routes>
          <Route path={"/"} element={<Navigate to={"/room/"} />} />
          <Route path={"/room/"} element={<Rooms />}>
            <Route path={":rid"}>
              <Route path={"bookcase"}>
                <Route path={":bcid/*"} element={<Bookcases />} />
              </Route>
            </Route>
          </Route>
          {/* <Route path={"/room/:rid/bookcase/*"} element={<Bookcases />} /> */}
          {/* <Route path={"/room/:rid/*"} element={<Rooms />} /> */}
          
          {/* <Rooms />
          <Bookcases />
          <Toolbar />
          <BookList /> */}
        </Routes>
      </Router>

    </Provider>
  );
}

export default App;
