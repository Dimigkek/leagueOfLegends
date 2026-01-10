import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './services/store';
import Home from "./pages/Home";
import ChampionPage from "./pages/ChampionPage";
import Game from "./pages/GamePage";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/champion/:id" element={<ChampionPage />} />
                        <Route path="/game" element={<Game />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </Provider>
    );
}

export default App;