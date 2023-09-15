import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { Provider } from './context';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
      <Provider>
        <Router>
          <App />
        </Router>
      </Provider>
)
