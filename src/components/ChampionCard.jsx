import { Link } from "react-router-dom";
import "../css/ChampionCard.css";

export default function ChampionCard({ champion }) {
    return (
        <div className="champion-card">
            <Link
                to={`/champion/${champion.id}`}
                className="champion-card-link"
                title={champion.name}
            >
                <img className="champion-card-img" src={champion.icon} alt={champion.name} />
                <span className="champion-card-name">{champion.name}</span>
            </Link>
        </div>
    );
}
