const BASE_URL = 'https://ddragon.leagueoflegends.com';

export const getChampions = async () => {
    const latestVersion = await getLatestVersion();
    const response = await fetch(`${BASE_URL}/cdn/${latestVersion}/data/en_US/champion.json`);
    const data = await response.json();
    return Object.values(data.data).map(champion => ({
        ...champion,
        icon: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champion.id}.png`
    }));
}

export const getLatestVersion = async () => {
    const response = await fetch(`${BASE_URL}/api/versions.json`);
    const data = await response.json();
    return data[0];
}

export const getChampion = async (id) => {
    const version = await getLatestVersion();

    const res = await fetch(`${BASE_URL}/cdn/${version}/data/en_US/champion/${id}.json`);
    if (!res.ok) throw new Error(`Champion ${id} not found`);

    const payload = await res.json();
    const champ = payload?.data?.[id] ?? Object.values(payload?.data || {})[0];
    if (!champ) throw new Error(`Champion ${id} missing in payload`);


    champ.icon   = `${BASE_URL}/cdn/${version}/img/champion/${champ.image.full}`;
    champ.splash = `${BASE_URL}/cdn/img/champion/splash/${id}_0.jpg`;
    champ.version = version;


    champ.passive.icon = `${BASE_URL}/cdn/img/passive/${champ.passive.image.full}`;
    champ.spells = champ.spells.map(s => ({
        ...s,
        icon: `${BASE_URL}/cdn/${version}/img/spell/${s.image.full}`
    }));

    return champ;
}
