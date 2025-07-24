import './App.css';
import Hand from './components/hand';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from './components/lobby';
import Game from './components/game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/games/:roomCode" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
