import './App.css';
import { Provider } from './context';
import BookList from './components/BookList';
import Toolbar from './components/Toolbar';
import Rooms from './components/Rooms';
import Bookcases from './components/Bookcases';

function App() {

  // This app uses SpringJPA as backend - Workspace: /Users/JadeDRB/springboot

  return (
    <Provider>
      Personal Library

        <Rooms />
        <Bookcases />
        <Toolbar />
        <BookList />
        
    </Provider>
  );
}

export default App;
