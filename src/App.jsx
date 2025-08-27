import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import ChampionPage from "./pages/ChampionPage";
import LoldleClassic from "./pages/GamePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/champion/:id" element={<ChampionPage />} />
           <Route path="/game" element={<LoldleClassic />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
