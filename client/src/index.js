import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './components/store/UserStore';
import TaskStore from './components/store/TaskStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    user: new UserStore(),
    tasks: new TaskStore()
  }}>
     <App />
  </Context.Provider>

);