import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChampion } from "../services/api";
import '../css/ChampionPage.css'

export default function ChampionPage() {
    const { id } = useParams();
    const [champion, setChampion] = useState(null);
    const [error, setError] = useState("");

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

    return (
        <div>
            <h1 className="champion-description">{champion.name}</h1>
            <img src={champion.icon} alt={champion.name} width={96} height={96} />
            <p className="champion-description">{champion.lore}</p>
            <p className="champion-passive">Passive:{champion.passive.name}{champion.passive.description}</p>
            <p className="champion-description">Spells:</p>
            <div className="champion-spells">
                {champion.spells.map(spell => (
                    <div key={spell.id} className="spell-card">
                        <img src={spell.icon} alt={spell.name} />
                        <div className="spell-info">
                            <strong>{spell.name}</strong>
                            <div dangerouslySetInnerHTML={{ __html: spell.description }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
