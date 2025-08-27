import {Link} from "react-router-dom";
import '../css/NavBar.css'
export default function NavBar() {
    return<nav className="navbar">
        <Link to="/" className="navbar-brand">Home</Link>
        <Link to="/game" className="navbar-brand">Play</Link>
    </nav>
}