import ChampionCard from "../components/ChampionCard";
import {useState,useEffect} from "react";
import {getChampions} from "../services/api";
import '../css/Home.css'

export default function Home() {
    const [search, setSearch] = useState("");
    const [champion, setChampion] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

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

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }
    return <div className="champion-home">
            <title>Home</title>
            <h1 className="champion-lolt">League of Legends Champions</h1>
            <form onSubmit={handleSearch}>
            <input type="text" value={search} placeholder="Search for the Champion..." onChange={e => setSearch(e.target.value)}/>
            <button type="submit" >Search</button>
            </form>
            {error && <div>{error}</div>}
            {loading ? (<h1>Loading...</h1>)
                :(
                    <div className="champions-container">
                    {champion.map(
                        champion =>
                            champion.name.toLowerCase().startsWith(search) && (
                                <ChampionCard champion={champion} key={champion.id}/>
                            ))}
                </div>
            )}

        </div>
}