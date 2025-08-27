import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChampion } from "../services/api";
import '../css/ChampionPage.css'
import NavBar from "../components/NavBar";

export default function ChampionPage() {
    const { id } = useParams();
    const [champion, setChampion] = useState(null);
    const [error, setError] = useState("");
    const cleanDescription=(desc)=> {
        return desc
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]+>/g, "");
    }

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setError("");
                const data = await getChampion(id);
                if (isMounted) setChampion(data);
            } catch (e) {
                if (isMounted) setError(e.message || "Failed to load champion");
            }
        })();
        return () => { isMounted = false; };
    }, [id]);

    if (error) return <div>Error: {error}</div>;
    if (!champion) return <div>Loading…</div>;

    return <div>
        <NavBar/>
        <h1 className="champion-description-title">{champion.name}</h1>
        <img src={champion.icon} alt={champion.name} width={96} height={96} />
        <p className="champion-description">
            {cleanDescription(champion.lore)}
        </p>

            <div className="passive-card">
                <img src={champion.passive.icon} alt={champion.passive.name} />
                <div className="passive-info">
                    <strong>Passive: {champion.passive.name}</strong>
                    <p>{cleanDescription(champion.passive.description)}</p>
                </div>
            </div>

            <h2 className="spells-title">Spells</h2>
            <div className="champion-spells">
                {champion.spells.map((spell) => (
                    <div key={spell.id} className="spell-card">
                        <img src={spell.icon} alt={spell.name} />
                        <div className="spell-info">
                            <strong>{spell.name}</strong>
                            <p>{cleanDescription(spell.description)}</p>
                            <p>Cooldown per level: {spell.cooldown.join(", ")}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
}
