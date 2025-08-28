import ChampionCard from "../components/ChampionCard";
import {useState,useEffect} from "react";
import {getChampions,getRiftImage} from "../services/api";
import '../css/Home.css'
import {Link} from "react-router-dom";

export default function Home() {
    const [search, setSearch] = useState("");
    const [champion, setChampion] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [rift, setRift] = useState("");

    useEffect(() => {
        (async () => {
            try{
            const url = await getRiftImage();
            setRift(url);}catch (e) {

            }
        })();
    }, []);

    useEffect(()=>{
        const loadChampions = async () => {
            try{
                const data = await getChampions();
                setChampion(data);
            } catch (error) {
                console.log(error);
                setChampion([])
                setError("Failed to load Champions, please try again later");
            }finally {
                setLoading(false);
            }
        }
        loadChampions()
    },[])

    return <div className="champion-home">
            <title>Home</title>
        <h1 className="champion-lolt display-2 fw-bold text-uppercase">
            League of Legends Champions
        </h1>
        <div className="hero">
            <Link to="/game" className="play-btn">Play</Link>
        </div>
            <form>
            <input type="text" className="search-input" value={search} placeholder="Search for the Champion..." onChange={e => setSearch(e.target.value)}/>

            </form>
            <div className="champion-box">
            {error && <div>{error}</div>}
            {loading ? (<h1 className="loading">Loading...</h1>)
                :(
                    <div className="champions-container" style={rift ? { ["--rift"]: `url(${rift})` } : undefined}>
                    {champion.map(
                        champion =>
                            champion.name.toLowerCase().startsWith(search.trim().toLowerCase()) && (
                                <ChampionCard champion={champion} key={champion.id}/>
                            ))}
                </div>
            )}
            </div>
        </div>
}