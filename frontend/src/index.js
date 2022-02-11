import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from './context';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


/*

THINGS TO DO : 
- Make shelves in a bookcase highlight when selected
- Adjust the NewEntryField component to work with the current setup


*/