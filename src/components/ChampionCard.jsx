import {Link} from "react-router-dom";
import '../css/ChampionCard.css'
export default function ChampionCard({champion}) {



    return <div className="champion-card">
            <Link to={`champion/${champion.id}`} className={`champion-card-link`} >
        <div >
            <img src={champion.icon} alt={champion.name}/>
                <h1 >{champion.name}</h1>
            </div>
        </Link>
    </div>
}