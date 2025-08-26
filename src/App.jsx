import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import ChampionPage from "./pages/ChampionPage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <NavBar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/champion/:id" element={<ChampionPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
