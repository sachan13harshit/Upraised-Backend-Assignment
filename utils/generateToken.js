const names = [
    "The Phoenix",
    "The Chimera",
    "The Tempest",
    "The Seraphim",
    "The Leviathan",
    "The Griffin",
    "The Abysswalker",
    "The Basilisk",
    "The Specter",
    "The Valkyrie",
    "The Harbinger",
    "The Inferno",
    "The Eclipse",
    "The Sovereign",
    "The Whisperer",
    "The Mirage",
    "The Obsidian",
    "The Revenant",
    "The Sentinel",
    "The Vortex"
];

const generateToken = async () => {
    const randomName = names[Math.floor(Math.random() * names.length)];
    return `The ${randomName}`;
};

module.exports = {
    generateToken
};