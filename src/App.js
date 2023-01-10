import logo from './logo.svg';
import './App.css';
import PuzzleNavBar from './components/Navbar.js';
import PuzzleView from './components/PuzzleView.js'
import PuzzleContextProvider from './contexts/PuzzleContext';
import ProgressContextProvider from './contexts/ProgressContext';
import React from 'react';

/*
TODO:
input sanitization
hotkey for navigation
*/

function App() {
  return (
    <div>
      <PuzzleContextProvider>
        <ProgressContextProvider>
          <PuzzleNavBar/>
          <PuzzleView/>
        </ProgressContextProvider>
      </PuzzleContextProvider>
      {/* <div className="App">
        <header className="App-header">

          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to asdf.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}
    </div>
  );
}

export default App;
