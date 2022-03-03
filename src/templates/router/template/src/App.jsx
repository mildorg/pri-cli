import { Link } from 'react-router-dom';
import { Router } from './router';

import 'normalize.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router />
      <Link to="/home">Home</Link> | <Link to="/about">About</Link>
    </div>
  );
}

export default App;
