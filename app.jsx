/* global React, ReactDOM */
const { useEffect, useMemo, useRef, useState } = React;

/* ============================================================
   VGC META BLITZ — Pokémon Champions meta study tool
   · Spaced-repetition flashcards (Anki-style 4-tier grading)
   · Quiz games: moves >30%, items >10%, weaknesses, resists,
     ability multiple choice, offense/defense profiles
   · Speed matchups: 1v1 duels & 2v2 turn order w/ hard mode
   Data: loads ./data.json (refreshed nightly by GitHub Action);
   falls back to the embedded snapshot in chat-artifact mode.
   ============================================================ */

const FALLBACK = {
 "generated": "2026-07-09",
 "note": "Snapshot from Pikalytics. Refreshed nightly by GitHub Action once deployed. Percentages and Reg M-A appear after the first automated pull.",
 "formats": [
  {
   "id": "champions-current",
   "game": "Pokémon Champions",
   "label": "Reg M-B (current)",
   "slug": "champions",
   "hasNatures": true,
   "hasWinrate": true,
   "source": "Pikalytics ranked battle data · Champions Reg M-B S3",
   "noteText": "Stats shown are base-form values — Megas change stats in battle.",
   "mons": [
    {
     "rank": 1,
     "name": "Garchomp",
     "types": [
      "dragon",
      "ground"
     ],
     "winrate": 51.4,
     "stats": {
      "hp": 108,
      "atk": 130,
      "def": 95,
      "spa": 80,
      "spd": 85,
      "spe": 102
     },
     "moves": [
      "Dragon Claw",
      "Rock Slide",
      "Earthquake",
      "Protect",
      "Stomping Tantrum",
      "Poison Jab"
     ],
     "items": [
      "Life Orb",
      "Sitrus Berry",
      "Choice Scarf",
      "Roseli Berry",
      "Soft Sand"
     ],
     "abilities": [
      "Rough Skin",
      "Sand Veil"
     ],
     "megas": [
      {
       "name": "Mega Garchomp",
       "slug": "garchomp-mega",
       "types": [
        "dragon",
        "ground"
       ],
       "stats": {
        "hp": 108,
        "atk": 170,
        "def": 115,
        "spa": 120,
        "spd": 95,
        "spe": 92
       },
       "ability": "Sand Force"
      }
     ]
    },
    {
     "rank": 2,
     "name": "Sinistcha",
     "types": [
      "grass",
      "ghost"
     ],
     "winrate": 50.0,
     "stats": {
      "hp": 71,
      "atk": 60,
      "def": 106,
      "spa": 121,
      "spd": 80,
      "spe": 70
     },
     "moves": [
      "Rage Powder",
      "Matcha Gotcha",
      "Life Dew",
      "Trick Room",
      "Protect",
      "Strength Sap"
     ],
     "items": [
      "Sitrus Berry",
      "Kasib Berry",
      "Colbur Berry",
      "Leftovers",
      "Coba Berry"
     ],
     "abilities": [
      "Hospitality",
      "Heatproof"
     ]
    },
    {
     "rank": 3,
     "name": "Basculegion",
     "types": [
      "water",
      "ghost"
     ],
     "winrate": 53.6,
     "stats": {
      "hp": 120,
      "atk": 112,
      "def": 65,
      "spa": 80,
      "spd": 75,
      "spe": 78
     },
     "moves": [
      "Last Respects",
      "Aqua Jet",
      "Wave Crash",
      "Protect",
      "Flip Turn",
      "Liquidation"
     ],
     "items": [
      "Choice Scarf",
      "Mystic Water",
      "Focus Sash",
      "Life Orb",
      "Sitrus Berry"
     ],
     "abilities": [
      "Adaptability",
      "Swift Swim",
      "Mold Breaker"
     ]
    },
    {
     "rank": 4,
     "name": "Whimsicott",
     "types": [
      "grass",
      "fairy"
     ],
     "winrate": 51.8,
     "stats": {
      "hp": 60,
      "atk": 67,
      "def": 85,
      "spa": 77,
      "spd": 75,
      "spe": 116
     },
     "moves": [
      "Tailwind",
      "Moonblast",
      "Encore",
      "Protect",
      "Charm",
      "Sunny Day"
     ],
     "items": [
      "Focus Sash",
      "Fairy Feather",
      "Mental Herb",
      "Coba Berry",
      "Sitrus Berry"
     ],
     "abilities": [
      "Prankster",
      "Chlorophyll",
      "Infiltrator"
     ]
    },
    {
     "rank": 5,
     "name": "Kingambit",
     "types": [
      "dark",
      "steel"
     ],
     "winrate": 55.3,
     "stats": {
      "hp": 100,
      "atk": 135,
      "def": 120,
      "spa": 60,
      "spd": 85,
      "spe": 50
     },
     "moves": [
      "Sucker Punch",
      "Kowtow Cleave",
      "Iron Head",
      "Protect",
      "Low Kick",
      "Swords Dance"
     ],
     "items": [
      "Chople Berry",
      "Black Glasses",
      "Focus Sash",
      "Life Orb",
      "Occa Berry"
     ],
     "abilities": [
      "Defiant",
      "Supreme Overlord"
     ]
    },
    {
     "rank": 6,
     "name": "Staraptor",
     "types": [
      "normal",
      "flying"
     ],
     "winrate": 44.7,
     "stats": {
      "hp": 85,
      "atk": 120,
      "def": 70,
      "spa": 50,
      "spd": 60,
      "spe": 100
     },
     "moves": [
      "Close Combat",
      "Protect",
      "Brave Bird",
      "Roost",
      "Dual Wingbeat",
      "Tailwind"
     ],
     "items": [
      "Staraptite",
      "Choice Scarf",
      "Life Orb",
      "Sitrus Berry"
     ],
     "abilities": [
      "Intimidate",
      "Reckless"
     ]
    },
    {
     "rank": 7,
     "name": "Incineroar",
     "types": [
      "fire",
      "dark"
     ],
     "winrate": 51.8,
     "stats": {
      "hp": 95,
      "atk": 115,
      "def": 90,
      "spa": 80,
      "spd": 90,
      "spe": 60
     },
     "moves": [
      "Fake Out",
      "Parting Shot",
      "Flare Blitz",
      "Throat Chop",
      "Darkest Lariat",
      "Protect"
     ],
     "items": [
      "Sitrus Berry",
      "Chople Berry",
      "Passho Berry",
      "Leftovers",
      "Charcoal"
     ],
     "abilities": [
      "Intimidate",
      "Blaze"
     ]
    },
    {
     "rank": 8,
     "name": "Charizard",
     "types": [
      "fire",
      "flying"
     ],
     "winrate": 53.4,
     "stats": {
      "hp": 78,
      "atk": 84,
      "def": 78,
      "spa": 109,
      "spd": 85,
      "spe": 100
     },
     "moves": [
      "Protect",
      "Heat Wave",
      "Solar Beam",
      "Weather Ball",
      "Air Slash",
      "Dragon Dance"
     ],
     "items": [
      "Charizardite Y",
      "Charizardite X",
      "Focus Sash",
      "Life Orb",
      "Charcoal"
     ],
     "abilities": [
      "Blaze",
      "Solar Power"
     ],
     "megas": [
      {
       "name": "Mega Charizard X",
       "slug": "charizard-mega-x",
       "types": [
        "fire",
        "dragon"
       ],
       "stats": {
        "hp": 78,
        "atk": 130,
        "def": 111,
        "spa": 130,
        "spd": 85,
        "spe": 100
       },
       "ability": "Tough Claws"
      },
      {
       "name": "Mega Charizard Y",
       "slug": "charizard-mega-y",
       "types": [
        "fire",
        "flying"
       ],
       "stats": {
        "hp": 78,
        "atk": 104,
        "def": 78,
        "spa": 159,
        "spd": 115,
        "spe": 100
       },
       "ability": "Drought"
      }
     ]
    },
    {
     "rank": 9,
     "name": "Raichu",
     "types": [
      "electric"
     ],
     "winrate": 44.4,
     "stats": {
      "hp": 60,
      "atk": 90,
      "def": 55,
      "spa": 90,
      "spd": 80,
      "spe": 110
     },
     "moves": [
      "Fake Out",
      "Protect",
      "Zap Cannon",
      "Focus Blast",
      "Volt Switch",
      "Charm"
     ],
     "items": [
      "Raichunite Y",
      "Raichunite X",
      "Focus Sash",
      "Shuca Berry",
      "Magnet"
     ],
     "abilities": [
      "Lightning Rod",
      "Static"
     ]
    },
    {
     "rank": 10,
     "name": "Pelipper",
     "types": [
      "water",
      "flying"
     ],
     "winrate": 50.0,
     "stats": {
      "hp": 60,
      "atk": 50,
      "def": 100,
      "spa": 95,
      "spd": 70,
      "spe": 65
     },
     "moves": [
      "Hurricane",
      "Weather Ball",
      "Tailwind",
      "Wide Guard",
      "Protect",
      "Muddy Water"
     ],
     "items": [
      "Focus Sash",
      "Sitrus Berry",
      "Damp Rock",
      "Choice Scarf",
      "Life Orb"
     ],
     "abilities": [
      "Drizzle",
      "Keen Eye"
     ]
    },
    {
     "rank": 11,
     "name": "Sneasler",
     "types": [
      "fighting",
      "poison"
     ],
     "winrate": 52.2,
     "stats": {
      "hp": 80,
      "atk": 130,
      "def": 60,
      "spa": 40,
      "spd": 80,
      "spe": 120
     },
     "moves": [
      "Close Combat",
      "Fake Out",
      "Dire Claw",
      "Protect",
      "Coaching",
      "Rock Slide"
     ],
     "items": [
      "White Herb",
      "Focus Sash",
      "Sitrus Berry",
      "Lum Berry",
      "Life Orb"
     ],
     "abilities": [
      "Unburden",
      "Poison Touch",
      "Pressure"
     ]
    },
    {
     "rank": 12,
     "name": "Archaludon",
     "types": [
      "steel",
      "dragon"
     ],
     "winrate": 51.1,
     "stats": {
      "hp": 90,
      "atk": 105,
      "def": 130,
      "spa": 125,
      "spd": 65,
      "spe": 85
     },
     "moves": [
      "Electro Shot",
      "Flash Cannon",
      "Protect",
      "Dragon Pulse",
      "Draco Meteor",
      "Aura Sphere"
     ],
     "items": [
      "Leftovers",
      "Choice Scarf",
      "White Herb",
      "Chople Berry",
      "Sitrus Berry"
     ],
     "abilities": [
      "Stamina",
      "Sturdy",
      "Stalwart"
     ]
    },
    {
     "rank": 13,
     "name": "Grimmsnarl",
     "types": [
      "dark",
      "fairy"
     ],
     "winrate": 47.5,
     "stats": {
      "hp": 95,
      "atk": 120,
      "def": 65,
      "spa": 95,
      "spd": 75,
      "spe": 60
     },
     "moves": [
      "Light Screen",
      "Parting Shot",
      "Reflect",
      "Spirit Break",
      "Fake Out",
      "Scary Face"
     ],
     "items": [
      "Light Clay",
      "Roseli Berry",
      "Sitrus Berry",
      "Leftovers",
      "Focus Sash"
     ],
     "abilities": [
      "Prankster",
      "Frisk",
      "Pickpocket"
     ]
    },
    {
     "rank": 14,
     "name": "Sylveon",
     "types": [
      "fairy"
     ],
     "winrate": 50.7,
     "stats": {
      "hp": 95,
      "atk": 65,
      "def": 65,
      "spa": 110,
      "spd": 130,
      "spe": 60
     },
     "moves": [
      "Hyper Voice",
      "Quick Attack",
      "Hyper Beam",
      "Detect",
      "Protect",
      "Moonblast"
     ],
     "items": [
      "Fairy Feather",
      "Life Orb",
      "Sitrus Berry",
      "Leftovers",
      "Choice Scarf"
     ],
     "abilities": [
      "Pixilate",
      "Cute Charm"
     ]
    },
    {
     "rank": 15,
     "name": "Swampert",
     "types": [
      "water",
      "ground"
     ],
     "winrate": 50.6,
     "stats": {
      "hp": 100,
      "atk": 110,
      "def": 90,
      "spa": 85,
      "spd": 90,
      "spe": 60
     },
     "moves": [
      "Protect",
      "Wave Crash",
      "Earthquake",
      "Ice Punch",
      "High Horsepower",
      "Rock Slide"
     ],
     "items": [
      "Swampertite",
      "Life Orb",
      "Rindo Berry",
      "Sitrus Berry",
      "Leftovers"
     ],
     "abilities": [
      "Torrent",
      "Damp"
     ],
     "megas": [
      {
       "name": "Mega Swampert",
       "slug": "swampert-mega",
       "types": [
        "water",
        "ground"
       ],
       "stats": {
        "hp": 100,
        "atk": 150,
        "def": 110,
        "spa": 95,
        "spd": 110,
        "spe": 70
       },
       "ability": "Swift Swim"
      }
     ]
    },
    {
     "rank": 16,
     "name": "Metagross",
     "types": [
      "steel",
      "psychic"
     ],
     "winrate": 48.5,
     "stats": {
      "hp": 80,
      "atk": 135,
      "def": 130,
      "spa": 95,
      "spd": 90,
      "spe": 70
     },
     "moves": [
      "Protect",
      "Psychic Fangs",
      "Iron Head",
      "Bullet Punch",
      "Stomping Tantrum",
      "Meteor Mash"
     ],
     "items": [
      "Metagrossite",
      "Life Orb",
      "Metal Coat",
      "Leftovers",
      "Sitrus Berry"
     ],
     "abilities": [
      "Clear Body",
      "Light Metal"
     ],
     "megas": [
      {
       "name": "Mega Metagross",
       "slug": "metagross-mega",
       "types": [
        "steel",
        "psychic"
       ],
       "stats": {
        "hp": 80,
        "atk": 145,
        "def": 150,
        "spa": 105,
        "spd": 110,
        "spe": 110
       },
       "ability": "Tough Claws"
      }
     ]
    },
    {
     "rank": 17,
     "name": "Farigiraf",
     "types": [
      "normal",
      "psychic"
     ],
     "winrate": 50.2,
     "stats": {
      "hp": 120,
      "atk": 90,
      "def": 70,
      "spa": 110,
      "spd": 70,
      "spe": 60
     },
     "moves": [
      "Trick Room",
      "Psychic",
      "Helping Hand",
      "Protect",
      "Thunderbolt",
      "Hyper Voice"
     ],
     "items": [
      "Sitrus Berry",
      "Colbur Berry",
      "Mental Herb",
      "Focus Sash",
      "Leftovers"
     ],
     "abilities": [
      "Armor Tail",
      "Cud Chew",
      "Sap Sipper"
     ]
    },
    {
     "rank": 18,
     "name": "Floette-Eternal",
     "types": [
      "fairy"
     ],
     "winrate": 55.7,
     "stats": {
      "hp": 74,
      "atk": 65,
      "def": 67,
      "spa": 125,
      "spd": 128,
      "spe": 92
     },
     "moves": [
      "Protect",
      "Dazzling Gleam",
      "Moonblast",
      "Light of Ruin",
      "Calm Mind",
      "Draining Kiss"
     ],
     "items": [
      "Floettite",
      "Life Orb",
      "Fairy Feather",
      "Choice Scarf"
     ],
     "abilities": [
      "Flower Veil",
      "Symbiosis"
     ]
    },
    {
     "rank": 19,
     "name": "Gholdengo",
     "types": [
      "steel",
      "ghost"
     ],
     "winrate": 48.4,
     "stats": {
      "hp": 87,
      "atk": 60,
      "def": 95,
      "spa": 133,
      "spd": 91,
      "spe": 84
     },
     "moves": [
      "Make It Rain",
      "Shadow Ball",
      "Protect",
      "Nasty Plot",
      "Power Gem",
      "Trick"
     ],
     "items": [
      "Life Orb",
      "Choice Scarf",
      "Metal Coat",
      "Leftovers",
      "White Herb"
     ],
     "abilities": [
      "Good as Gold"
     ]
    },
    {
     "rank": 20,
     "name": "Aerodactyl",
     "types": [
      "rock",
      "flying"
     ],
     "winrate": 50.0,
     "stats": {
      "hp": 80,
      "atk": 105,
      "def": 65,
      "spa": 60,
      "spd": 75,
      "spe": 130
     },
     "moves": [
      "Rock Slide",
      "Tailwind",
      "Dual Wingbeat",
      "Protect",
      "Wide Guard",
      "Ice Fang"
     ],
     "items": [
      "Aerodactylite",
      "Focus Sash",
      "Passho Berry",
      "Life Orb",
      "Wide Lens"
     ],
     "abilities": [
      "Unnerve",
      "Pressure",
      "Rock Head"
     ],
     "megas": [
      {
       "name": "Mega Aerodactyl",
       "slug": "aerodactyl-mega",
       "types": [
        "rock",
        "flying"
       ],
       "stats": {
        "hp": 80,
        "atk": 135,
        "def": 85,
        "spa": 70,
        "spd": 95,
        "spe": 150
       },
       "ability": "Tough Claws"
      }
     ]
    },
    {
     "rank": 21,
     "name": "Maushold",
     "types": [
      "normal"
     ],
     "winrate": 50.1,
     "stats": {
      "hp": 74,
      "atk": 75,
      "def": 70,
      "spa": 65,
      "spd": 75,
      "spe": 111
     },
     "moves": [
      "Follow Me",
      "Protect",
      "Super Fang",
      "Population Bomb",
      "Beat Up",
      "Encore"
     ],
     "items": [
      "Chople Berry",
      "Wide Lens",
      "Focus Sash",
      "Sitrus Berry",
      "Mental Herb"
     ],
     "abilities": [
      "Friend Guard",
      "Technician",
      "Cheek Pouch"
     ]
    },
    {
     "rank": 22,
     "name": "Annihilape",
     "types": [
      "fighting",
      "ghost"
     ],
     "winrate": 43.9,
     "stats": {
      "hp": 110,
      "atk": 115,
      "def": 80,
      "spa": 50,
      "spd": 90,
      "spe": 90
     },
     "moves": [
      "Rage Fist",
      "Protect",
      "Drain Punch",
      "Bulk Up",
      "Close Combat",
      "Coaching"
     ],
     "items": [
      "Leftovers",
      "Sitrus Berry",
      "Choice Scarf",
      "Focus Sash",
      "Roseli Berry"
     ],
     "abilities": [
      "Defiant",
      "Inner Focus",
      "Vital Spirit"
     ]
    },
    {
     "rank": 23,
     "name": "Sableye",
     "types": [
      "dark",
      "ghost"
     ],
     "winrate": 45.7,
     "stats": {
      "hp": 50,
      "atk": 75,
      "def": 75,
      "spa": 65,
      "spd": 65,
      "spe": 50
     },
     "moves": [
      "Rain Dance",
      "Light Screen",
      "Encore",
      "Reflect",
      "Will-O-Wisp",
      "Disable"
     ],
     "items": [
      "Roseli Berry",
      "Light Clay",
      "Sitrus Berry",
      "Focus Sash",
      "Leftovers"
     ],
     "abilities": [
      "Prankster",
      "Stall"
     ],
     "megas": [
      {
       "name": "Mega Sableye",
       "slug": "sableye-mega",
       "types": [
        "dark",
        "ghost"
       ],
       "stats": {
        "hp": 50,
        "atk": 85,
        "def": 125,
        "spa": 85,
        "spd": 115,
        "spe": 20
       },
       "ability": "Magic Bounce"
      }
     ]
    },
    {
     "rank": 24,
     "name": "Mawile",
     "types": [
      "steel",
      "fairy"
     ],
     "winrate": 47.8,
     "stats": {
      "hp": 50,
      "atk": 85,
      "def": 85,
      "spa": 55,
      "spd": 55,
      "spe": 50
     },
     "moves": [
      "Play Rough",
      "Sucker Punch",
      "Protect",
      "Iron Head",
      "Swords Dance",
      "Rock Slide"
     ],
     "items": [
      "Mawilite"
     ],
     "abilities": [
      "Intimidate",
      "Hyper Cutter",
      "Sheer Force"
     ],
     "megas": [
      {
       "name": "Mega Mawile",
       "slug": "mawile-mega",
       "types": [
        "steel",
        "fairy"
       ],
       "stats": {
        "hp": 50,
        "atk": 105,
        "def": 125,
        "spa": 55,
        "spd": 95,
        "spe": 50
       },
       "ability": "Huge Power"
      }
     ]
    },
    {
     "rank": 25,
     "name": "Ninetales-Alola",
     "types": [
      "ice",
      "fairy"
     ],
     "winrate": 49.5,
     "stats": {
      "hp": 73,
      "atk": 67,
      "def": 75,
      "spa": 81,
      "spd": 100,
      "spe": 109
     },
     "moves": [
      "Blizzard",
      "Protect",
      "Freeze-Dry",
      "Aurora Veil",
      "Moonblast",
      "Encore"
     ],
     "items": [
      "Light Clay",
      "Focus Sash",
      "Choice Scarf",
      "Never-Melt Ice",
      "Life Orb"
     ],
     "abilities": [
      "Snow Warning",
      "Snow Cloak"
     ]
    }
   ],
   "moveData": {
    "Air Slash": {
     "power": 75,
     "class": "special",
     "type": "flying"
    },
    "Aqua Jet": {
     "power": 40,
     "class": "physical",
     "type": "water"
    },
    "Blizzard": {
     "power": 110,
     "class": "special",
     "type": "ice"
    },
    "Brave Bird": {
     "power": 120,
     "class": "physical",
     "type": "flying"
    },
    "Bullet Punch": {
     "power": 40,
     "class": "physical",
     "type": "steel"
    },
    "Close Combat": {
     "power": 120,
     "class": "physical",
     "type": "fighting"
    },
    "Dazzling Gleam": {
     "power": 80,
     "class": "special",
     "type": "fairy"
    },
    "Dragon Claw": {
     "power": 80,
     "class": "physical",
     "type": "dragon"
    },
    "Dragon Pulse": {
     "power": 85,
     "class": "special",
     "type": "dragon"
    },
    "Drain Punch": {
     "power": 75,
     "class": "physical",
     "type": "fighting"
    },
    "Draining Kiss": {
     "power": 50,
     "class": "special",
     "type": "fairy"
    },
    "Earthquake": {
     "power": 100,
     "class": "physical",
     "type": "ground"
    },
    "Flare Blitz": {
     "power": 120,
     "class": "physical",
     "type": "fire"
    },
    "Freeze-Dry": {
     "power": 70,
     "class": "special",
     "type": "ice"
    },
    "Heat Wave": {
     "power": 95,
     "class": "special",
     "type": "fire"
    },
    "Hurricane": {
     "power": 110,
     "class": "special",
     "type": "flying"
    },
    "Iron Head": {
     "power": 80,
     "class": "physical",
     "type": "steel"
    },
    "Kowtow Cleave": {
     "power": 85,
     "class": "physical",
     "type": "dark"
    },
    "Liquidation": {
     "power": 85,
     "class": "physical",
     "type": "water"
    },
    "Make It Rain": {
     "power": 120,
     "class": "special",
     "type": "steel"
    },
    "Moonblast": {
     "power": 95,
     "class": "special",
     "type": "fairy"
    },
    "Play Rough": {
     "power": 90,
     "class": "physical",
     "type": "fairy"
    },
    "Poison Jab": {
     "power": 80,
     "class": "physical",
     "type": "poison"
    },
    "Protect": {
     "power": null,
     "class": "status",
     "type": "normal"
    },
    "Psychic": {
     "power": 90,
     "class": "special",
     "type": "psychic"
    },
    "Rock Slide": {
     "power": 75,
     "class": "physical",
     "type": "rock"
    },
    "Shadow Ball": {
     "power": 80,
     "class": "special",
     "type": "ghost"
    },
    "Solar Beam": {
     "power": 120,
     "class": "special",
     "type": "grass"
    },
    "Spirit Break": {
     "power": 75,
     "class": "physical",
     "type": "fairy"
    },
    "Stomping Tantrum": {
     "power": 75,
     "class": "physical",
     "type": "ground"
    },
    "Sucker Punch": {
     "power": 70,
     "class": "physical",
     "type": "dark"
    },
    "Swords Dance": {
     "power": null,
     "class": "status",
     "type": "normal"
    },
    "Throat Chop": {
     "power": 80,
     "class": "physical",
     "type": "dark"
    },
    "Thunderbolt": {
     "power": 90,
     "class": "special",
     "type": "electric"
    },
    "Volt Switch": {
     "power": 70,
     "class": "special",
     "type": "electric"
    },
    "Wave Crash": {
     "power": 120,
     "class": "physical",
     "type": "water"
    },
    "Weather Ball": {
     "power": 50,
     "class": "special",
     "type": "normal"
    }
   }
  }
 ]
};
const APP_VERSION = "v15 · 2026-07-25";

const SRS = {
  GRADUATE_STEPS: 2,
  MASTERY_TARGET: 2,   // correct answers needed to clear a card in mastery mode
  GAPS: { again: 2, hard: 5, good: 10, easy: 14 },
  JITTER: 2,
};
const DUEL_TARGETS = [5, 10, 15, 25];
const MIXED_GAP = 10; // |stat difference| at or under this = mixed/balanced

const TYPE_COLORS = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD", unknown: "#8A8DA8",
};

/* Attacking type -> defending type multipliers (Gen 9 chart). */
const TYPE_CHART = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
};
const ALL_TYPES = Object.keys(TYPE_CHART);
function defenseMult(atkType, defTypes) {
  let m = 1;
  defTypes.forEach(d => {
    const v = TYPE_CHART[atkType][d];
    m *= (v === undefined ? 1 : v);
  });
  return m;
}
const multLabel = (m) =>
  m === 0 ? "×0" : m === 0.25 ? "×¼" : m === 0.5 ? "×½" : m === 2 ? "×2" : m === 4 ? "×4" : "—";

/* ---- Pokepaste (Pokémon Showdown export) import ----
   Parses the standard export syntax, e.g.

     Chompy (Garchomp) (M) @ Life Orb
     Ability: Rough Skin
     Level: 50
     Tera Type: Steel
     EVs: 252 Atk / 4 SpD / 252 Spe
     Adamant Nature
     - Dragon Claw
     - Earthquake

   EVs arrive on either scale: classic 0–252 (Showdown) or Champions 0–32.
   252 classic EVs and 32 Champions EVs both equal +32 stat points at L50,
   so classic values are converted with round(ev / 8). */
const EV_STAT_MAP = {
  hp: "hp", atk: "atk", attack: "atk", def: "def", defense: "def",
  spa: "spa", spatk: "spa", "sp. atk": "spa", spd: "spd", spdef: "spd",
  "sp. def": "spd", spe: "spe", speed: "spe",
};
let _natureNameSet = null;
const natureNameSet = () => (_natureNameSet || (_natureNameSet = new Set(NATURE_CHART.map(n => n.name))));

function parseShowdownTeam(text) {
  const blocks = String(text || "")
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map(b => b.trim())
    .filter(Boolean);

  const team = [];
  for (const block of blocks) {
    const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;

    // --- header line: [Nickname (]Species[)] [(M|F)] [@ Item]
    let header = lines[0];
    if (/^(ability|level|evs|ivs|tera|shiny|happiness|-)/i.test(header)) continue;
    let item = null;
    const at = header.lastIndexOf(" @ ");
    if (at !== -1) { item = header.slice(at + 3).trim(); header = header.slice(0, at).trim(); }
    header = header.replace(/\s*\((M|F)\)\s*$/i, "").trim();

    let species = header, nickname = null;
    const paren = header.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (paren) { nickname = paren[1].trim(); species = paren[2].trim(); }
    if (!species) continue;

    const mon = {
      species, nickname, item,
      ability: null, nature: null, level: 50, tera: null,
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
      moves: [],
    };

    for (const line of lines.slice(1)) {
      let m;
      if ((m = line.match(/^Ability:\s*(.+)$/i))) mon.ability = m[1].trim();
      else if ((m = line.match(/^Level:\s*(\d+)/i))) mon.level = +m[1];
      else if ((m = line.match(/^Tera Type:\s*(.+)$/i))) mon.tera = m[1].trim().toLowerCase();
      else if ((m = line.match(/^EVs:\s*(.+)$/i))) {
        m[1].split("/").forEach(part => {
          const p = part.trim().match(/^(\d+)\s+(.+)$/);
          if (!p) return;
          const key = EV_STAT_MAP[p[2].trim().toLowerCase()];
          if (key) mon.evs[key] = +p[1];
        });
      } else if ((m = line.match(/^-\s*(.+)$/))) {
        const mv = m[1].trim().replace(/\s*\[.*\]$/, "");
        if (mv && mon.moves.length < 4) mon.moves.push(mv);
      } else if ((m = line.match(/^([A-Za-z]+)\s+Nature$/i))) {
        const n = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
        if (natureNameSet().has(n)) mon.nature = n;
      }
    }

    // scale detection: classic spreads exceed 32 in a slot or 160 total
    const vals = Object.values(mon.evs);
    const total = vals.reduce((a, b) => a + b, 0);
    const classic = vals.some(v => v > 32) || total > 160;
    if (classic) {
      Object.keys(mon.evs).forEach(k => {
        mon.evs[k] = Math.min(32, Math.round(mon.evs[k] / 8));
      });
    }
    mon.evScale = classic ? "classic" : "champions";
    team.push(mon);
  }
  return team;
}

const evsToString = (e) => [e.hp, e.atk, e.def, e.spa, e.spd, e.spe].join("/");

/* "charizard-mega-y" -> "Mega Charizard Y" */
function prettyMegaLabel(apiName, species) {
  const parts = apiName.split("-");
  const mi = parts.indexOf("mega");
  const suffix = mi !== -1 ? parts.slice(mi + 1).map(s => s.toUpperCase()).join(" ") : "";
  return `Mega ${species}${suffix ? " " + suffix : ""}`;
}

/* Turn parsed sets into pool-shaped Pokémon by pulling base stats and types
   from PokéAPI, plus base power for any move our meta data doesn't cover. */
async function hydrateTeam(parsed, knownMoveData) {
  const mons = [];
  const moveData = {};
  const errors = [];

  for (let i = 0; i < parsed.length; i++) {
    const set = parsed[i];
    const slug0 = set.species.toLowerCase().replace(/[.'’:%]/g, "").replace(/\s+/g, "-");
    const slug = SLUG_OVERRIDES[slug0] || slug0;
    let api = null;
    try {
      const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
      if (r.ok) api = await r.json();
    } catch { /* offline */ }
    if (!api) {
      try {
        const r2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug0.split("-")[0]}`);
        if (r2.ok) {
          const j = await r2.json();
          const v = (j.varieties || []).find(x => x.is_default) || (j.varieties || [])[0];
          if (v) {
            const r3 = await fetch(`https://pokeapi.co/api/v2/pokemon/${v.pokemon.name}`);
            if (r3.ok) api = await r3.json();
          }
        }
      } catch { /* offline */ }
    }
    if (!api) { errors.push(set.species); continue; }

    // A held Mega Stone means this set *can* mega evolve — it doesn't start
    // that way. The base form stays primary and the Mega is attached as a
    // possibility the games roll for. No stone means it never megas, even
    // for a species that could.
    let megaOf = null;
    const stone = set.item && /ite(?: [XY])?$/i.test(set.item) && !/^eviolite$/i.test(set.item)
      ? set.item : null;
    if (stone) {
      try {
        const sp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug0.split("-")[0]}`);
        if (sp.ok) {
          const sj = await sp.json();
          const megas = (sj.varieties || []).map(v => v.pokemon.name).filter(n => n.includes("-mega"));
          if (megas.length) {
            // Charizardite X / Y (and Mewtwonite) pick a specific form
            const suffix = (stone.match(/\s([XY])$/i) || [])[1];
            const chosen = (suffix && megas.find(n => n.endsWith("-mega-" + suffix.toLowerCase()))) || megas[0];
            const mr = await fetch(`https://pokeapi.co/api/v2/pokemon/${chosen}`);
            if (mr.ok) megaOf = await mr.json();
          }
        }
      } catch { /* offline — fall back to the base form */ }
    }
    const stats = {};
    api.stats.forEach(s => {
      const k = { hp: "hp", attack: "atk", defense: "def", "special-attack": "spa", "special-defense": "spd", speed: "spe" }[s.stat.name];
      if (k) stats[k] = s.base_stat;
    });

    // The Mega form, if this set is holding the right stone.
    let megas = [];
    if (megaOf) {
      const mStats = {};
      megaOf.stats.forEach(s => {
        const k = { hp: "hp", attack: "atk", defense: "def", "special-attack": "spa", "special-defense": "spd", speed: "spe" }[s.stat.name];
        if (k) mStats[k] = s.base_stat;
      });
      megas = [{
        name: prettyMegaLabel(megaOf.name, set.species),
        slug: megaOf.name,
        types: megaOf.types.map(x => x.type.name),
        stats: mStats,
        // Mega forms force their own ability (Mega Mawile is always Huge Power)
        ability: megaOf.abilities && megaOf.abilities.length
          ? megaOf.abilities[0].ability.name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
          : null,
      }];
    }

    mons.push({
      rank: i + 1,
      name: set.species,
      nickname: set.nickname,
      slug: api.name,
      isTeam: true,
      megas,
      types: api.types.map(x => x.type.name),
      stats,
      usage: null,
      moves: set.moves.map(n => ({ name: n, pct: 100 })),
      items: set.item ? [{ name: set.item, pct: 100 }] : [],
      abilities: set.ability ? [{ name: set.ability, pct: 100 }] : [],
      natures: set.nature ? [{ name: set.nature, pct: 100 }] : [],
      builds: [{ nature: set.nature || null, evs: evsToString(set.evs), pct: 100 }],
      teamSet: set,
    });

    // move base power for anything the meta data doesn't already have
    for (const mv of set.moves) {
      if ((knownMoveData && knownMoveData[mv]) || moveData[mv]) continue;
      const mslug = mv.toLowerCase().replace(/[.'’]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      try {
        const r = await fetch(`https://pokeapi.co/api/v2/move/${mslug}`);
        if (r.ok) {
          const j = await r.json();
          moveData[mv] = {
            power: j.power,
            class: j.damage_class ? j.damage_class.name : null,
            type: j.type ? j.type.name : null,
          };
        }
      } catch { /* offline */ }
    }
  }
  return { mons, moveData, errors };
}

/* ---- Damage engine (Gen-9 mechanics, level 50) ----
   Returns the % of the defender's HP dealt at min and max roll, so the game
   can accept any bracket the 85–100% roll spread can land in. Hard mode
   layers item / ability / nature multipliers on top. */
function l50Stat(base, ev, natureMult) {
  const s = Math.floor((2 * base + 31 + Math.floor((ev || 0) / 1)) / 2) * 1; // EVs already 0–32 at L50
  return Math.floor((Math.floor((2 * base + 31) / 2) + 5 + (ev || 0)) * (natureMult || 1));
}
function hpStat(base, ev) {
  return Math.floor((2 * base + 31) / 2) + 50 + 10 + (ev || 0); // L50 HP
}
const DAMAGE_CLASS_STAT = { physical: ["atk", "def"], special: ["spa", "spd"] };

/* Abilities that null a whole damaging type outright. Conditional ones
   (Bulletproof, Soundproof, Wind Rider) depend on move flags we don't
   store, so they're deliberately left out. */
const ABILITY_IMMUNITY = {
  "Levitate": "ground", "Earth Eater": "ground",
  "Flash Fire": "fire", "Well-Baked Body": "fire",
  "Water Absorb": "water", "Storm Drain": "water", "Dry Skin": "water",
  "Volt Absorb": "electric", "Lightning Rod": "electric", "Motor Drive": "electric",
  "Sap Sipper": "grass",
};

/* opts: { atkItem, defItem, atkAbility, defAbility, atkNature, defNature,
          atkSpeEV..., weather } — all optional (base mode passes none). */
function calcDamage(attacker, defender, move, opts = {}) {
  if (!move || move.power == null || move.class === "status") return null;
  const [atkKey, defKey] = DAMAGE_CLASS_STAT[move.class] || [];
  if (!atkKey) return null;

  const atkNatMult = opts.atkNatureMult && opts.atkNatureMult[atkKey] || 1;
  const defNatMult = opts.defNatureMult && opts.defNatureMult[defKey] || 1;
  const atkEV = opts.atkEV != null ? opts.atkEV : 0;
  const defEV = opts.defEV != null ? opts.defEV : 0;
  const hpEV = opts.defHpEV != null ? opts.defHpEV : 0;

  let A = l50Stat(attacker.stats[atkKey], atkEV, atkNatMult);
  let D = l50Stat(defender.stats[defKey], defEV, defNatMult);
  const H = hpStat(defender.stats.hp, hpEV);

  // Ability / item stat multipliers (hard mode)
  if (opts.atkAbility === "Huge Power" || opts.atkAbility === "Pure Power") A *= 2;
  if (opts.atkItem === "Choice Band" && move.class === "physical") A = Math.floor(A * 1.5);
  if (opts.atkItem === "Choice Specs" && move.class === "special") A = Math.floor(A * 1.5);
  if (opts.atkItem === "Assault Vest" ) { /* no atk effect */ }
  if (opts.defItem === "Assault Vest" && move.class === "special") D = Math.floor(D * 1.5);
  if (opts.defItem === "Eviolite") D = Math.floor(D * 1.5);

  let power = move.power;
  // STAB
  const atkTypes = (attacker.types || []);
  let stab = atkTypes.includes(move.type) ? 1.5 : 1;
  if (opts.atkAbility === "Adaptability" && stab > 1) stab = 2;

  // Type effectiveness vs defender
  const defTypes = (defender.types || []).filter(x => TYPE_CHART[x]);
  let eff = 1;
  if (TYPE_CHART[move.type]) {
    defTypes.forEach(dt => {
      const m = TYPE_CHART[move.type][dt];
      eff *= (m === undefined ? 1 : m);
    });
  }
  if (eff === 0) return { min: 0, max: 0, eff, stab, immune: true, reason: "type" };
  // Ability immunity (only meaningful when abilities are in play)
  if (opts.defAbility && ABILITY_IMMUNITY[opts.defAbility] === move.type) {
    return { min: 0, max: 0, eff, stab, immune: true, reason: opts.defAbility };
  }

  // Weather (hard mode)
  let weatherMult = 1;
  if (opts.weather === "sun") { if (move.type === "fire") weatherMult = 1.5; if (move.type === "water") weatherMult = 0.5; }
  if (opts.weather === "rain") { if (move.type === "water") weatherMult = 1.5; if (move.type === "fire") weatherMult = 0.5; }

  // Item power mults (hard mode)
  let itemMult = 1;
  if (opts.atkItem === "Life Orb") itemMult *= 1.3;
  if (opts.atkItem === "Muscle Band" && move.class === "physical") itemMult *= 1.1;
  if (opts.atkItem === "Wise Glasses" && move.class === "special") itemMult *= 1.1;

  // Base damage (L50)
  const base = Math.floor(Math.floor((Math.floor((2 * 50) / 5 + 2) * power * A) / D) / 50) + 2;
  const afterMods = (roll) => {
    let dmg = base;
    dmg = Math.floor(dmg * weatherMult);
    dmg = Math.floor(dmg * stab);
    dmg = Math.floor(dmg * eff);
    dmg = Math.floor(dmg * roll / 100);
    dmg = Math.floor(dmg * itemMult);
    return Math.max(1, dmg);
  };
  const minDmg = afterMods(85);
  const maxDmg = afterMods(100);
  return {
    min: (minDmg / H) * 100,
    max: (maxDmg / H) * 100,
    eff, stab, H,
    minDmg, maxDmg,
  };
}

/* Damage brackets: four even quarters + OHKO. A result "covers" a bracket if
   the min–max roll span overlaps it. OHKO wins only if the MIN roll already
   kills (guaranteed KO), matching how players think about it. */
const DMG_BUCKETS = [
  { key: "immune", label: "No effect (0%)", lo: 0, hi: 0 },
  { key: "q1", label: "< 25%", lo: 0, hi: 25 },
  { key: "q2", label: "25–50%", lo: 25, hi: 50 },
  { key: "q3", label: "50–75%", lo: 50, hi: 75 },
  { key: "q4", label: "75–99%", lo: 75, hi: 100 },
  { key: "ohko", label: "OHKO", lo: 100, hi: Infinity },
];
function bucketsForResult(res) {
  if (!res) return [];
  // Type immunities (Ground vs Flying) and ability immunities (Levitate,
  // Flash Fire…) have exactly one right answer.
  if (res.immune) return ["immune"];
  const covered = new Set();
  if (res.max >= 100) covered.add("ohko");
  DMG_BUCKETS.filter(b => b.key !== "immune" && b.key !== "ohko").forEach(b => {
    // overlap between [min,max] capped at <100 and the bracket [lo,hi)
    const lo = Math.max(res.min, b.lo), hi = Math.min(res.max, b.hi);
    if (lo < hi && res.min < 100) covered.add(b.key);
  });
  return [...covered];
}

const STAT_META = [
  { key: "hp", label: "HP" }, { key: "atk", label: "Atk" }, { key: "def", label: "Def" },
  { key: "spa", label: "SpA" }, { key: "spd", label: "SpD" }, { key: "spe", label: "Spe" },
];
const STAT_LABEL = Object.fromEntries(STAT_META.map(s => [s.key, s.label]));
const STAT_COLOR = { atk: "#E5484D", def: "#E8913A", spa: "#6390F0", spd: "#7AC74C", spe: "#FFCB05" };

const CATEGORIES = [
  { key: "stats", label: "Base Stat Quiz", hint: "drill one stat" },
  { key: "speed", label: "Speed Tier Simulator", hint: "duels, turn order, scarf hunt" },
  { key: "damage", label: "Damage Buckets", hint: "how hard does this hit?" },
  { key: "moves", label: "Common Movesets Quiz", hint: "every move over 30% usage" },
  { key: "items", label: "Common Items Quiz", hint: "every item over 10% usage" },
  { key: "builds", label: "Common Builds Quiz", hint: "pick the real nature + EV spread" },
  { key: "abilities", label: "Preferred Abilities Quiz", hint: "multiple choice" },
  { key: "natures", label: "Preferred Natures Quiz", hint: "flip cards" },
  { key: "profile", label: "Physically or Specially Statted Quiz", hint: "offensive or defensive" },
  { key: "typematch", label: "Type Matchup Quiz", hint: "supereffective or resisted" },
  { key: "natureQuiz", label: "Nature Chart Quiz", hint: "five ways to drill natures" },
];
const NATURE_SUBS = [
  { key: "natureChart", label: "Boost + drop", hint: "tap both effects" },
  { key: "natBoost", label: "Boost only", hint: "which stat it raises" },
  { key: "natDrop", label: "Drop only", hint: "which stat it lowers" },
  { key: "natGroupBoost", label: "Group: boosts", hint: "all natures raising a stat" },
  { key: "natGroupDrop", label: "Group: drops", hint: "all natures lowering a stat" },
];
const SELECT_CATS = ["moves", "items", "weak", "resist", "natGroupBoost", "natGroupDrop"];
const MC_CATS = ["abilities", "offense", "defense", "builds", "natBoost", "natDrop"];
const FLIP_CATS = ["stats", "natures"];
const NAT_TAP_CATS = ["natureChart"]; // dual-select tap: boost + drop

const NATURE_CHART = [
  { name: "Adamant", plus: "atk", minus: "spa" },
  { name: "Lonely", plus: "atk", minus: "def" },
  { name: "Brave", plus: "atk", minus: "spe" },
  { name: "Naughty", plus: "atk", minus: "spd" },
  { name: "Bold", plus: "def", minus: "atk" },
  { name: "Impish", plus: "def", minus: "spa" },
  { name: "Relaxed", plus: "def", minus: "spe" },
  { name: "Lax", plus: "def", minus: "spd" },
  { name: "Modest", plus: "spa", minus: "atk" },
  { name: "Mild", plus: "spa", minus: "def" },
  { name: "Quiet", plus: "spa", minus: "spe" },
  { name: "Rash", plus: "spa", minus: "spd" },
  { name: "Calm", plus: "spd", minus: "atk" },
  { name: "Gentle", plus: "spd", minus: "def" },
  { name: "Sassy", plus: "spd", minus: "spe" },
  { name: "Careful", plus: "spd", minus: "spa" },
  { name: "Timid", plus: "spe", minus: "atk" },
  { name: "Hasty", plus: "spe", minus: "def" },
  { name: "Jolly", plus: "spe", minus: "spa" },
  { name: "Naive", plus: "spe", minus: "spd" },
  { name: "Hardy", plus: null, minus: null },
  { name: "Docile", plus: null, minus: null },
  { name: "Serious", plus: null, minus: null },
  { name: "Bashful", plus: null, minus: null },
  { name: "Quirky", plus: null, minus: null },
];

const NATURES_NONNEUTRAL = NATURE_CHART.filter(n => n.plus);
const STAT_KEYS_MOD = ["atk", "def", "spa", "spd", "spe"]; // HP is never a nature stat

const NATURE_PLUS_SPE = ["Timid", "Jolly", "Hasty", "Naive"];
const NATURE_MINUS_SPE = ["Brave", "Quiet", "Relaxed", "Sassy"];
const natureSpeedMult = (n) =>
  NATURE_PLUS_SPE.includes(n) ? 1.1 : NATURE_MINUS_SPE.includes(n) ? 0.9 : 1;

const WEATHER_META = {
  rain: { label: "Rain", icon: "🌧️", color: "#6390F0", abilities: ["Swift Swim"] },
  sun: { label: "Harsh Sun", icon: "☀️", color: "#EE8130", abilities: ["Chlorophyll"] },
  sand: { label: "Sandstorm", icon: "🌪️", color: "#B6A136", abilities: ["Sand Rush"] },
  snow: { label: "Snow", icon: "❄️", color: "#96D9D6", abilities: ["Slush Rush"] },
};
const WEATHER_SETTERS = {
  "Drizzle": "rain", "Primordial Sea": "rain",
  "Drought": "sun", "Orichalcum Pulse": "sun", "Desolate Land": "sun",
  "Sand Stream": "sand", "Sand Spit": "sand",
  "Snow Warning": "snow",
};

/* ----------------------------- helpers ----------------------------- */

const norm = (e) => (typeof e === "string" ? { name: e, pct: null } : e);
const monTypes = (m) => (m.types && m.types.length ? m.types : ["unknown"]);
const validTypes = (m) => monTypes(m).filter(t => TYPE_CHART[t]);

const MEGA_STONE = /ite(?: [XY])?$/;
const isMegaUser = (m) =>
  (m.items || []).some(e => {
    const n = norm(e).name;
    return MEGA_STONE.test(n) && n !== "Eviolite";
  });

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* EV spread "2/32/0/0/0/32" -> "2 HP / 32 Atk / 32 Spe" (nonzero only). */
const EV_ORDER = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];
function evsPretty(evs) {
  const parts = String(evs).split("/").map(s => parseInt(s, 10));
  const out = [];
  parts.forEach((v, i) => { if (v > 0 && EV_ORDER[i]) out.push(v + " " + EV_ORDER[i]); });
  return out.length ? out.join(" / ") : String(evs);
}
/* Nature is currently blank in the source data (Pikalytics bug, reported);
   when it's null the label gracefully shows the spread alone. */
const buildLabel = (b) => (b.nature ? b.nature + " · " : "") + evsPretty(b.evs);

/* Level-50 stat with 31 IVs; Champions EVs (0–32) are assumed to add stat
   points directly. If in-game numbers differ, this is the one place to fix. */
function realSpeedStat(base, ev) {
  return Math.floor((2 * base + 31) / 2) + 5 + (ev || 0);
}
function speEV(build) {
  const parts = String(build.evs || "").split("/").map(n => parseInt(n, 10));
  return parts.length === 6 && !isNaN(parts[5]) ? parts[5] : 0;
}

/* Expand a ranked list with Mega Evolution forms (from mon.megas, enriched
   by the fetch script via PokéAPI). Megas inherit the base form's usage
   context, moves, items, and natures; stats, types, and ability are the
   Mega's own. */
function megaEntry(base, mega) {
  return {
    rank: base.rank, name: mega.name, slug: mega.slug, isMega: true,
    types: mega.types, stats: mega.stats,
    usage: base.usage, winrate: base.winrate,
    moves: base.moves, items: base.items,
    abilities: mega.ability ? [{ name: mega.ability, pct: null }] : base.abilities,
    natures: base.natures,
  };
}
/* Imported sets holding a stone can mega evolve mid-battle, so each round
   rolls for it rather than assuming either state. Returns the Mega variant
   (flagged megaActive so the UI can say so) or the untouched base form. */
function rollMegaState(m) {
  if (!m || !m.isTeam) return m;
  const g = (m.megas || [])[0];
  if (!g || Math.random() < 0.5) return m;
  return {
    ...m,
    name: g.name,
    baseName: m.name,
    slug: g.slug,
    isMega: true,
    megaActive: true,
    types: g.types,
    stats: g.stats,
    abilities: g.ability ? [{ name: g.ability, pct: 100 }] : m.abilities,
  };
}

/* A Mega is either a PokéAPI-expanded entry (isMega flag) or a ranked row
   whose name contains "Mega" as a word/segment (e.g. "Charizard-Mega-Y",
   "Mega Mawile") — but not Meganium or Yanmega. */
const MEGA_NAME = /(^|[\s-])mega([\s-]|$)/i;
const isMegaEntry = (m) => m.isMega || MEGA_NAME.test(m.name);
/* Order-insensitive name key: "Mega Charizard Y" == "Charizard-Mega-Y". */
const nameKey = (n) => n.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/[\s-]+/).filter(Boolean).sort().join("");

function expandPool(mons, megaMode) {
  const present = new Set(mons.map(m => nameKey(m.name)));
  const all = [];
  mons.forEach(m => {
    all.push(m);
    // Skip PokéAPI-expanded Megas that already exist as their own ranked rows
    (m.megas || []).forEach(g => {
      if (!present.has(nameKey(g.name))) all.push(megaEntry(m, g));
    });
  });
  if (megaMode === "exclude") return all.filter(m => !isMegaEntry(m));
  if (megaMode === "only") return all.filter(isMegaEntry);
  return all;
}

const hasAbility = (mon, name) =>
  (mon.abilities || []).map(norm).some(a => a.name === name || a.name.indexOf(name) === 0);
const boostAbility = (mon, w) =>
  w ? (WEATHER_META[w].abilities.find(a => hasAbility(mon, a)) || null) : null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const offenseProfile = (m) => {
  const d = m.stats.atk - m.stats.spa;
  return Math.abs(d) <= MIXED_GAP ? "Mixed" : d > 0 ? "Physical" : "Special";
};
const defenseProfile = (m) => {
  const d = m.stats.def - m.stats.spd;
  return Math.abs(d) <= MIXED_GAP ? "Balanced" : d > 0 ? "Physical bulk" : "Special bulk";
};

function speedContext(mon, pool) {
  const spe = mon.stats.spe;
  const withStats = pool.filter(m => m.stats);
  const faster = withStats.filter(m => m.stats.spe > spe && m.name !== mon.name)
    .sort((a, b) => a.stats.spe - b.stats.spe)[0];
  const ties = withStats.filter(m => m.stats.spe === spe && m.name !== mon.name);
  const slower = withStats.filter(m => m.stats.spe < spe)
    .sort((a, b) => b.stats.spe - a.stats.spe)[0];
  return { faster, ties, slower };
}

/* --------------------------- deck building --------------------------- */

function buildDeck({ mons, count, skip, cat, statKey, doShuffle, abilSkipMono }) {
  const pool = mons.slice(skip || 0, count);
  const cards = [];

  pool.forEach((mon) => {
    if (cat === "stats" && mon.stats) {
      cards.push({ mon, cat, statKey });
    } else if (cat === "natures" && mon.natures && mon.natures.length) {
      cards.push({ mon, cat });
    } else if (cat === "moves") {
      const list = (mon.moves || []).map(norm);
      if (list.some(e => e.pct != null)) {
        cards.push({
          mon, cat,
          entries: shuffle(list),
          target: list.filter(e => e.pct != null && e.pct > 30).map(e => e.name),
        });
      }
    } else if (cat === "items" && !isMegaEntry(mon)) {
      const own = (mon.items || []).map(norm);
      if (own.some(e => e.pct != null)) {
        const ownNames = new Set(own.map(e => e.name));
        const distractors = shuffle([...new Set(
          pool.filter(m => m.name !== mon.name)
            .flatMap(m => (m.items || []).map(norm).map(e => e.name))
            .filter(n => !ownNames.has(n))
            .filter(n => !(MEGA_STONE.test(n) && n !== "Eviolite"))
        )]);
        const entries = own.slice(0, 8).map(e => ({ ...e }));
        while (entries.length < 8 && distractors.length) {
          entries.push({ name: distractors.shift(), pct: null, distractor: true });
        }
        cards.push({
          mon, cat,
          entries: shuffle(entries),
          target: own.filter(e => e.pct != null && e.pct > 10).map(e => e.name),
        });
      }
    } else if (cat === "builds") {
      const own = (mon.builds || [])[0];
      if (own) {
        const correct = buildLabel(own);
        const distractors = shuffle([...new Set(
          pool.filter(m => m.name !== mon.name)
            .map(m => (m.builds || [])[0]).filter(Boolean)
            .map(buildLabel).filter(l => l !== correct)
        )]).slice(0, 3);
        if (distractors.length) {
          cards.push({ mon, cat, options: shuffle([correct, ...distractors]), correct, buildPct: own.pct });
        }
      }
    } else if (cat === "abilities") {
      const own = (mon.abilities || []).map(norm);
      if (own.length && !(abilSkipMono && own.length < 2)) {
        let options = own.map(e => e.name);
        if (options.length < 3) {
          const others = shuffle([...new Set(
            pool.filter(m => m.name !== mon.name)
              .flatMap(m => (m.abilities || []).map(norm).map(e => e.name))
              .filter(n => !options.includes(n))
          )]);
          while (options.length < 3 && others.length) options.push(others.shift());
        }
        cards.push({ mon, cat, options: shuffle(options.slice(0, 4)), correct: own[0].name });
      }
    } else if (cat === "offense" && mon.stats) {
      cards.push({ mon, cat, options: ["Physical", "Special", "Mixed"], correct: offenseProfile(mon) });
    } else if (cat === "defense" && mon.stats) {
      cards.push({ mon, cat, options: ["Physical bulk", "Special bulk", "Balanced"], correct: defenseProfile(mon) });
    }
  });

  if (cat === "weak" || cat === "resist") {
    const eff = (a, d) => (TYPE_CHART[a][d] === undefined ? 1 : TYPE_CHART[a][d]);
    ALL_TYPES.forEach(t => {
      const target = cat === "weak"
        ? ALL_TYPES.filter(d => eff(t, d) > 1)
        : ALL_TYPES.filter(a => eff(a, t) < 1);
      cards.push({ type: t, cat, target });
    });
  }

  if (cat === "natureChart") {
    // Tap-to-answer: pick the raised stat (red) and the lowered stat (blue).
    // Neutral natures omitted.
    NATURES_NONNEUTRAL.forEach(n => cards.push({ nature: n, cat }));
  }

  if (cat === "natBoost" || cat === "natDrop") {
    const wanted = cat === "natBoost" ? "plus" : "minus";
    NATURES_NONNEUTRAL.forEach(n => {
      cards.push({
        nature: n, cat,
        options: STAT_KEYS_MOD.map(k => STAT_LABEL[k]),
        correct: STAT_LABEL[n[wanted]],
      });
    });
  }

  if (cat === "natGroupBoost" || cat === "natGroupDrop") {
    const field = cat === "natGroupBoost" ? "plus" : "minus";
    // One card per stat: select every non-neutral nature that raises (or
    // lowers) that stat. Entries are nature names; target is the matching set.
    STAT_KEYS_MOD.forEach(k => {
      const target = NATURES_NONNEUTRAL.filter(n => n[field] === k).map(n => n.name);
      cards.push({
        cat, statKey: k,
        entries: shuffle(NATURES_NONNEUTRAL.map(n => ({ name: n.name }))),
        target,
      });
    });
  }

  const deck = doShuffle ? shuffle(cards) : cards;
  return deck.map((c, i) => ({
    id: `${c.mon ? c.mon.name : c.nature ? c.nature.name : c.type || c.statKey}|${c.cat}|${i}`,
    card: c, step: 0, lapses: 0, reviews: 0, correct: 0,
  }));
}

/* -------------------------- PokéAPI sprites -------------------------- */

const SLUG_OVERRIDES = {
  "calyrex-shadow": "calyrex-shadow-rider",
  "calyrex-ice": "calyrex-ice-rider",
  "indeedee-f": "indeedee-female",
  "indeedee-m": "indeedee-male",
  "tornadus": "tornadus-incarnate",
  "thundurus": "thundurus-incarnate",
  "landorus": "landorus-incarnate",
  "enamorus": "enamorus-incarnate",
  "basculegion": "basculegion-male",
  "maushold": "maushold-family-of-four",
  "urshifu": "urshifu-single-strike",
  "urshifu-rapid-strike": "urshifu-rapid-strike",
  "giratina": "giratina-altered",
  "zygarde": "zygarde-50",
  "keldeo": "keldeo-ordinary",
  "mimikyu": "mimikyu-disguised",
  "toxtricity": "toxtricity-amped",
};

const spriteCache = {};

async function resolveSprite(name, slugHint) {
  const key = (slugHint || name).toLowerCase();
  if (spriteCache[key] !== undefined) return spriteCache[key];
  const slug0 = slugHint || key.replace(/[.'’%]/g, "").replace(/\s+/g, "-");
  const slug = SLUG_OVERRIDES[slug0] || slug0;

  const artworkFrom = async (s) => {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${s}`);
    if (!r.ok) throw new Error("404");
    const j = await r.json();
    return (
      (j.sprites && j.sprites.other && j.sprites.other["official-artwork"] &&
        j.sprites.other["official-artwork"].front_default) ||
      (j.sprites && j.sprites.front_default) || null
    );
  };

  let url = null;
  try {
    url = await artworkFrom(slug);
  } catch {
    try {
      const r = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug0.split("-")[0]}`);
      if (r.ok) {
        const j = await r.json();
        const v = (j.varieties || []).find(x => x.is_default) || (j.varieties || [])[0];
        if (v) url = await artworkFrom(v.pokemon.name);
      }
    } catch { /* offline — orb fallback */ }
  }
  spriteCache[key] = url;
  return url;
}

function MonSprite({ mon, size = 56 }) {
  const key = (mon.slug || mon.name).toLowerCase();
  const [url, setUrl] = useState(spriteCache[key]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    setFailed(false);
    if (spriteCache[key] !== undefined) setUrl(spriteCache[key]);
    else resolveSprite(mon.name, mon.slug).then(u => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [key]);

  if (!url || failed) {
    return <TypeOrb types={monTypes(mon)} size={size} text={mon.name[0]} />;
  }
  return (
    <img
      src={url} alt={mon.name} width={size} height={size} draggable={false}
      onError={() => setFailed(true)}
      style={{ objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 3px 5px rgba(0,0,0,.3))" }}
    />
  );
}

/* ----------------------------- atoms ----------------------------- */

function TypeOrb({ types, size = 44, text }) {
  const t = types && types.length ? types : ["unknown"];
  const c1 = TYPE_COLORS[t[0]] || TYPE_COLORS.unknown;
  const c2 = TYPE_COLORS[t[1] || t[0]] || TYPE_COLORS.unknown;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c1} 0%, ${c1} 48%, ${c2} 52%, ${c2} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "inset 0 -3px 6px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.35)",
      flexShrink: 0,
    }} aria-hidden="true">
      <span style={{
        fontFamily: "var(--display)", fontWeight: 800, color: "rgba(255,255,255,.95)",
        fontSize: size * 0.42, textShadow: "0 1px 2px rgba(0,0,0,.4)", letterSpacing: ".02em",
      }}>{text}</span>
    </div>
  );
}

function TypeChip({ t }) {
  return (
    <span style={{
      background: TYPE_COLORS[t] || TYPE_COLORS.unknown, color: "#fff", borderRadius: 4,
      padding: "2px 8px", fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
      textTransform: "uppercase", textShadow: "0 1px 1px rgba(0,0,0,.35)",
    }}>{t}</span>
  );
}

function StatOrb({ statKey, size = 44 }) {
  const c = STAT_COLOR[statKey] || "#8A8DA8";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c} 0%, ${c} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "inset 0 -3px 6px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.35)",
      flexShrink: 0,
    }} aria-hidden="true">
      <span style={{
        fontFamily: "var(--display)", fontWeight: 800, color: "rgba(255,255,255,.95)",
        fontSize: size * 0.34, textShadow: "0 1px 2px rgba(0,0,0,.4)",
      }}>{STAT_LABEL[statKey] || "?"}</span>
    </div>
  );
}

function NatureOrb({ nature, size = 44 }) {
  const c1 = nature.plus ? STAT_COLOR[nature.plus] : "#8A8DA8";
  const c2 = nature.minus ? STAT_COLOR[nature.minus] : "#8A8DA8";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${c1} 0%, ${c1} 48%, ${c2} 52%, ${c2} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "inset 0 -3px 6px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.35)",
      flexShrink: 0,
    }} aria-hidden="true">
      <span style={{
        fontFamily: "var(--display)", fontWeight: 800, color: "rgba(255,255,255,.95)",
        fontSize: size * 0.42, textShadow: "0 1px 2px rgba(0,0,0,.4)",
      }}>{nature.name[0]}</span>
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,.045)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 14, padding: "16px 16px", marginBottom: 14,
};
const panelHeadStyle = {
  display: "flex", alignItems: "baseline", justifyContent: "space-between",
  fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".12em",
  textTransform: "uppercase", color: "rgba(255,255,255,.65)", marginBottom: 12,
};

function SubPill({ active, onClick, children, small, activeColor }) {
  const c = activeColor || "var(--gold)";
  return (
    <button onClick={onClick} style={{
      background: active ? c : "rgba(255,255,255,.06)",
      color: active ? "#1B1D36" : "rgba(255,255,255,.75)",
      border: "1px solid " + (active ? c : "rgba(255,255,255,.15)"),
      borderRadius: 999, padding: small ? "4px 10px" : "5px 12px",
      fontSize: small ? 12 : 13, fontWeight: 700, cursor: "pointer",
    }}>{children}</button>
  );
}

/* ----------------------------- config screen ----------------------------- */

function TeamPanel({ team, onImport, onClear }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const doImport = async () => {
    const raw = text.trim();
    if (!raw) return;
    setBusy(true);
    setMsg(null);
    try {
      let paste = raw;
      // A bare pokepast.es link: try the /raw endpoint. Many browsers block
      // this (no CORS headers on pokepast.es), so failure falls back to
      // asking for the pasted text instead.
      const urlMatch = raw.match(/^https?:\/\/pokepast\.es\/([A-Za-z0-9]+)/);
      if (urlMatch && !raw.includes("\n")) {
        try {
          const r = await fetch(`https://pokepast.es/${urlMatch[1]}/raw`);
          if (!r.ok) throw new Error("status " + r.status);
          paste = await r.text();
        } catch {
          setBusy(false);
          setMsg({ bad: true, text: "Couldn't load that link directly (pokepast.es blocks cross-site requests). Open the paste, copy the text, and paste it here instead." });
          return;
        }
      }
      const parsed = parseShowdownTeam(paste);
      if (!parsed.length) {
        setBusy(false);
        setMsg({ bad: true, text: "No Pokémon found — paste a Showdown export (or a pokepast.es link)." });
        return;
      }
      const res = await onImport(parsed);
      setBusy(false);
      if (res && res.mons.length) {
        setText("");
        setOpen(false);
        setMsg(res.errors.length
          ? { bad: false, text: `Imported ${res.mons.length}. Couldn't identify: ${res.errors.join(", ")}.` }
          : null);
      } else {
        setMsg({ bad: true, text: "Couldn't look those species up — check spelling, or try again when online." });
      }
    } catch (err) {
      setBusy(false);
      setMsg({ bad: true, text: "Import failed: " + err.message });
    }
  };

  return (
    <div>
      {team && team.mons.length > 0 ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {team.mons.map(m => (
              <div key={m.name + m.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 62 }}>
                <MonSprite mon={m} size={46} />
                <span style={{ fontSize: 10.5, color: "#fff", textAlign: "center", lineHeight: 1.2, marginTop: 2 }}>
                  {m.nickname || m.name}
                </span>
                {m.builds && m.builds[0] && m.builds[0].nature && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)" }}>
                    {m.builds[0].nature}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <SubPill small active={false} onClick={() => setOpen(o => !o)}>Replace</SubPill>
            <SubPill small active={false} onClick={onClear}>Clear</SubPill>
          </div>
        </>
      ) : (
        !open && (
          <button onClick={() => setOpen(true)} style={{
            width: "100%", padding: "12px", borderRadius: 10, cursor: "pointer",
            background: "rgba(255,255,255,.05)", border: "1.5px dashed rgba(255,255,255,.25)",
            color: "#fff", fontSize: 14, fontWeight: 600,
          }}>+ Import a team from Poképaste</button>
        )
      )}

      {open && (
        <div style={{ marginTop: 12 }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={"Paste your Showdown export here, e.g.\n\nGarchomp @ Life Orb\nAbility: Rough Skin\nEVs: 252 Atk / 252 Spe\nJolly Nature\n- Earthquake\n- Protect"}
            rows={7}
            style={{
              width: "100%", boxSizing: "border-box", borderRadius: 10,
              background: "rgba(0,0,0,.25)", color: "#fff",
              border: "1px solid rgba(255,255,255,.18)", padding: "10px 12px",
              fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.5, resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={doImport} disabled={busy || !text.trim()} style={{
              flex: 1, padding: "11px", borderRadius: 10, border: "none",
              background: busy || !text.trim() ? "rgba(255,255,255,.12)" : "var(--gold)",
              color: busy || !text.trim() ? "rgba(255,255,255,.4)" : "#1B1D36",
              fontWeight: 800, fontSize: 15, cursor: busy || !text.trim() ? "default" : "pointer",
              fontFamily: "var(--display)", textTransform: "uppercase", letterSpacing: ".04em",
            }}>{busy ? "Importing…" : "Import team"}</button>
            <button onClick={() => { setOpen(false); setMsg(null); }} style={{
              padding: "11px 16px", borderRadius: 10, cursor: "pointer",
              background: "transparent", border: "1.5px solid rgba(255,255,255,.2)",
              color: "#fff", fontSize: 14,
            }}>Cancel</button>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
            EVs work on either scale — Showdown's 0–252 or Champions' 0–32.
            Base stats and types are looked up from PokéAPI on import.
          </div>
        </div>
      )}

      {msg && (
        <div style={{
          marginTop: 10, fontSize: 12.5, lineHeight: 1.5,
          color: msg.bad ? "#FFB4B7" : "#9BE3B8",
        }}>{msg.text}</div>
      )}
    </div>
  );
}

function ConfigScreen({ formats, generated, live, team, onImportTeam, onClearTeam, onStart }) {
  const games = useMemo(() => [...new Set(formats.map(f => f.game))], [formats]);
  const [gameLabel, setGameLabel] = useState(games[0]);
  const regs = formats.filter(f => f.game === gameLabel);
  const [regIdx, setRegIdx] = useState(0);
  const reg = regs[Math.min(regIdx, regs.length - 1)];

  const [cat, setCat] = useState("stats");
  const [statKey, setStatKey] = useState("spe");
  const [typeMatchKey, setTypeMatchKey] = useState("weak");
  const [profileKey, setProfileKey] = useState("offense");
  const [natureKey, setNatureKey] = useState("natureChart");
  const [abilSkipMono, setAbilSkipMono] = useState(true);
  const [count, setCount] = useState(20);
  const [mastery, setMastery] = useState(false);
  const [useSkip, setUseSkip] = useState(false);
  const [skipTop, setSkipTop] = useState(0);
  const [megaMode, setMegaMode] = useState("include"); // include | exclude | only
  // speed matchups options
  const [duelVariant, setDuelVariant] = useState("faster");
  const [duelTarget, setDuelTarget] = useState(10);
  const [duelHard, setDuelHard] = useState(false);
  const [duelBuild, setDuelBuild] = useState("none");
  const [dmgHard, setDmgHard] = useState(false);
  const [matchSrc, setMatchSrc] = useState("meta"); // meta | teamVsMeta | team
  const [showTeam, setShowTeam] = useState(false);

  const availableMons = expandPool(reg.mons, megaMode);
  const maxMons = availableMons.length;
  // "Down to rank" sets the bottom of the range; "Omit top" sets the top.
  // They're independent bounds: omit is clamped only by the pool size, never
  // by count, so the two never collapse onto the same rank. The studied set
  // is always ranks (effSkip+1)…effHi with no overlap between chunks.
  // lo = how many top ranks to omit (0-based index of first studied mon).
  // hi = "down to rank". When omit meets or passes hi, the studied window
  // slides DOWN to keep its span: e.g. top=25, omit=25 -> ranks 26..50.
  const lo = useSkip ? Math.max(0, Math.min(skipTop, maxMons - 1)) : 0;
  let hiClamped = Math.max(1, Math.min(count, maxMons));
  if (hiClamped <= lo) hiClamped = Math.min(maxMons, lo + (Math.max(1, Math.min(count, maxMons))));
  const pool = availableMons.slice(lo, hiClamped);
  const effCount = hiClamped;

  const catAvailable = (key) => {
    if (!pool.length) return false;
    if (key === "natureQuiz") return true;
    if (key === "damage") {
      const md = { ...(reg.moveData || {}), ...((team && team.moveData) || {}) };
      const srcPool = (!hasTeam || matchSrc === "meta") ? pool : teamMons;
      const withStats = srcPool.filter(m => m.stats && m.types && m.types.length);
      const hasDmgMove = withStats.some(m => (m.moves || []).some(e => {
        const nm = typeof e === "string" ? e : e.name;
        return md[nm] && md[nm].power != null && md[nm].class !== "status";
      }));
      return withStats.length >= 2 && hasDmgMove;
    }
    if (key === "stats" || key === "speed" || key === "offense" || key === "defense")
      return pool.some(m => m.stats);
    if (key === "typematch") return true;
    if (key === "profile") return pool.some(m => m.stats);
    if (key === "builds") return pool.some(m => m.builds && m.builds.length);
    if (key === "moves") return pool.some(m => (m.moves || []).map(norm).some(e => e.pct != null));
    if (key === "items") return pool.some(m => (m.items || []).map(norm).some(e => e.pct != null));
    return pool.some(m => m[key] && m[key].length);
  };

  const teamMons = (team && team.mons) || [];
  const hasTeam = teamMons.length > 0;
  // A team restored from storage arrives after mount, so reveal the panel
  // when one shows up rather than only on the checkbox.
  useEffect(() => { if (hasTeam) setShowTeam(true); }, [hasTeam]);
  const effMatchSrc = hasTeam ? matchSrc : "meta";
  // Speed/damage games draw from the studied meta slice, the imported team,
  // or both. "teamVsMeta" keeps both sides available; games that need four
  // Pokémon fall back to the combined set.
  const duelPool = (
    effMatchSrc === "team" ? teamMons.filter(m => m.stats)
    : effMatchSrc === "teamVsMeta" ? [...teamMons.filter(m => m.stats), ...pool.filter(m => m.stats)]
    : pool.filter(m => m.stats)
  );
  // Damage Buckets always attacks from the left. With a team loaded, that's
  // your Pokémon; the meta side defends.
  const dmgAtkPool = (
    effMatchSrc === "meta" ? pool.filter(m => m.stats)
    : teamMons.filter(m => m.stats)
  );
  const dmgDefPool = (
    effMatchSrc === "team" ? teamMons.filter(m => m.stats)
    : pool.filter(m => m.stats)
  );
  const realAvailable = duelPool.some(m => m.builds && m.builds.length);
  const effCat = cat === "typematch" ? typeMatchKey
    : cat === "profile" ? profileKey
    : cat === "natureQuiz" ? natureKey
    : cat;
  const deckPreview = cat !== "speed" && catAvailable(cat)
    ? buildDeck({ mons: availableMons, count: effCount, skip: lo, cat: effCat, statKey, doShuffle: false, abilSkipMono })
    : [];
  const canStart = cat === "speed"
    ? duelPool.length >= (duelVariant === "faster" ? 2 : 4)
    : cat === "damage"
      ? catAvailable("damage")
      : deckPreview.length > 0;

  const startLabel = cat === "speed"
    ? (duelVariant === "order" ? (duelHard ? "Start hard mode" : "Start turn order")
      : duelVariant === "scarf" ? "Start scarf hunt" : "Start speed duel")
    : cat === "damage" ? (dmgHard ? "Start hard mode" : "Start damage drill")
    : "Start drilling";

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 18px 40px" }}>
      {/* hero */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".14em",
          color: "var(--gold)", textTransform: "uppercase", marginBottom: 6,
        }}>{gameLabel} · {reg.label}</div>
        <h1 style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 42, lineHeight: 1,
          margin: 0, color: "#fff", letterSpacing: ".01em", textTransform: "uppercase",
        }}>VGC Meta Blitz</h1>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,.35)", marginTop: 4 }}>
          {APP_VERSION}
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "10px 0 0", lineHeight: 1.5 }}>
          Study what the ladder is actually running — quizzes, games, and
          spaced-repetition flashcards built from live usage data.
        </p>
      </div>

      {/* format */}
      <section style={panelStyle}>
        <div style={panelHeadStyle}><span>Regulation</span></div>
        {games.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {games.map(g => {
              const on = g === gameLabel;
              return (
                <button key={g} onClick={() => { setGameLabel(g); setRegIdx(0); }} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
                  background: on ? "rgba(255,203,5,.12)" : "rgba(255,255,255,.04)",
                  border: `1.5px solid ${on ? "var(--gold)" : "rgba(255,255,255,.12)"}`,
                  color: "#fff", fontWeight: 700, fontSize: 14,
                }}>{g}</button>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {regs.map((r, idx) => {
            const on = idx === Math.min(regIdx, regs.length - 1);
            return (
              <button key={r.id} onClick={() => setRegIdx(idx)} style={{
                borderRadius: 999, padding: "6px 13px", cursor: "pointer",
                fontSize: 13, fontWeight: 700,
                background: on ? "var(--gold)" : "rgba(255,255,255,.06)",
                color: on ? "#1B1D36" : "rgba(255,255,255,.85)",
                border: "1px solid " + (on ? "var(--gold)" : "rgba(255,255,255,.15)"),
              }}>{r.label}</button>
            );
          })}
        </div>
        {reg.noteText && (
          <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)" }}>
            {reg.noteText}
          </div>
        )}
      </section>

      {/* pool */}
      <section style={panelStyle}>
        <div style={panelHeadStyle}>
          <span>{lo ? "Usage ranks to study" : "Top Pokémon to study"}</span>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: lo ? 26 : 30,
            color: "var(--gold)", lineHeight: 1,
          }}>{maxMons ? (lo ? `${lo + 1}–${effCount}` : effCount) : 0}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {[
            { id: "include", t: "Include Megas" },
            { id: "exclude", t: "No Megas" },
            { id: "only", t: "Megas only" },
          ].map(p => (
            <SubPill key={p.id} active={megaMode === p.id} onClick={() => setMegaMode(p.id)}>
              {p.t}
            </SubPill>
          ))}
        </div>
        {maxMons === 0 ? (
          <div style={{ color: "#FFD84D", fontSize: 13 }}>
            No {megaMode === "only" ? "Mega form data" : "Pokémon"} in this regulation yet.
          </div>
        ) : (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,.4)",
              letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 2,
            }}>
              <span>Down to rank</span>
              <span>{effCount}</span>
            </div>
            <input
              type="range" min={1} max={maxMons} step={1} value={effCount}
              onChange={e => setCount(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#FFCB05" }}
              aria-label="Study down to this usage rank"
            />

            <label
              style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
                color: "#fff", fontSize: 13, marginTop: 10,
              }}
              onClick={() => setUseSkip(v => !v)}
            >
              <span style={{
                width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${useSkip ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
                background: useSkip ? "var(--gold)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#1B1D36", fontSize: 10, fontWeight: 900,
              }}>{useSkip ? "✓" : ""}</span>
              Omit top threats
            </label>

            {useSkip && (
              <div style={{ marginTop: 10 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontFamily: "var(--mono)", fontSize: 10.5, color: "rgba(255,255,255,.4)",
                  letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 2,
                }}>
                  <span>Omit the top</span>
                  <span>{lo}</span>
                </div>
                <input
                  type="range" min={0} max={Math.max(0, maxMons - 1)} step={1} value={effSkip}
                  onChange={e => setSkipTop(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#E8913A" }}
                  aria-label="Number of top-ranked Pokémon to omit"
                />
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
              {pool.map(m => (
                <TypeOrb key={m.name} types={monTypes(m)} size={26} text={m.name[0]} />
              ))}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
              {lo
                ? `Ranks ${lo + 1}–${effCount} · ${pool.length} Pokémon`
                : `Top ${effCount} by usage`}
              {megaMode !== "include" ? ` (${megaMode === "only" ? "Mega users only" : "Megas excluded"})` : ""}
              {lo ? ` · ${pool[0].name} → ${pool[pool.length - 1].name}` : ` · last is ${pool[pool.length - 1].name}`}
            </div>
          </>
        )}
      </section>

      <section style={{ ...panelStyle, paddingTop: 12, paddingBottom: showTeam ? 16 : 12, marginBottom: showTeam ? 14 : 14 }}>
        <label
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", color: "#fff", fontSize: 14 }}
          onClick={() => setShowTeam(v => !v)}
        >
          <span style={{
            width: 17, height: 17, borderRadius: 4, flexShrink: 0,
            border: `2px solid ${showTeam ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
            background: showTeam ? "var(--gold)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#1B1D36", fontSize: 11, fontWeight: 900,
          }}>{showTeam ? "✓" : ""}</span>
          <span style={{ fontWeight: 600 }}>Use my own team</span>
          <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: "auto", textAlign: "right" }}>
            {hasTeam ? `${teamMons.length} imported` : "import a Poképaste"}
          </span>
        </label>
        {showTeam && (
          <div style={{ marginTop: 12 }}>
            <TeamPanel team={team} onImport={onImportTeam} onClear={onClearTeam} />
          </div>
        )}
      </section>

      {/* what to drill */}
      <section style={panelStyle}>
        <div style={panelHeadStyle}><span>What to drill</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CATEGORIES.map(c => {
            const unavailable = !catAvailable(c.key);
            const on = c.key === cat && !unavailable;
            return (
              <div key={c.key}>
                <button
                  onClick={() => !unavailable && setCat(c.key)}
                  disabled={unavailable}
                  style={{
                    width: "100%", textAlign: "left",
                    cursor: unavailable ? "default" : "pointer",
                    opacity: unavailable ? 0.45 : 1,
                    background: on ? "rgba(255,203,5,.10)" : "rgba(255,255,255,.04)",
                    border: `1.5px solid ${on ? "var(--gold)" : "rgba(255,255,255,.12)"}`,
                    borderRadius: 10, padding: "11px 14px", color: "#fff",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${on ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{on && <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--gold)" }} />}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{c.label}</span>
                  <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: "auto", textAlign: "right" }}>
                    {unavailable
                      ? (["moves", "items", "builds"].includes(c.key)
                        ? "needs usage % — arrives with the first data pull"
                        : "no data in this snapshot yet")
                      : c.hint}
                  </span>
                </button>

                {c.key === "stats" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>Drill one stat:</span>
                    {STAT_META.map(s => (
                      <SubPill key={s.key} small active={statKey === s.key} onClick={() => setStatKey(s.key)}>
                        {s.label}
                      </SubPill>
                    ))}
                  </div>
                )}

                {c.key === "profile" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <SubPill small active={profileKey === "offense"} onClick={() => setProfileKey("offense")}>
                      Offensive
                    </SubPill>
                    <SubPill small active={profileKey === "defense"} onClick={() => setProfileKey("defense")}>
                      Defensive
                    </SubPill>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {profileKey === "offense" ? "physical, special, or mixed?" : "which side is bulkier?"}
                    </span>
                  </div>
                )}

                {c.key === "natureQuiz" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    {NATURE_SUBS.map(s => (
                      <SubPill key={s.key} small active={natureKey === s.key} onClick={() => setNatureKey(s.key)}>
                        {s.label}
                      </SubPill>
                    ))}
                    <span style={{ color: "var(--muted)", fontSize: 12, width: "100%", marginTop: 2 }}>
                      {(NATURE_SUBS.find(s => s.key === natureKey) || {}).hint} · neutral natures omitted
                    </span>
                  </div>
                )}

                {c.key === "typematch" && on && (
                  <div style={{ margin: "8px 0 4px 30px", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                    <SubPill small active={typeMatchKey === "weak"} onClick={() => setTypeMatchKey("weak")}>
                      Supereffective
                    </SubPill>
                    <SubPill small active={typeMatchKey === "resist"} onClick={() => setTypeMatchKey("resist")}>
                      Resisted
                    </SubPill>
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>
                      {typeMatchKey === "weak" ? "what the type hits hard" : "what the type resists"}
                    </span>
                  </div>
                )}

                {c.key === "abilities" && on && (
                  <label
                    style={{ margin: "8px 0 4px 30px", display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13, cursor: "pointer" }}
                    onClick={() => setAbilSkipMono(v => !v)}
                  >
                    <span style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${abilSkipMono ? "var(--gold)" : "rgba(255,255,255,.35)"}`,
                      background: abilSkipMono ? "var(--gold)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#1B1D36", fontSize: 10, fontWeight: 900,
                    }}>{abilSkipMono ? "✓" : ""}</span>
                    Skip Pokémon with only one tracked ability
                  </label>
                )}

                {c.key === "damage" && on && (
                  <div style={{
                    margin: "8px 0 4px 30px", padding: "12px",
                    background: "rgba(255,255,255,.03)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.08)",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    {hasTeam && (
                      <div>
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".12em",
                          textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 6,
                        }}>Matchups from</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <SubPill small active={matchSrc === "meta"} onClick={() => setMatchSrc("meta")}>Meta only</SubPill>
                          <SubPill small active={matchSrc === "teamVsMeta"} onClick={() => setMatchSrc("teamVsMeta")}>My team + meta</SubPill>
                          <SubPill small active={matchSrc === "team"} onClick={() => setMatchSrc("team")}>My team only</SubPill>
                        </div>
                      </div>
                    )}
                    <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13.5, cursor: "pointer" }}
                      onClick={() => setDmgHard(v => !v)}>
                      <span style={{
                        width: 16, height: 16, borderRadius: 4,
                        border: `2px solid ${dmgHard ? "#E5484D" : "rgba(255,255,255,.35)"}`,
                        background: dmgHard ? "#E5484D" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 10, fontWeight: 900,
                      }}>{dmgHard ? "✓" : ""}</span>
                      🔥 Hard mode
                      <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: "auto" }}>
                        real EVs · items · abilities · natures
                      </span>
                    </label>
                    <div style={{ color: "var(--muted)", fontSize: 11.5, lineHeight: 1.5 }}>
                      {dmgHard
                        ? "Attacker and defender use their top EV spread, a random real held item, their ability, and (once fixed) their nature. The move's damage class picks the stats."
                        : "Base stats only — no EVs, items, abilities, or natures. Pure type + base-power intuition."}
                    </div>
                    <div>
                      <div style={{ ...panelHeadStyle, marginBottom: 8 }}><span>Correct calls to finish</span></div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {DUEL_TARGETS.map(tg => {
                          const ton = duelTarget === tg;
                          return (
                            <button key={tg} onClick={() => setDuelTarget(tg)} style={{
                              flex: 1, padding: "9px 4px", borderRadius: 10, cursor: "pointer",
                              background: ton ? "var(--gold)" : "rgba(255,255,255,.05)",
                              border: `1.5px solid ${ton ? "var(--gold)" : "rgba(255,255,255,.14)"}`,
                              color: ton ? "#1B1D36" : "#fff",
                              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, lineHeight: 1,
                            }}>{tg}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {c.key === "speed" && on && (
                  <div style={{
                    margin: "8px 0 4px 30px", padding: "12px",
                    background: "rgba(255,255,255,.03)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.08)",
                    display: "flex", flexDirection: "column", gap: 12,
                  }}>
                    {hasTeam && (
                      <div>
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".12em",
                          textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 6,
                        }}>Matchups from</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <SubPill small active={matchSrc === "meta"} onClick={() => setMatchSrc("meta")}>Meta only</SubPill>
                          <SubPill small active={matchSrc === "teamVsMeta"} onClick={() => setMatchSrc("teamVsMeta")}>My team + meta</SubPill>
                          <SubPill small active={matchSrc === "team"} onClick={() => setMatchSrc("team")}>My team only</SubPill>
                        </div>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { id: "faster", title: "1v1 Duel", sub: "pick the faster mon" },
                        { id: "order", title: "2v2 Turn Order", sub: "order all four" },
                        { id: "scarf", title: "Find the Scarf", sub: "who's holding it?" },
                      ].map(v => {
                        const von = duelVariant === v.id;
                        return (
                          <button key={v.id} onClick={() => setDuelVariant(v.id)} style={{
                            flex: 1, padding: "9px 8px", borderRadius: 10, cursor: "pointer",
                            background: von ? "rgba(255,203,5,.12)" : "rgba(255,255,255,.04)",
                            border: `1.5px solid ${von ? "var(--gold)" : "rgba(255,255,255,.12)"}`,
                            color: "#fff", display: "flex", flexDirection: "column", gap: 2,
                          }}>
                            <span style={{ fontWeight: 800, fontSize: 13.5 }}>{v.title}</span>
                            <span style={{ color: "var(--muted)", fontSize: 11 }}>{v.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                    {duelVariant !== "faster" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13.5, cursor: "pointer" }}
                          onClick={() => setDuelHard(v => !v)}>
                          <span style={{
                            width: 16, height: 16, borderRadius: 4,
                            border: `2px solid ${duelHard ? "#E5484D" : "rgba(255,255,255,.35)"}`,
                            background: duelHard ? "#E5484D" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 10, fontWeight: 900,
                          }}>{duelHard ? "✓" : ""}</span>
                          🔥 Hard mode
                          <span style={{ color: "var(--muted)", fontSize: 11, marginLeft: "auto" }}>
                            {duelVariant === "scarf" ? "Tailwind · PAR · weather · TR" : "Scarf · Tailwind · PAR · weather · TR"}
                          </span>
                        </label>
                        <div style={{ marginTop: 4 }}>
                          <div style={{
                            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".12em",
                            textTransform: "uppercase", color: "rgba(255,255,255,.5)", marginBottom: 6,
                          }}>Speed math</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            <SubPill small active={duelBuild === "none"} onClick={() => setDuelBuild("none")}>
                              Base stats
                            </SubPill>
                            <SubPill small active={duelBuild === "natures"} onClick={() => setDuelBuild("natures")}>
                              ± Spe natures
                            </SubPill>
                            {realAvailable ? (
                              <SubPill small active={duelBuild === "real"} onClick={() => setDuelBuild("real")}>
                                Real builds
                              </SubPill>
                            ) : (
                              <span style={{
                                opacity: .45, border: "1px solid rgba(255,255,255,.15)", borderRadius: 999,
                                padding: "4px 10px", fontSize: 12, color: "rgba(255,255,255,.75)",
                              }}>Real builds</span>
                            )}
                          </div>
                          <div style={{ color: "var(--muted)", fontSize: 11.5, marginTop: 6, lineHeight: 1.5 }}>
                            {duelBuild === "real"
                              ? (duelVariant === "order"
                                ? "L50 speed from each mon's top EV spread + a random real held item (over 10% usage). Real natures join automatically once the data source is fixed."
                                : "L50 speed from each mon's top EV spread — the hidden Scarf stays the puzzle.")
                              : duelBuild === "natures"
                                ? "Random ×1.1 / ×0.9 speed natures dealt each round."
                                : realAvailable
                                  ? "Plain base-stat speeds."
                                  : "Real builds unlocks after the first data pull."}
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <div style={{ ...panelHeadStyle, marginBottom: 8 }}><span>Wins to finish</span></div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {DUEL_TARGETS.map(tg => {
                          const ton = duelTarget === tg;
                          return (
                            <button key={tg} onClick={() => setDuelTarget(tg)} style={{
                              flex: 1, padding: "9px 4px", borderRadius: 10, cursor: "pointer",
                              background: ton ? "var(--gold)" : "rgba(255,255,255,.05)",
                              border: `1.5px solid ${ton ? "var(--gold)" : "rgba(255,255,255,.14)"}`,
                              color: ton ? "#1B1D36" : "#fff",
                              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, lineHeight: 1,
                            }}>{tg}</button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {cat !== "speed" && cat !== "damage" && (
        <section style={panelStyle}>
          <div style={panelHeadStyle}><span>Session goal</span></div>
          <div style={{ display: "flex", gap: 6 }}>
            <SubPill active={!mastery} onClick={() => setMastery(false)}>Standard</SubPill>
            <SubPill active={mastery} onClick={() => setMastery(true)}>Mastery</SubPill>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 11.5, marginTop: 8, lineHeight: 1.5 }}>
            {mastery
              ? `Every card must be answered correctly ${SRS.MASTERY_TARGET} times before it clears. A miss resets that card's count to zero.`
              : "Cards clear on graduation — two Goods or one Easy, and auto-graded quizzes clear on a single correct answer."}
          </div>
        </section>
      )}

      <button
        disabled={!canStart}
        onClick={() => onStart(cat === "speed"
          ? { type: "duel", reg, pool: duelPool, duelCfg: { target: duelTarget, variant: duelVariant, hard: duelHard, buildStyle: duelBuild } }
          : cat === "damage"
          ? { type: "damage", reg, pool: dmgAtkPool, defPool: dmgDefPool,
              dmgCfg: { target: duelTarget, hard: dmgHard },
              moveData: { ...(reg.moveData || {}), ...((team && team.moveData) || {}) } }
          : { type: "flash", reg, pool, deckCfg: { mons: availableMons, count: effCount, skip: lo, cat: effCat, statKey, doShuffle: true, abilSkipMono }, mastery }
        )}
        style={{
          width: "100%", marginTop: 6, padding: "16px", borderRadius: 12, border: "none",
          background: !canStart ? "rgba(255,255,255,.12)" : "var(--gold)",
          color: !canStart ? "rgba(255,255,255,.4)" : "#1B1D36",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, letterSpacing: ".06em",
          textTransform: "uppercase", cursor: !canStart ? "default" : "pointer",
          boxShadow: !canStart ? "none" : "0 4px 18px rgba(255,203,5,.35)",
        }}
      >
        {startLabel}
      </button>

      <p style={{
        color: "var(--muted)", fontSize: 11.5, marginTop: 18, lineHeight: 1.6,
        borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 12,
      }}>
        {reg.source}. Data as of {generated}
        {live ? " (auto-refreshed nightly)" : " (bundled snapshot — deploy for nightly refresh)"}.
        {" "}Artwork from PokéAPI. Flip cards use Again/Hard/Good/Easy grading; checkable quizzes grade themselves.
        In Standard, two Goods or one Easy clears a card and a correct quiz answer clears it
        outright; in Mastery, every card needs {SRS.MASTERY_TARGET} correct answers and a miss
        resets its count.
      </p>
    </div>
  );
}

/* ----------------------- quiz game sub-components ----------------------- */

function SelectRows({ entries, target, picks, onToggle, submitted, threshold }) {
  const targetSet = new Set(target);
  let right = 0, wrong = 0, missed = 0;
  if (submitted) {
    entries.forEach(e => {
      const isT = targetSet.has(e.name), isP = picks.has(e.name);
      if (isT && isP) right++;
      else if (!isT && isP) wrong++;
      else if (isT && !isP) missed++;
    });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {submitted && (
        <div style={{
          fontSize: 13.5, fontWeight: 800, marginBottom: 4,
          color: wrong + missed === 0 ? "#1E7A4D" : "#C0353A",
        }}>
          {wrong + missed === 0 ? "Perfect! 🎯" : `${right} right · ${missed} missed · ${wrong} wrong`}
        </div>
      )}
      {entries.map(e => {
        const isP = picks.has(e.name);
        const isT = targetSet.has(e.name);
        let bg = "#fff", border = "#D5D8E4", color = "#22243E";
        if (!submitted && isP) { border = "#C9A100"; bg = "rgba(255,203,5,.15)"; }
        if (submitted) {
          if (isT && isP) { border = "#30A46C"; bg = "rgba(48,164,108,.12)"; }
          else if (!isT && isP) { border = "#E5484D"; bg = "rgba(229,72,77,.10)"; }
          else if (isT && !isP) { border = "#E8913A"; bg = "rgba(232,145,58,.14)"; }
          else { color = "#9DA0B8"; }
        }
        return (
          <button
            key={e.name}
            onClick={() => onToggle(e.name)}
            disabled={submitted}
            style={{
              display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              background: bg, border: `1.5px solid ${border}`, borderRadius: 9,
              padding: "9px 12px", cursor: submitted ? "default" : "pointer", color,
            }}
          >
            <span style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              border: `2px solid ${isP ? "#C9A100" : "#B7BACB"}`,
              background: isP ? "#FFCB05" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900, color: "#1B1D36",
            }}>{isP ? "✓" : ""}</span>
            <span style={{ fontSize: 15, fontWeight: submitted && isT ? 800 : 600 }}>{e.name}</span>
            {submitted && (
              <span style={{
                marginLeft: "auto", display: "flex", flexDirection: "column",
                alignItems: "flex-end", gap: 3, flexShrink: 0,
              }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 12.5, fontWeight: 700,
                  color: isT ? "#1E7A4D" : "#9DA0B8",
                }}>
                  {e.pct != null ? `${e.pct}%` : (e.distractor ? "other mons" : "—")}
                  {isT && !isP ? " · missed" : ""}
                </span>
                {e.pct != null && (
                  <span style={{
                    width: 46, height: 4, borderRadius: 999,
                    background: "#E4E6F0", overflow: "hidden", display: "block",
                  }}>
                    <span style={{
                      display: "block", width: `${Math.min(100, e.pct)}%`, height: "100%",
                      background: isT ? "#30A46C" : "#B7BACB",
                    }} />
                  </span>
                )}
              </span>
            )}
          </button>
        );
      })}
      {!submitted && (
        <div style={{ fontSize: 11.5, color: "#9DA0B8", marginTop: 2 }}>
          Select everything over {threshold}% usage, then check below.
        </div>
      )}
    </div>
  );
}

function TypeGridSelect({ multOf, target, picks, onToggle, submitted }) {
  const targetSet = new Set(target);
  let right = 0, wrong = 0, missed = 0;
  if (submitted) {
    ALL_TYPES.forEach(tp => {
      const isT = targetSet.has(tp), isP = picks.has(tp);
      if (isT && isP) right++;
      else if (!isT && isP) wrong++;
      else if (isT && !isP) missed++;
    });
  }
  return (
    <div>
      {submitted && (
        <div style={{
          fontSize: 13.5, fontWeight: 800, marginBottom: 8,
          color: wrong + missed === 0 ? "#1E7A4D" : "#C0353A",
        }}>
          {wrong + missed === 0 ? "Perfect! 🎯" : `${right} right · ${missed} missed · ${wrong} wrong`}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {ALL_TYPES.map(tp => {
          const isP = picks.has(tp);
          const isT = targetSet.has(tp);
          const mult = multOf(tp);
          let ring = "transparent", dim = false;
          if (!submitted && isP) ring = "#FFCB05";
          if (submitted) {
            if (isT && isP) ring = "#30A46C";
            else if (!isT && isP) ring = "#E5484D";
            else if (isT && !isP) ring = "#E8913A";
            else dim = true;
          }
          return (
            <button
              key={tp}
              onClick={() => onToggle(tp)}
              disabled={submitted}
              style={{
                background: TYPE_COLORS[tp], color: "#fff", borderRadius: 7,
                padding: "6px 9px", fontSize: 11.5, fontWeight: 800,
                letterSpacing: ".06em", textTransform: "uppercase",
                textShadow: "0 1px 1px rgba(0,0,0,.35)",
                border: "none", outline: `3px solid ${ring}`,
                cursor: submitted ? "default" : "pointer",
                opacity: dim ? 0.35 : 1,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                minWidth: 62,
              }}
            >
              <span>{tp}</span>
              {submitted && (
                <span style={{ fontSize: 10.5, fontFamily: "var(--mono)", fontWeight: 700 }}>
                  {multLabel(mult)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* natureChart tap game: pick the boosted stat (red) then the dropped stat
   (blue), from the five modifiable stats. Two independent selections. */
function NatureTapGrid({ nature, boostPick, dropPick, onPick, submitted }) {
  const stats = STAT_KEYS_MOD;
  const phase = boostPick == null ? "boost" : "drop";
  return (
    <div>
      {!submitted && (
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8,
          color: phase === "boost" ? "#C0353A" : "#2D6BD4" }}>
          {phase === "boost" ? "1 · Tap the stat it RAISES (+10%)" : "2 · Tap the stat it LOWERS (−10%)"}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {stats.map(k => {
          const isBoost = boostPick === k, isDrop = dropPick === k;
          const correctBoost = submitted && nature.plus === k;
          const correctDrop = submitted && nature.minus === k;
          let bg = "#fff", border = "#D5D8E4", color = "#22243E", ring = "transparent";
          if (!submitted) {
            if (isBoost) { bg = "rgba(229,72,77,.14)"; border = "#E5484D"; color = "#C0353A"; }
            else if (isDrop) { bg = "rgba(74,143,231,.14)"; border = "#2D6BD4"; color = "#2D6BD4"; }
          } else {
            if (correctBoost) { bg = "rgba(229,72,77,.16)"; border = "#E5484D"; color = "#C0353A"; }
            else if (correctDrop) { bg = "rgba(74,143,231,.16)"; border = "#2D6BD4"; color = "#2D6BD4"; }
            else { color = "#9DA0B8"; }
            // mark a wrong pick
            if (isBoost && !correctBoost) ring = "#E5484D";
            if (isDrop && !correctDrop) ring = "#2D6BD4";
          }
          return (
            <button key={k} onClick={() => onPick(k)} disabled={submitted}
              style={{
                minWidth: 66, padding: "12px 10px", borderRadius: 10,
                background: bg, border: `2px solid ${border}`, outline: ring === "transparent" ? "none" : `3px solid ${ring}`,
                color, cursor: submitted ? "default" : "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
              <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, lineHeight: 1 }}>
                {STAT_LABEL[k]}
              </span>
              {submitted && (correctBoost || correctDrop) && (
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700 }}>
                  {correctBoost ? "+10%" : "−10%"}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {submitted && (
        <div style={{ marginTop: 12, fontSize: 14, color: "#4A4D6B",
          borderLeft: "3px solid #FFCB05", paddingLeft: 12, lineHeight: 1.6 }}>
          <b>{nature.name}</b>: <span style={{ color: "#C0353A", fontWeight: 700 }}>+{STAT_LABEL[nature.plus]}</span>
          {" / "}<span style={{ color: "#2D6BD4", fontWeight: 700 }}>−{STAT_LABEL[nature.minus]}</span>
        </div>
      )}
    </div>
  );
}

/* Group games: entries are nature names; select every one that raises (or
   lowers) the target stat. Reuses the SelectRows look but keyed on natures. */
function NatureGroupSelect({ entries, target, picks, onToggle, submitted, accent }) {
  const targetSet = new Set(target);
  let right = 0, wrong = 0, missed = 0;
  if (submitted) {
    entries.forEach(e => {
      const isT = targetSet.has(e.name), isP = picks.has(e.name);
      if (isT && isP) right++; else if (!isT && isP) wrong++; else if (isT && !isP) missed++;
    });
  }
  return (
    <div>
      {submitted && (
        <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 8,
          color: wrong + missed === 0 ? "#1E7A4D" : "#C0353A" }}>
          {wrong + missed === 0 ? "Perfect! 🎯" : `${right} right · ${missed} missed · ${wrong} wrong`}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {entries.map(e => {
          const isP = picks.has(e.name), isT = targetSet.has(e.name);
          let bg = "#fff", border = "#D5D8E4", color = "#22243E";
          if (!submitted && isP) { border = accent; bg = accent + "22"; color = accent; }
          if (submitted) {
            if (isT && isP) { border = "#30A46C"; bg = "rgba(48,164,108,.12)"; color = "#1E7A4D"; }
            else if (!isT && isP) { border = "#E5484D"; bg = "rgba(229,72,77,.10)"; color = "#C0353A"; }
            else if (isT && !isP) { border = "#E8913A"; bg = "rgba(232,145,58,.14)"; color = "#8A5A1A"; }
            else { color = "#9DA0B8"; }
          }
          return (
            <button key={e.name} onClick={() => onToggle(e.name)} disabled={submitted}
              style={{
                padding: "8px 12px", borderRadius: 9, background: bg,
                border: `1.5px solid ${border}`, color,
                fontSize: 14, fontWeight: submitted && isT ? 800 : 600,
                cursor: submitted ? "default" : "pointer",
              }}>
              {e.name}
            </button>
          );
        })}
      </div>
      {!submitted && (
        <div style={{ fontSize: 11.5, color: "#9DA0B8", marginTop: 8 }}>
          Tap every matching nature, then check below.
        </div>
      )}
    </div>
  );
}

const abilityBlurbCache = {};
function AbilityBlurb({ name }) {
  const key = name.toLowerCase();
  const [text, setText] = useState(abilityBlurbCache[key]);
  useEffect(() => {
    let alive = true;
    if (abilityBlurbCache[key] !== undefined) { setText(abilityBlurbCache[key]); return; }
    const slug = key.replace(/[.'’()]/g, "").trim().replace(/\s+/g, "-");
    fetch(`https://pokeapi.co/api/v2/ability/${slug}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(j => {
        const en = (j.effect_entries || []).find(e => e.language && e.language.name === "en");
        const blurb = en ? (en.short_effect || en.effect || "") : "";
        abilityBlurbCache[key] = blurb || null;
        if (alive) setText(blurb || null);
      })
      .catch(() => { abilityBlurbCache[key] = null; if (alive) setText(null); });
    return () => { alive = false; };
  }, [key]);
  if (!text) return null;
  return (
    <div style={{
      marginTop: 6, fontSize: 13.5, color: "#4A4D6B",
      borderLeft: "3px solid #FFCB05", paddingLeft: 12, lineHeight: 1.6,
    }}>
      <b>{name}:</b> {text}
    </div>
  );
}

function MCOptions({ card, picked, onPick, submitted }) {
  const { options, correct, mon, cat } = card;
  const ownPct = cat === "abilities"
    ? Object.fromEntries((mon.abilities || []).map(norm).map(e => [e.name, e.pct]))
    : {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {options.map(opt => {
        const isC = opt === correct;
        const isP = picked === opt;
        let bg = "#fff", border = "#D5D8E4", color = "#22243E";
        if (submitted) {
          if (isC) { border = "#30A46C"; bg = "rgba(48,164,108,.12)"; }
          else if (isP) { border = "#E5484D"; bg = "rgba(229,72,77,.10)"; }
          else { color = "#9DA0B8"; }
        }
        return (
          <button
            key={opt}
            onClick={() => onPick(opt)}
            disabled={submitted}
            style={{
              display: "flex", alignItems: "center", gap: 10, textAlign: "left",
              background: bg, border: `1.5px solid ${border}`, borderRadius: 9,
              padding: "11px 13px", cursor: submitted ? "default" : "pointer",
              color, fontSize: 15.5, fontWeight: submitted && isC ? 800 : 600,
            }}
          >
            {opt}
            {submitted && cat === "abilities" && (
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, color: isC ? "#1E7A4D" : "#9DA0B8" }}>
                {ownPct[opt] != null ? `${ownPct[opt]}%`
                  : Object.prototype.hasOwnProperty.call(ownPct, opt) ? "runs it" : "not this mon"}
              </span>
            )}
            {submitted && cat === "builds" && isC && card.buildPct != null && (
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, color: "#1E7A4D" }}>
                {card.buildPct}% of builds
              </span>
            )}
            {submitted && isC && cat !== "abilities" && cat !== "builds" && (
              <span style={{ marginLeft: "auto", fontSize: 13 }}>✓</span>
            )}
          </button>
        );
      })}
      {submitted && (cat === "offense" || cat === "defense") && (
        <div style={{
          marginTop: 6, fontSize: 14, color: "#4A4D6B",
          borderLeft: "3px solid #FFCB05", paddingLeft: 12, lineHeight: 1.7,
        }}>
          {cat === "offense"
            ? <span><b>Atk {mon.stats.atk}</b> vs <b>SpA {mon.stats.spa}</b> (within {MIXED_GAP} = mixed)</span>
            : <span><b>Def {mon.stats.def}</b> vs <b>SpD {mon.stats.spd}</b> (within {MIXED_GAP} = balanced)</span>}
        </div>
      )}
      {submitted && cat === "abilities" && <AbilityBlurb name={correct} />}
      {!submitted && (
        <div style={{ fontSize: 11.5, color: "#9DA0B8" }}>Tap your answer.</div>
      )}
    </div>
  );
}

/* ----------------------------- quiz screen ----------------------------- */

const CAT_PROMPT = {
  natures: "Most common natures?",
  natureChart: "Tap the boosted stat, then the dropped stat",
  natBoost: "Which stat does this nature raise?",
  natDrop: "Which stat does this nature lower?",
  moves: "Select every move over 30% usage",
  items: "Select every item over 10% usage",
  abilities: "Most common ability?",
  builds: "Which is its most common build?",
  offense: "Physical, special, or mixed attacker?",
  defense: "Physically or specially bulkier?",
};
const CAT_SHORT = {
  natureChart: "nature +/−", natBoost: "boost", natDrop: "drop",
  natGroupBoost: "boost group", natGroupDrop: "drop group",
  weak: "super effective", resist: "resists", builds: "build",
  offense: "offense", defense: "defense", abilities: "ability",
};

const GRADES = [
  { key: "again", label: "Again", color: "#E5484D" },
  { key: "hard", label: "Hard", color: "#E8913A" },
  { key: "good", label: "Good", color: "#30A46C" },
  { key: "easy", label: "Easy", color: "#4A8FE7" },
];

function QuizScreen({ initialQueue, pool, reg, mastery, onDone, onQuit }) {
  const total = initialQueue.length;
  const [queue, setQueue] = useState(initialQueue);
  const [doneCards, setDoneCards] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [picks, setPicks] = useState(new Set());
  const [natBoostPick, setNatBoostPick] = useState(null);
  const [natDropPick, setNatDropPick] = useState(null);
  const [wasRight, setWasRight] = useState(false);

  const item = queue[0];

  const gradeHint = (g) => {
    if (!item) return "";
    if (mastery) {
      if (g === "easy" || g === "good") {
        const nextCorrect = (item.correct || 0) + 1;
        return nextCorrect >= SRS.MASTERY_TARGET
          ? "mastered ✓"
          : `${SRS.MASTERY_TARGET - nextCorrect} more correct`;
      }
      if (g === "hard") return "no credit";
      return "resets to 0";
    }
    if (g === "easy") return "done ✓";
    if (g === "good") return item.step + 1 >= SRS.GRADUATE_STEPS ? "done ✓" : `~${SRS.GAPS.good} cards`;
    if (g === "hard") return `~${SRS.GAPS.hard} cards`;
    return `~${SRS.GAPS.again} cards`;
  };

  const grade = (g) => {
    if (!item) return;
    const nextLog = { ...log, [g]: log[g] + 1 };
    const rest = queue.slice(1);
    const updated = { ...item, reviews: item.reviews + 1, correct: item.correct || 0 };

    let graduated = false;
    if (mastery) {
      // Mastery: a card clears only after MASTERY_TARGET correct answers.
      // Hard is a pass but earns no credit; Again wipes the count.
      if (g === "easy" || g === "good") {
        updated.correct = (item.correct || 0) + 1;
        updated.step = updated.correct;
        graduated = updated.correct >= SRS.MASTERY_TARGET;
      } else if (g === "hard") {
        updated.step = item.step;
      } else {
        updated.correct = 0;
        updated.step = 0;
        updated.lapses = item.lapses + 1;
      }
    } else if (g === "easy") graduated = true;
    else if (g === "good") {
      updated.step = item.step + 1;
      graduated = updated.step >= SRS.GRADUATE_STEPS;
    } else if (g === "hard") {
      updated.step = item.step;
    } else {
      updated.step = 0;
      updated.lapses = item.lapses + 1;
    }

    if (graduated) {
      const nextDone = [...doneCards, updated];
      if (rest.length === 0) { onDone({ done: nextDone, log: nextLog, total, mastery }); return; }
      setDoneCards(nextDone);
      setQueue(rest);
    } else {
      const gap = SRS.GAPS[g] + Math.floor(Math.random() * (SRS.JITTER + 1));
      const pos = Math.min(gap, rest.length);
      setQueue([...rest.slice(0, pos), updated, ...rest.slice(pos)]);
    }
    setLog(nextLog);
    setFlipped(false);
    setPicks(new Set());
    setNatBoostPick(null);
    setNatDropPick(null);
    setWasRight(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!item) return;
      const isFlip = FLIP_CATS.includes(item.card.cat);
      if (e.key === " " || e.key === "Enter") {
        if (isFlip && !flipped) { e.preventDefault(); setFlipped(true); }
        else if (!isFlip && flipped) { e.preventDefault(); grade(wasRight ? "easy" : "again"); }
      } else if (flipped && isFlip && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        grade(GRADES[Number(e.key) - 1].key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!item) return null;
  const { card } = item;
  const isFlipCat = FLIP_CATS.includes(card.cat);
  const isSelectCat = SELECT_CATS.includes(card.cat);
  const isMcCat = MC_CATS.includes(card.cat);
  const isNatTap = NAT_TAP_CATS.includes(card.cat);
  const newCount = queue.filter(q => q.reviews === 0).length;
  const learningCount = queue.length - newCount;

  const prompt = card.cat === "stats"
    ? `Base ${STAT_LABEL[card.statKey]}?`
    : card.cat === "natGroupBoost"
      ? `Select every nature that RAISES ${STAT_LABEL[card.statKey]}`
      : card.cat === "natGroupDrop"
        ? `Select every nature that LOWERS ${STAT_LABEL[card.statKey]}`
    : card.cat === "weak"
      ? `Select every type ${card.type.toUpperCase()} hits super effectively`
      : card.cat === "resist"
        ? `Select every attacking type ${card.type.toUpperCase()} resists (incl. immunities)`
        : CAT_PROMPT[card.cat];

  const stateChip = item.reviews === 0
    ? { text: "new", color: "#4A8FE7" }
    : mastery
      ? (item.lapses > 0 && (item.correct || 0) === 0
        ? { text: `relearning · 0/${SRS.MASTERY_TARGET}`, color: "#E5484D" }
        : { text: `${item.correct || 0}/${SRS.MASTERY_TARGET} correct`, color: "#E8913A" })
      : item.lapses > 0 && item.step === 0
        ? { text: "relearning", color: "#E5484D" }
        : { text: `learning ${item.step}/${SRS.GRADUATE_STEPS}`, color: "#E8913A" };

  const togglePick = (name) => {
    if (flipped) return;
    setPicks(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };
  const mcPick = (opt) => {
    if (flipped) return;
    setPicks(new Set([opt]));
    setWasRight(opt === card.correct);
    setFlipped(true);
  };
  const checkSelection = () => {
    const names = (card.cat === "weak" || card.cat === "resist")
      ? ALL_TYPES
      : card.entries.map(e => e.name);
    const targetSet = new Set(card.target);
    setWasRight(names.every(n => targetSet.has(n) === picks.has(n)));
    setFlipped(true);
  };
  const natTapPick = (statKey) => {
    if (flipped) return;
    if (natBoostPick == null) {
      setNatBoostPick(statKey);
    } else if (statKey === natBoostPick) {
      setNatBoostPick(null); // tapping the boost again deselects it
    } else {
      const right = statKey === card.nature.minus && natBoostPick === card.nature.plus;
      setNatDropPick(statKey);
      setWasRight(right);
      setFlipped(true);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(doneCards.length / total) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
      </div>
      <div style={{
        display: "flex", gap: 14, justifyContent: "flex-end", marginBottom: 12,
        fontFamily: "var(--mono)", fontSize: 12,
      }}>
        <span style={{ color: "#7FB0F0" }}>{newCount} new</span>
        <span style={{ color: "#F0A45C" }}>{learningCount} learning</span>
        <span style={{ color: "#6FCF97" }}>{doneCards.length} done</span>
      </div>

      <div
        role={isFlipCat ? "button" : undefined}
        tabIndex={isFlipCat ? 0 : undefined}
        aria-label={isFlipCat ? (flipped ? "Answer shown" : "Tap to reveal answer") : undefined}
        onClick={() => { if (isFlipCat) setFlipped(true); }}
        onKeyDown={e => { if (isFlipCat && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setFlipped(true); } }}
        style={{
          background: "#F5F6FA", borderRadius: 18, minHeight: 380,
          padding: "22px 20px", color: "#22243E",
          cursor: isFlipCat && !flipped ? "pointer" : "default",
          boxShadow: "0 10px 30px rgba(0,0,0,.45), 0 2px 0 rgba(255,255,255,.15) inset",
          display: "flex", flexDirection: "column",
          outline: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {card.mon ? <MonSprite mon={card.mon} size={56} />
            : card.nature ? <NatureOrb nature={card.nature} size={56} />
            : card.type ? <TypeOrb types={[card.type]} size={56} text={card.type[0].toUpperCase()} />
            : <StatOrb statKey={card.statKey} size={56} />}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 30, lineHeight: 1.02,
              textTransform: "uppercase", letterSpacing: ".01em", overflowWrap: "anywhere",
            }}>{card.mon ? card.mon.name
              : card.nature ? card.nature.name
              : card.type ? cap(card.type)
              : STAT_LABEL[card.statKey] || "Stat"}</div>
            {card.mon ? (
              <div style={{ display: "flex", gap: 6, marginTop: 5, alignItems: "center", flexWrap: "wrap" }}>
                {monTypes(card.mon).filter(t => t !== "unknown").map(t => <TypeChip key={t} t={t} />)}
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8" }}>
                  usage #{card.mon.rank}{card.mon.usage != null ? ` · ${card.mon.usage}%` : ""}
                </span>
                {reg.hasWinrate && card.mon.winrate != null && (
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8" }}>
                    · {card.mon.winrate}% WR
                  </span>
                )}
              </div>
            ) : (
              <div style={{ marginTop: 5, display: "flex", gap: 6, alignItems: "center" }}>
                {card.type && <TypeChip t={card.type} />}
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8" }}>
                  {card.type ? "type matchup"
                    : card.cat === "natGroupBoost" ? "which natures raise this?"
                    : card.cat === "natGroupDrop" ? "which natures lower this?"
                    : "nature chart"}
                </span>
              </div>
            )}
          </div>
          <span style={{
            fontFamily: "var(--mono)", fontSize: 10.5, color: stateChip.color,
            border: `1px solid ${stateChip.color}`, borderRadius: 999, padding: "3px 9px",
            whiteSpace: "nowrap", alignSelf: "flex-start",
          }}>{stateChip.text}</span>
        </div>

        <div style={{ height: 1, background: "#DDDFEA", margin: "16px 0" }} />

        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".14em",
          textTransform: "uppercase", color: "#8A8DA8", marginBottom: 10,
        }}>{prompt}</div>

        {isNatTap ? (
          <NatureTapGrid
            nature={card.nature}
            boostPick={natBoostPick}
            dropPick={natDropPick}
            onPick={natTapPick}
            submitted={flipped}
          />
        ) : (card.cat === "natGroupBoost" || card.cat === "natGroupDrop") ? (
          <NatureGroupSelect
            entries={card.entries}
            target={card.target}
            picks={picks}
            onToggle={togglePick}
            submitted={flipped}
            accent={card.cat === "natGroupBoost" ? "#E5484D" : "#2D6BD4"}
          />
        ) : isSelectCat && (card.cat === "weak" || card.cat === "resist") ? (
          <TypeGridSelect
            multOf={(tp) => {
              const eff = (a, d) => (TYPE_CHART[a][d] === undefined ? 1 : TYPE_CHART[a][d]);
              return card.cat === "weak" ? eff(card.type, tp) : eff(tp, card.type);
            }}
            target={card.target}
            picks={picks}
            onToggle={togglePick}
            submitted={flipped}
          />
        ) : isSelectCat ? (
          <SelectRows
            entries={card.entries}
            target={card.target}
            picks={picks}
            onToggle={togglePick}
            submitted={flipped}
            threshold={card.cat === "moves" ? 30 : 10}
          />
        ) : isMcCat ? (
          <MCOptions
            card={card}
            picked={[...picks][0] || null}
            onPick={mcPick}
            submitted={flipped}
          />
        ) : !flipped ? (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            color: "#B7BACB", fontSize: 15, fontWeight: 600,
          }}>Tap to reveal</div>
        ) : (
          <Answer card={card} pool={pool} />
        )}
      </div>

      <div style={{ marginTop: 16, minHeight: 74 }}>
        {flipped && isFlipCat ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {GRADES.map(g => (
              <button key={g.key} onClick={() => grade(g.key)} style={{
                borderRadius: 12, border: "none", background: g.color, color: "#fff",
                cursor: "pointer", padding: "11px 4px 9px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,.35)",
              }}>
                <span style={{
                  fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
                  letterSpacing: ".04em", textTransform: "uppercase", lineHeight: 1,
                }}>{g.label}</span>
                <span style={{ fontSize: 10.5, opacity: .9, fontFamily: "var(--mono)" }}>
                  {gradeHint(g.key)}
                </span>
              </button>
            ))}
          </div>
        ) : flipped ? (
          <button onClick={() => grade(wasRight ? "easy" : "again")} style={{
            width: "100%", padding: "12px 4px 10px", borderRadius: 12, border: "none",
            background: wasRight ? "#30A46C" : "#E5484D", color: "#fff", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
          }}>
            <span style={{
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              letterSpacing: ".05em", textTransform: "uppercase", lineHeight: 1,
            }}>Next →</span>
            <span style={{ fontSize: 10.5, opacity: .9, fontFamily: "var(--mono)" }}>
              {wasRight
                ? (mastery
                  ? ((item.correct || 0) + 1 >= SRS.MASTERY_TARGET
                    ? "correct — mastered ✓"
                    : `correct — ${(item.correct || 0) + 1} of ${SRS.MASTERY_TARGET}`)
                  : "correct — card cleared ✓")
                : (mastery ? "miss — count resets to 0" : "you'll see this one again soon")}
            </span>
          </button>
        ) : isSelectCat ? (
          <button onClick={checkSelection} style={{
            width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.25)",
            background: "transparent", color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer", padding: "14px",
          }}>Check answer ({picks.size} selected)</button>
        ) : (isMcCat || isNatTap) ? (
          <div style={{
            textAlign: "center", color: "var(--muted)", fontSize: 13, paddingTop: 14,
          }}>{isNatTap ? "Tap the boosted, then the dropped stat" : "Pick an answer on the card"}</div>
        ) : (
          <button onClick={() => setFlipped(true)} style={{
            width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.25)",
            background: "transparent", color: "#fff", fontWeight: 700, fontSize: 16,
            cursor: "pointer", padding: "14px",
          }}>Reveal</button>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- flip answers ----------------------------- */

function Answer({ card, pool }) {
  const { mon, cat } = card;

  if (cat === "natureChart") {
    const n = card.nature;
    if (!n.plus) {
      return (
        <div>
          <div style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 44, lineHeight: 1,
            color: "#8A8DA8",
          }}>Neutral</div>
          <div style={{ marginTop: 10, fontSize: 14, color: "#4A4D6B" }}>
            No stat changes — all ×1.0. One of the five flavor-only natures.
          </div>
        </div>
      );
    }
    const row = (dir, statKey) => (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 34, lineHeight: 1,
          color: dir === "+" ? "#1E7A4D" : "#C0353A", width: 30, textAlign: "center",
        }}>{dir === "+" ? "▲" : "▼"}</span>
        <span style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 42, lineHeight: 1,
          color: "#22243E",
        }}>{STAT_LABEL[statKey]}</span>
        <span style={{
          marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 14,
          color: dir === "+" ? "#1E7A4D" : "#C0353A", fontWeight: 700,
        }}>{dir === "+" ? "+10%" : "−10%"}</span>
        <span style={{
          width: 14, height: 14, borderRadius: "50%", background: STAT_COLOR[statKey],
          boxShadow: "inset 0 -2px 3px rgba(0,0,0,.25)",
        }} />
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 6 }}>
        {row("+", n.plus)}
        {row("-", n.minus)}
      </div>
    );
  }

  if (cat === "stats") {
    const val = mon.stats[card.statKey];
    const isSpeed = card.statKey === "spe";
    const ctx = isSpeed ? speedContext(mon, pool) : null;
    return (
      <div>
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 88, lineHeight: 1,
          color: "#22243E",
        }}>
          {val}
          <span style={{ fontSize: 22, color: "#8A8DA8", marginLeft: 8 }}>
            base {STAT_LABEL[card.statKey]}
          </span>
        </div>
        {isSpeed && ctx && (
          <div style={{
            marginTop: 14, fontSize: 13.5, lineHeight: 1.7, color: "#4A4D6B",
            borderLeft: "3px solid #FFCB05", paddingLeft: 12,
          }}>
            {ctx.slower && <div>Outspeeds <b>{ctx.slower.name}</b> ({ctx.slower.stats.spe})</div>}
            {ctx.ties.length > 0 && <div>Speed-ties <b>{ctx.ties.map(t => t.name).join(", ")}</b></div>}
            {ctx.faster && <div>Slower than <b>{ctx.faster.name}</b> ({ctx.faster.stats.spe})</div>}
            {!ctx.faster && <div><b>Fastest</b> of your studied set</div>}
          </div>
        )}
      </div>
    );
  }

  // generic ordered list (common natures)
  const list = (mon[cat] || []).map(norm);
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
      {list.map((entry, idx) => (
        <li key={entry.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 16,
            color: idx === 0 ? "#C9A100" : "#B0B3C6", width: 22, textAlign: "right",
          }}>{idx + 1}</span>
          <span style={{
            fontSize: 16.5, fontWeight: idx === 0 ? 800 : 500,
            color: idx === 0 ? "#22243E" : "#4A4D6B",
          }}>{entry.name}</span>
          {entry.pct != null && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#9DA0B8", marginLeft: "auto" }}>
              {entry.pct}%
            </span>
          )}
        </li>
      ))}
      <li style={{ fontSize: 11.5, color: "#9DA0B8", marginTop: 4, paddingLeft: 32 }}>
        in ladder usage order
      </li>
    </ol>
  );
}

/* ----------------------------- speed duel (1v1) ----------------------------- */

function samplePair(pool, prevKey) {
  for (let tries = 0; tries < 20; tries++) {
    const a = rollMegaState(pool[Math.floor(Math.random() * pool.length)]);
    let b = rollMegaState(pool[Math.floor(Math.random() * pool.length)]);
    if ((a.baseName || a.name) === (b.baseName || b.name)) continue;
    const key = [a.baseName || a.name, b.baseName || b.name].sort().join("|");
    if (key === prevKey && tries < 15) continue;
    return { pair: [a, b], key };
  }
  return { pair: [pool[0], pool[1]], key: null };
}

function DuelScreen({ pool, target, onDone, onQuit }) {
  const [round, setRound] = useState(() => samplePair(pool, null));
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [picked, setPicked] = useState(null);

  const [a, b] = round.pair;
  const correct = a.stats.spe > b.stats.spe ? 0 : b.stats.spe > a.stats.spe ? 1 : "tie";
  const answered = picked !== null;
  const wasRight = answered && picked === correct;

  const pick = (choice) => {
    if (answered) return;
    setPicked(choice);
    setAttempts(n => n + 1);
    if (choice === correct) {
      setWins(w => w + 1);
      setStreak(s => { const ns = s + 1; setBestStreak(bs => Math.max(bs, ns)); return ns; });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setPicked(null);
    setRound(samplePair(pool, round.key));
  };

  const duelCard = (mon, idx) => {
    const isCorrectSide = correct === idx;
    const border = !answered
      ? "rgba(255,255,255,.14)"
      : isCorrectSide ? "#30A46C"
      : picked === idx ? "#E5484D" : "rgba(255,255,255,.14)";
    return (
      <button
        key={mon.name}
        onClick={() => pick(idx)}
        disabled={answered}
        style={{
          flex: 1, minWidth: 0, cursor: answered ? "default" : "pointer",
          background: "#F5F6FA", borderRadius: 16, padding: "16px 10px 14px",
          border: `2.5px solid ${border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "#22243E",
          boxShadow: "0 8px 24px rgba(0,0,0,.4)",
          transition: "border-color .15s",
        }}
      >
        <MonSprite mon={mon} size={96} />
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, lineHeight: 1.05,
          textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere",
        }}>{mon.name}</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {monTypes(mon).filter(t => t !== "unknown").map(t => <TypeChip key={t} t={t} />)}
        </div>
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 34, lineHeight: 1,
          color: answered ? (isCorrectSide ? "#1E7A4D" : "#8A8DA8") : "transparent",
          minHeight: 34, transition: "color .15s",
        }}>
          {answered ? mon.stats.spe : "?"}
        </div>
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target} wins
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 14,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>
        {streak > 0 ? `🔥 ${streak} streak` : " "}
      </div>

      <div style={{
        textAlign: "center", fontFamily: "var(--mono)", fontSize: 12,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 12,
      }}>Which is faster (base Speed)?</div>

      <div style={{ display: "flex", gap: 10, alignItems: "stretch", position: "relative" }}>
        {duelCard(a, 0)}
        {duelCard(b, 1)}
        <div style={{
          position: "absolute", left: "50%", top: "38%", transform: "translate(-50%,-50%)",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 26, color: "var(--gold)",
          textShadow: "0 2px 8px rgba(0,0,0,.6)", pointerEvents: "none", letterSpacing: ".04em",
        }}>VS</div>
      </div>

      <div style={{ marginTop: 12 }}>
        {!answered ? (
          <button onClick={() => pick("tie")} style={{
            width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.25)",
            background: "transparent", color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: "pointer", padding: "13px",
          }}>⚖️ Speed tie</button>
        ) : (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14.5, lineHeight: 1.5, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>{" "}
              {correct === "tie"
                ? `${a.name} and ${b.name} speed-tie at ${a.stats.spe} — it's a coin flip.`
                : `${round.pair[correct].name} is faster, ${round.pair[correct].stats.spe} to ${round.pair[correct === 0 ? 1 : 0].stats.spe}.`}
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
              boxShadow: "0 4px 18px rgba(255,203,5,.35)",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next duel →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- turn order (2v2) ----------------------------- */

/* buildStyle: "none" (base stats), "natures" (random ±Spe natures dealt), or
   "real" (each mon's top EV spread; its real nature once the data source is
   fixed; and — in the turn-order game — a random real held item drawn from
   its over-10%-usage items; Megas only ever hold their Mega Stone). */
function applyBuildStyle(mons, mods, buildStyle, withItems) {
  if (buildStyle === "natures") {
    mons.forEach(m => {
      const r = Math.random();
      if (r < 0.35) {
        mods.natures[m.name] = NATURE_PLUS_SPE[Math.floor(Math.random() * NATURE_PLUS_SPE.length)];
      } else if (r < 0.7) {
        mods.natures[m.name] = NATURE_MINUS_SPE[Math.floor(Math.random() * NATURE_MINUS_SPE.length)];
      }
    });
  }
  if (buildStyle === "real") {
    mods.realBase = {};
    mods.realItems = withItems ? {} : null;
    mons.forEach(m => {
      const b = (m.builds || [])[0];
      const ev = b ? speEV(b) : 0;
      mods.realBase[m.name] = { stat: realSpeedStat(m.stats.spe, ev), ev };
      if (b && b.nature && natureSpeedMult(b.nature) !== 1) mods.natures[m.name] = b.nature;
      if (!withItems) return;
      if (isMegaEntry(m)) {
        const stone = (m.items || []).map(norm).map(e => e.name)
          .find(n => MEGA_STONE.test(n) && n !== "Eviolite");
        if (stone) mods.realItems[m.name] = stone;
        return;
      }
      const opts = (m.items || []).map(norm).filter(e => e.pct != null && e.pct > 10).map(e => e.name);
      if (!opts.length) return;
      const pick = opts[Math.floor(Math.random() * opts.length)];
      mods.realItems[m.name] = pick;
      if (pick === "Choice Scarf") mods.scarf.push(m.name);
      if (pick === "Iron Ball") mods.ironBall.push(m.name);
    });
  }
}

function buildRound(pool, prevKey, hard, buildStyle) {
  let mons = pool.slice(0, 4), key = null;
  for (let tries = 0; tries < 30; tries++) {
    mons = shuffle(pool).slice(0, 4).map(rollMegaState);
    key = mons.map(m => m.baseName || m.name).sort().join("|");
    if (key !== prevKey || tries >= 25) break;
  }
  const mods = {
    weather: null, weatherSetBy: null, trickRoom: false, tailwindSide: null,
    scarf: [], para: [], natures: {}, realBase: null, realItems: null, ironBall: [],
  };
  applyBuildStyle(mons, mods, buildStyle, true);
  if (hard) {
    const setters = [];
    mons.forEach(m => {
      Object.entries(WEATHER_SETTERS).forEach(([ab, w]) => {
        if (hasAbility(m, ab)) setters.push({ name: m.name, ability: ab, weather: w });
      });
    });
    if (setters.length) {
      // Coin flip: even with a setter fielded, sometimes your weather is down.
      if (Math.random() < 0.5) {
        const s = setters[Math.floor(Math.random() * setters.length)];
        mods.weather = s.weather;
        mods.weatherSetBy = s;
      }
    } else {
      const relevant = Object.keys(WEATHER_META).filter(w => mons.some(m => boostAbility(m, w)));
      const r = Math.random();
      if (relevant.length && r < 0.5) {
        mods.weather = relevant[Math.floor(Math.random() * relevant.length)];
      } else if (r < 0.65) {
        const ws = Object.keys(WEATHER_META);
        mods.weather = ws[Math.floor(Math.random() * ws.length)];
      }
    }
    if (Math.random() < 0.3) mods.tailwindSide = Math.random() < 0.5 ? 0 : 1;
    if (Math.random() < 0.18) mods.trickRoom = true;
    if (buildStyle !== "real") {
      mons.forEach(m => {
        if (mods.scarf.length < 2 && Math.random() < 0.15) mods.scarf.push(m.name);
      });
    }
    const paraPool = mons.filter(m => !mods.scarf.includes(m.name));
    if (Math.random() < 0.25 && paraPool.length) {
      mods.para.push(paraPool[Math.floor(Math.random() * paraPool.length)].name);
    }
    const weatherMatters = mods.weather && mons.some(m => boostAbility(m, mods.weather));
    if (buildStyle !== "real" && !mods.trickRoom && mods.tailwindSide === null &&
        !mods.scarf.length && !mods.para.length && !weatherMatters &&
        !Object.keys(mods.natures).length) {
      mods.scarf.push(mons[Math.floor(Math.random() * 4)].name);
    }
  }
  return { mons, key, mods };
}

/* Effective speed: real-build L50 stat (when present) or base Speed, then
   nature, ×1.5 Scarf, ×0.5 Iron Ball, ×2 Tailwind, ×2 weather ability, ×0.5 PAR. */
function effSpeed(mon, side, mods) {
  const rb = mods.realBase && mods.realBase[mon.name];
  let s = rb ? rb.stat : mon.stats.spe;
  const parts = [];
  const nat = mods.natures && mods.natures[mon.name];
  const natMult = nat ? natureSpeedMult(nat) : 1;
  if (natMult !== 1) {
    s = Math.floor(s * natMult);
    parts.push(`×${natMult} ${nat}`);
  }
  if (mods.scarf.includes(mon.name)) { s *= 1.5; parts.push("×1.5 Scarf"); }
  if (mods.ironBall && mods.ironBall.includes(mon.name)) { s *= 0.5; parts.push("×0.5 Iron Ball"); }
  if (mods.tailwindSide === side) { s *= 2; parts.push("×2 Tailwind"); }
  const wAb = boostAbility(mon, mods.weather);
  if (wAb) { s *= 2; parts.push("×2 " + wAb); }
  if (mods.para.includes(mon.name)) { s *= 0.5; parts.push("×0.5 PAR"); }
  const baseLabel = rb ? `${rb.stat} (L50 · ${rb.ev} Spe EV)` : String(mon.stats.spe);
  return { value: Math.floor(s), breakdown: (parts.length || rb) ? [baseLabel, ...parts].join(" ") : null };
}

function ModChip({ text, bg, fg }) {
  return (
    <span style={{
      background: bg, color: fg || "#fff", borderRadius: 4, padding: "1.5px 6px",
      fontSize: 10, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>{text}</span>
  );
}

function TurnOrderScreen({ pool, target, hard, buildStyle, onDone, onQuit }) {
  const [round, setRound] = useState(() => buildRound(pool, null, hard, buildStyle));
  const [order, setOrder] = useState([]);
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const { mons, mods } = round;
  const sideOf = (mon) => (mons.indexOf(mon) < 2 ? 0 : 1);
  const eff = Object.fromEntries(mons.map(m => [m.name, effSpeed(m, sideOf(m), mods)]));

  const isValidOrder = (names) => {
    const v = names.map(n => eff[n].value);
    return mods.trickRoom
      ? v.every((s, i) => i === 0 || v[i - 1] <= s)
      : v.every((s, i) => i === 0 || v[i - 1] >= s);
  };

  const answered = order.length === 4;
  const wasRight = answered && isValidOrder(order);

  const tap = (name) => {
    if (answered) return;
    const idx = order.indexOf(name);
    if (idx !== -1) { setOrder(order.slice(0, idx)); return; }
    const next = [...order, name];
    setOrder(next);
    if (next.length === 4) {
      setAttempts(a => a + 1);
      if (isValidOrder(next)) {
        setWins(w => w + 1);
        setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
      } else {
        setStreak(0);
      }
    }
  };

  const nextRound = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setOrder([]);
    setRound(buildRound(pool, round.key, hard, buildStyle));
  };

  const sorted = [...mons].sort((a, b) =>
    mods.trickRoom ? eff[a.name].value - eff[b.name].value : eff[b.name].value - eff[a.name].value);
  const groups = [];
  sorted.forEach(m => {
    const g = groups[groups.length - 1];
    if (g && g.v === eff[m.name].value) g.names.push(m.name);
    else groups.push({ v: eff[m.name].value, names: [m.name] });
  });
  const correctText = (mods.trickRoom ? "Trick Room reverses it: " : "") + groups
    .map(g => `${g.names.join(" / ")} (${g.v}${g.names.length > 1 ? ", tie" : ""})`)
    .join(" → ");

  const sideLabel = (text, side) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
      fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".16em",
      textTransform: "uppercase", color: "rgba(255,255,255,.4)",
    }}>
      {text}
      {mods.tailwindSide === side && (
        <span style={{
          color: "#7AC74C", border: "1px solid #7AC74C", borderRadius: 999,
          padding: "1px 8px", letterSpacing: ".08em",
        }}>🍃 Tailwind</span>
      )}
    </div>
  );

  const fieldCard = (mon) => {
    const pos = order.indexOf(mon.name);
    const e = eff[mon.name];
    const chips = [];
    if (mods.scarf.includes(mon.name)) chips.push(<ModChip key="s" text="Choice Scarf" bg="#E8913A" />);
    if (mods.para.includes(mon.name)) chips.push(<ModChip key="p" text="PAR" bg="#F7D02C" fg="#5A4A00" />);
    const wAb = boostAbility(mon, mods.weather);
    if (wAb) chips.push(<ModChip key="w" text={wAb} bg={WEATHER_META[mods.weather].color} />);
    const nat = mods.natures && mods.natures[mon.name];
    if (nat) {
      const m = natureSpeedMult(nat);
      chips.push(<ModChip key="n" text={nat}
        bg={m > 1 ? "#30A46C" : m < 1 ? "#6F35FC" : "#8A8DA8"} />);
    }
    const realIt = mods.realItems && mods.realItems[mon.name];
    if (realIt && realIt !== "Choice Scarf") {
      chips.push(<ModChip key="ri" text={realIt} bg="#4A6FA5" />);
    }
    if (mon.megaActive) chips.push(<ModChip key="mg" text="Mega" bg="#6F35FC" />);
    const border = !answered
      ? (pos !== -1 ? "var(--gold)" : "rgba(255,255,255,.14)")
      : wasRight ? "#30A46C" : "#E5484D";
    return (
      <button
        key={mon.name}
        onClick={() => tap(mon.name)}
        disabled={answered}
        style={{
          position: "relative", minWidth: 0, cursor: answered ? "default" : "pointer",
          background: "#F5F6FA", borderRadius: 14, padding: "12px 6px 10px",
          border: `2.5px solid ${border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          color: "#22243E", boxShadow: "0 6px 18px rgba(0,0,0,.4)",
          transition: "border-color .15s",
        }}
      >
        {pos !== -1 && (
          <span style={{
            position: "absolute", top: -10, right: -6, width: 26, height: 26,
            borderRadius: "50%", background: "var(--gold)", color: "#1B1D36",
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,.4)",
          }}>{pos + 1}</span>
        )}
        <MonSprite mon={mon} size={68} />
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 15, lineHeight: 1.05,
          textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere",
        }}>{mon.name}</div>
        {chips.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>{chips}</div>
        )}
        <div style={{ minHeight: 34, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, lineHeight: 1,
            color: answered ? "#22243E" : "transparent",
          }}>{answered ? e.value : "?"}</span>
          {answered && e.breakdown && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "#8A8DA8", marginTop: 2 }}>
              {e.breakdown}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target} wins
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 10,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>
        {streak > 0 ? `🔥 ${streak} streak` : " "}
      </div>

      <div style={{
        textAlign: "center", fontFamily: "var(--mono)", fontSize: 12,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 10,
      }}>{hard ? "Tap all four in the order they move" : "Tap all four in move order — fastest first"}</div>

      {(mods.weather || mods.trickRoom) && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {mods.weather && (
            <span style={{
              background: WEATHER_META[mods.weather].color, color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".04em",
              textShadow: "0 1px 2px rgba(0,0,0,.3)",
            }}>
              {WEATHER_META[mods.weather].icon} {WEATHER_META[mods.weather].label}
              {mods.weatherSetBy && (
                <span style={{ fontWeight: 600, fontSize: 11.5, opacity: .92 }}>
                  {" "}· {mods.weatherSetBy.name}'s {mods.weatherSetBy.ability}
                </span>
              )}
            </span>
          )}
          {mods.trickRoom && (
            <span style={{
              background: "#735797", color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".08em",
              textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,.3)",
              boxShadow: "0 0 14px rgba(115,87,151,.7)",
            }}>🔮 Trick Room</span>
          )}
        </div>
      )}

      {sideLabel("Their side", 0)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {mons.slice(0, 2).map(fieldCard)}
      </div>
      {sideLabel("Your side", 1)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {mons.slice(2, 4).map(fieldCard)}
      </div>

      <div style={{ marginTop: 14 }}>
        {!answered ? (
          <div style={{
            textAlign: "center", color: "var(--muted)", fontSize: 13, minHeight: 20,
          }}>
            {order.length === 0
              ? (mods.trickRoom ? "Careful — Trick Room is up…" : "Tap the first Pokémon to move")
              : `${order.length}/4 picked — tap a numbered pick to undo`}
          </div>
        ) : (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14, lineHeight: 1.6, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>
              <br />
              <span style={{ fontSize: 13.5 }}>{correctText}</span>
            </div>
            <button onClick={nextRound} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
              boxShadow: "0 4px 18px rgba(255,203,5,.35)",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next field →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------- find the scarf ------------------------- */

/* One of the four secretly holds a Choice Scarf. The observed move order
   is shown; the player must deduce the holder. Rounds are regenerated
   until the puzzle has a unique answer: no other Pokémon could hold the
   Scarf and produce the same observed order. */
function buildScarfRound(pool, prevKey, hard, buildStyle) {
  let best = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const mons = shuffle(pool).slice(0, 4).map(rollMegaState);
    const key = mons.map(m => m.baseName || m.name).sort().join("|");
    if (key === prevKey && attempt < 30) continue;

    const mods = {
      weather: null, weatherSetBy: null, trickRoom: false, tailwindSide: null,
      scarf: [], para: [], natures: {}, realBase: null, realItems: null, ironBall: [],
    };
    // Spreads (and real natures, once fixed) apply here too — but no visible
    // items: the hidden Choice Scarf IS the puzzle.
    applyBuildStyle(mons, mods, buildStyle, false);
    if (hard) {
      const setters = [];
      mons.forEach(m => {
        Object.entries(WEATHER_SETTERS).forEach(([ab, w]) => {
          if (hasAbility(m, ab)) setters.push({ name: m.name, ability: ab, weather: w });
        });
      });
      if (setters.length && Math.random() < 0.5) {
        const s = setters[Math.floor(Math.random() * setters.length)];
        mods.weather = s.weather;
        mods.weatherSetBy = s;
      } else if (!setters.length) {
        const relevant = Object.keys(WEATHER_META).filter(w => mons.some(m => boostAbility(m, w)));
        if (relevant.length && Math.random() < 0.4) {
          mods.weather = relevant[Math.floor(Math.random() * relevant.length)];
        }
      }
      if (Math.random() < 0.3) mods.tailwindSide = Math.random() < 0.5 ? 0 : 1;
      if (Math.random() < 0.18) mods.trickRoom = true;
      if (Math.random() < 0.25) mods.para.push(mons[Math.floor(Math.random() * 4)].name);
    }

    const holder = mons[Math.floor(Math.random() * 4)].name;
    mods.scarf = [holder];
    const sideOf = (m) => (mons.indexOf(m) < 2 ? 0 : 1);
    const effWith = (scarfName) => Object.fromEntries(
      mons.map(m => [m.name, effSpeed(m, sideOf(m), { ...mods, scarf: [scarfName] }).value])
    );
    const trueEff = effWith(holder);
    const seq = [...mons].sort((a, b) =>
      mods.trickRoom ? trueEff[a.name] - trueEff[b.name] : trueEff[b.name] - trueEff[a.name]);
    const consistentWith = (vals) => seq.every((m, i) => i === 0 || (
      mods.trickRoom
        ? vals[seq[i - 1].name] <= vals[m.name]
        : vals[seq[i - 1].name] >= vals[m.name]
    ));
    const ambiguous = mons.some(c => c.name !== holder && consistentWith(effWith(c.name)));

    best = { mons, key, mods, holder, seq };
    if (!ambiguous) return best;
  }
  return best;
}

const ORDINALS = ["1st", "2nd", "3rd", "4th"];

function ScarfHuntScreen({ pool, target, hard, buildStyle, onDone, onQuit }) {
  const [round, setRound] = useState(() => buildScarfRound(pool, null, hard, buildStyle));
  const [picked, setPicked] = useState(null);
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [drag, setDrag] = useState(null);
  const [hover, setHover] = useState(null);
  const cardRefs = useRef({});

  const { mons, mods, holder, seq } = round;
  const sideOf = (m) => (mons.indexOf(m) < 2 ? 0 : 1);
  const eff = Object.fromEntries(mons.map(m => [m.name, effSpeed(m, sideOf(m), mods)]));

  const orderLabel = {};
  seq.forEach((m, i) => {
    orderLabel[m.name] = (i > 0 && eff[m.name].value === eff[seq[i - 1].name].value)
      ? orderLabel[seq[i - 1].name]
      : ORDINALS[i];
  });

  const answered = picked !== null;
  const wasRight = answered && picked === holder;
  const holderMon = mons.find(m => m.name === holder);

  const choose = (name) => {
    if (answered) return;
    setPicked(name);
    setAttempts(n => n + 1);
    if (name === holder) {
      setWins(w => w + 1);
      setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setPicked(null);
    setHover(null);
    setRound(buildScarfRound(pool, round.key, hard, buildStyle));
  };

  const hitTest = (x, y) => {
    let hit = null;
    Object.entries(cardRefs.current).forEach(([name, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) hit = name;
    });
    return hit;
  };
  const onTokenDown = (e) => {
    if (answered) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX, y: e.clientY });
  };
  const onTokenMove = (e) => {
    if (!drag) return;
    setDrag({ x: e.clientX, y: e.clientY });
    setHover(hitTest(e.clientX, e.clientY));
  };
  const onTokenUp = (e) => {
    if (!drag) return;
    const hit = hitTest(e.clientX, e.clientY);
    setDrag(null);
    setHover(null);
    if (hit) choose(hit);
  };

  const recap = seq
    .map(m => `${m.name} (${eff[m.name].value})`)
    .join(" → ");

  const fieldCard = (mon) => {
    const isHolder = mon.name === holder;
    const chips = [];
    if (answered && isHolder) chips.push(<ModChip key="s" text="Choice Scarf" bg="#E8913A" />);
    if (mods.para.includes(mon.name)) chips.push(<ModChip key="p" text="PAR" bg="#F7D02C" fg="#5A4A00" />);
    const wAb = boostAbility(mon, mods.weather);
    if (wAb) chips.push(<ModChip key="w" text={wAb} bg={WEATHER_META[mods.weather].color} />);
    const nat = mods.natures && mods.natures[mon.name];
    if (nat) {
      const m = natureSpeedMult(nat);
      chips.push(<ModChip key="n" text={nat} bg={m > 1 ? "#30A46C" : m < 1 ? "#6F35FC" : "#8A8DA8"} />);
    }
    const border = answered
      ? (isHolder ? "#30A46C" : picked === mon.name ? "#E5484D" : "rgba(255,255,255,.14)")
      : hover === mon.name ? "var(--gold)" : "rgba(255,255,255,.14)";
    return (
      <button
        key={mon.name}
        ref={el => { cardRefs.current[mon.name] = el; }}
        onClick={() => choose(mon.name)}
        disabled={answered}
        style={{
          position: "relative", minWidth: 0, cursor: answered ? "default" : "pointer",
          background: "#F5F6FA", borderRadius: 14, padding: "12px 6px 10px",
          border: `2.5px solid ${border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          color: "#22243E", boxShadow: "0 6px 18px rgba(0,0,0,.4)",
          transition: "border-color .1s",
        }}
      >
        <span style={{
          position: "absolute", top: -10, right: -6, minWidth: 34, height: 24,
          borderRadius: 999, background: "#22243E", color: "#FFCB05",
          border: "1.5px solid #FFCB05",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 13.5,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 8px", boxShadow: "0 2px 6px rgba(0,0,0,.4)",
        }}>{orderLabel[mon.name]}</span>
        <MonSprite mon={mon} size={68} />
        <div style={{
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 15, lineHeight: 1.05,
          textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere",
        }}>{mon.name}</div>
        {chips.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>{chips}</div>
        )}
        <div style={{ minHeight: 34, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 22, lineHeight: 1,
            color: answered ? "#22243E" : "transparent",
          }}>{answered ? eff[mon.name].value : "?"}</span>
          {answered && eff[mon.name].breakdown && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, color: "#8A8DA8", marginTop: 2 }}>
              {eff[mon.name].breakdown}
            </span>
          )}
        </div>
      </button>
    );
  };

  const sideLabel = (text, side) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
      fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".16em",
      textTransform: "uppercase", color: "rgba(255,255,255,.4)",
    }}>
      {text}
      {mods.tailwindSide === side && (
        <span style={{
          color: "#7AC74C", border: "1px solid #7AC74C", borderRadius: 999,
          padding: "1px 8px", letterSpacing: ".08em",
        }}>🍃 Tailwind</span>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      {drag && (
        <div style={{
          position: "fixed", left: drag.x, top: drag.y, zIndex: 60,
          transform: "translate(-50%, -65%)", fontSize: 42, pointerEvents: "none",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,.5))",
        }}>🧣</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target} wins
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 10,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>
        {streak > 0 ? `🔥 ${streak} streak` : " "}
      </div>

      <div style={{
        textAlign: "center", fontFamily: "var(--mono)", fontSize: 12,
        letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)",
        marginBottom: 10,
      }}>One of these is holding a Choice Scarf — the move order gives it away</div>

      {(mods.weather || mods.trickRoom) && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 12 }}>
          {mods.weather && (
            <span style={{
              background: WEATHER_META[mods.weather].color, color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".04em",
              textShadow: "0 1px 2px rgba(0,0,0,.3)",
            }}>
              {WEATHER_META[mods.weather].icon} {WEATHER_META[mods.weather].label}
              {mods.weatherSetBy && (
                <span style={{ fontWeight: 600, fontSize: 11.5, opacity: .92 }}>
                  {" "}· {mods.weatherSetBy.name}'s {mods.weatherSetBy.ability}
                </span>
              )}
            </span>
          )}
          {mods.trickRoom && (
            <span style={{
              background: "#735797", color: "#fff", borderRadius: 999,
              padding: "5px 14px", fontSize: 13, fontWeight: 800, letterSpacing: ".08em",
              textTransform: "uppercase", textShadow: "0 1px 2px rgba(0,0,0,.3)",
              boxShadow: "0 0 14px rgba(115,87,151,.7)",
            }}>🔮 Trick Room</span>
          )}
        </div>
      )}

      {sideLabel("Their side", 0)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {mons.slice(0, 2).map(fieldCard)}
      </div>
      {sideLabel("Your side", 1)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {mons.slice(2, 4).map(fieldCard)}
      </div>

      <div style={{ marginTop: 16 }}>
        {!answered ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <button
              onPointerDown={onTokenDown}
              onPointerMove={onTokenMove}
              onPointerUp={onTokenUp}
              style={{
                touchAction: "none", userSelect: "none", WebkitUserSelect: "none",
                background: drag ? "rgba(255,203,5,.25)" : "var(--gold)",
                color: "#1B1D36", border: "none", borderRadius: 999,
                padding: "12px 22px", cursor: "grab",
                fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
                letterSpacing: ".04em", textTransform: "uppercase",
                boxShadow: "0 4px 18px rgba(255,203,5,.35)",
                opacity: drag ? 0.55 : 1,
              }}
            >🧣 Choice Scarf</button>
            <span style={{ color: "var(--muted)", fontSize: 12.5 }}>
              Drag it onto the holder — or just tap a Pokémon
            </span>
          </div>
        ) : (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14, lineHeight: 1.6, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>{" "}
              {holderMon.name} was holding the Scarf — base {holderMon.stats.spe} Spe.
              <br />
              <span style={{ fontSize: 13.5 }}>{mods.trickRoom ? "Trick Room order: " : ""}{recap}</span>
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
              boxShadow: "0 4px 18px rgba(255,203,5,.35)",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next field →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------- damage buckets --------------------------- */

const MEGA_STONE_RE = /ite(?: [XY])?$/;
function moveDataFor(md, name) {
  return (md || {})[name] || null;
}
/* Build one damage question: random attacker + defender from the pool, a
   random damaging move the attacker actually runs. Returns null if it can't
   find a valid combo (caller retries). */
function buildDamageRound(atkPool, defPool, moveData, prevKey, hard) {
  const usableAtk = atkPool.filter(m => m.stats && m.types && m.types.length);
  const usableDef = (defPool || atkPool).filter(m => m.stats && m.types && m.types.length);
  if (!usableAtk.length || !usableDef.length) return null;
  const singleSided = usableDef.length === 1 && usableAtk.length === 1;
  for (let tries = 0; tries < 60; tries++) {
    const attacker = rollMegaState(usableAtk[Math.floor(Math.random() * usableAtk.length)]);
    const defender = rollMegaState(usableDef[Math.floor(Math.random() * usableDef.length)]);
    if (attacker.name === defender.name && !singleSided) continue;
    const key = (attacker.baseName || attacker.name) + ">" + (defender.baseName || defender.name);
    if (key === prevKey && tries < 40) continue;

    const dmgMoves = (attacker.moves || [])
      .map(e => (typeof e === "string" ? e : e.name))
      .map(nm => ({ name: nm, data: moveDataFor(moveData, nm) }))
      .filter(x => x.data && x.data.power != null && x.data.class !== "status");
    if (!dmgMoves.length) continue;
    const move = dmgMoves[Math.floor(Math.random() * dmgMoves.length)];

    const opts = {};
    if (hard) {
      const topBuild = (m) => (m.builds || [])[0] || null;
      const evOf = (m, key) => {
        const b = topBuild(m);
        if (!b) return 0;
        const parts = String(b.evs || "").split("/").map(n => parseInt(n, 10));
        const idx = { hp: 0, atk: 1, def: 2, spa: 3, spd: 4, spe: 5 }[key];
        return parts.length === 6 && !isNaN(parts[idx]) ? parts[idx] : 0;
      };
      const cls = move.data.class;
      opts.atkEV = evOf(attacker, cls === "physical" ? "atk" : "spa");
      opts.defEV = evOf(defender, cls === "physical" ? "def" : "spd");
      opts.defHpEV = evOf(defender, "hp");
      // nature multipliers on the relevant stats (real natures; blank today)
      const natMult = (m) => {
        const b = topBuild(m);
        if (!b || !b.nature) return {};
        const nat = NATURE_CHART.find(n => n.name === b.nature);
        if (!nat || !nat.plus) return {};
        const out = {};
        out[nat.plus] = 1.1; out[nat.minus] = 0.9;
        return out;
      };
      opts.atkNatureMult = natMult(attacker);
      opts.defNatureMult = natMult(defender);
      // real held items (mega -> stone only, else a >10% item)
      const pickItem = (m) => {
        // Imported team members always use the exact item on their set.
        if (m.isTeam) return (m.teamSet && m.teamSet.item) || null;
        if (m.megaActive) return null;
        if ((m.megas && m.isMega) || MEGA_NAME.test(m.name)) {
          return (m.items || []).map(norm).map(e => e.name).find(n => MEGA_STONE_RE.test(n) && n !== "Eviolite") || null;
        }
        const opts2 = (m.items || []).map(norm).filter(e => e.pct != null && e.pct > 10).map(e => e.name);
        return opts2.length ? opts2[Math.floor(Math.random() * opts2.length)] : null;
      };
      opts.atkItem = pickItem(attacker);
      opts.defItem = pickItem(defender);
      opts.atkAbility = (attacker.abilities || []).map(norm)[0] && norm((attacker.abilities || [])[0]).name;
      opts.defAbility = (defender.abilities || []).map(norm)[0] && norm((defender.abilities || [])[0]).name;
    }

    const res = calcDamage(attacker, defender, move.data, opts);
    if (!res) continue;
    return { attacker, defender, move, res, opts, key, correct: bucketsForResult(res) };
  }
  return null;
}

function DamageScreen({ pool, defPool, moveData, target, hard, onDone, onQuit }) {
  const [round, setRound] = useState(() => buildDamageRound(pool, defPool, moveData, null, hard));
  const [picked, setPicked] = useState(null);
  const [wins, setWins] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  if (!round) {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 18px", textAlign: "center", color: "#fff" }}>
        <p style={{ color: "var(--muted)" }}>
          Not enough move data yet to build damage questions. This unlocks once the
          nightly pull adds base-power data for these Pokémon's moves.
        </p>
        <button onClick={onQuit} style={{
          marginTop: 16, padding: "12px 20px", borderRadius: 12, border: "none",
          background: "var(--gold)", color: "#1B1D36", fontWeight: 800, cursor: "pointer",
          fontFamily: "var(--display)", fontSize: 18, textTransform: "uppercase",
        }}>Back</button>
      </div>
    );
  }

  const { attacker, defender, move, res, opts, correct } = round;
  const answered = picked !== null;
  const correctSet = new Set(correct);
  const wasRight = answered && correctSet.has(picked);

  const choose = (key) => {
    if (answered) return;
    setPicked(key);
    setAttempts(n => n + 1);
    if (correctSet.has(key)) {
      setWins(w => w + 1);
      setStreak(s => { const ns = s + 1; setBestStreak(b => Math.max(b, ns)); return ns; });
    } else {
      setStreak(0);
    }
  };
  const next = () => {
    if (wasRight && wins >= target) { onDone({ target, attempts, bestStreak }); return; }
    setPicked(null);
    setRound(buildDamageRound(pool, defPool, moveData, round.key, hard));
  };

  const rollText = res.immune
    ? "Immune — 0%"
    : `${res.min.toFixed(1)}%–${res.max.toFixed(1)}%`;

  const chipRow = (m, role) => {
    const item = role === "atk" ? opts.atkItem : opts.defItem;
    const ability = role === "atk" ? opts.atkAbility : opts.defAbility;
    return hard && (item || ability) ? (
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center", marginTop: 3 }}>
        {item && <ModChip text={item} bg="#4A6FA5" />}
        {ability && <ModChip text={ability} bg="#6B4A8A" />}
      </div>
    ) : null;
  };

  const monBlock = (m, role) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1, minWidth: 0 }}>
      <div style={{ position: "relative" }}>
        <MonSprite mon={m} size={72} />
        {m.isTeam && (
          <span style={{
            position: "absolute", top: -2, right: -6, background: "var(--gold)", color: "#1B1D36",
            borderRadius: 999, padding: "1px 6px", fontSize: 9, fontWeight: 900,
            letterSpacing: ".06em", textTransform: "uppercase",
          }}>yours</span>
        )}
        {m.megaActive && (
          <span style={{
            position: "absolute", bottom: -2, left: -4, background: "#6F35FC", color: "#fff",
            borderRadius: 999, padding: "1px 7px", fontSize: 9, fontWeight: 900,
            letterSpacing: ".06em", textTransform: "uppercase",
            boxShadow: "0 0 10px rgba(111,53,252,.6)",
          }}>mega</span>
        )}
      </div>
      <div style={{
        fontFamily: "var(--display)", fontWeight: 800, fontSize: 16, lineHeight: 1.05,
        textTransform: "uppercase", textAlign: "center", overflowWrap: "anywhere", color: "#22243E",
      }}>{m.megaActive ? m.name : (m.nickname || m.name)}</div>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center" }}>
        {monTypes(m).filter(x => x !== "unknown").map(x => <TypeChip key={x} t={x} />)}
      </div>
      {chipRow(m, role)}
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "18px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button onClick={onQuit} style={{
          background: "transparent", border: "none", color: "var(--muted)",
          fontSize: 13, cursor: "pointer", padding: 4,
        }}>← End</button>
        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.1)", borderRadius: 999 }}>
          <div style={{
            width: `${(wins / target) * 100}%`, height: "100%",
            background: "var(--gold)", borderRadius: 999, transition: "width .25s",
          }} />
        </div>
        <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
          {wins}/{target}
        </span>
      </div>
      <div style={{
        display: "flex", justifyContent: "flex-end", marginBottom: 10,
        fontFamily: "var(--mono)", fontSize: 12, color: streak >= 3 ? "var(--gold)" : "var(--muted)",
      }}>{streak > 0 ? `🔥 ${streak} streak` : " "}</div>

      <div style={{
        background: "#F5F6FA", borderRadius: 18, padding: "18px 16px",
        boxShadow: "0 10px 30px rgba(0,0,0,.45)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginBottom: 6,
          fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".14em",
          textTransform: "uppercase", color: "#9DA0B8",
        }}>
          <span>{attacker.isTeam ? "Yours · attacking" : "Attacking"}</span>
          <span>{defender.isTeam ? "Yours · defending" : "Defending"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {monBlock(attacker, "atk")}
          <div style={{
            alignSelf: "center", fontFamily: "var(--display)", fontWeight: 800,
            fontSize: 15, color: "#8A8DA8", padding: "0 2px",
          }}>▶</div>
          {monBlock(defender, "def")}
        </div>

        <div style={{
          marginTop: 14, textAlign: "center", padding: "10px 12px",
          background: "#fff", borderRadius: 12, border: "1px solid #E4E6F0",
        }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#8A8DA8", letterSpacing: ".1em", textTransform: "uppercase" }}>
            {attacker.name} uses
          </span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 24, color: "#22243E" }}>
              {move.name}
            </span>
            <TypeChip t={move.data.type} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#8A8DA8" }}>
              {move.data.power} BP · {move.data.class === "physical" ? "Phys" : "Spec"}
            </span>
          </div>
        </div>

        <div style={{
          fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".1em",
          textTransform: "uppercase", color: "#8A8DA8", margin: "16px 0 10px", textAlign: "center",
        }}>How much of {defender.name}'s HP?</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {DMG_BUCKETS.map(b => {
            const isCorrect = correctSet.has(b.key);
            const isPicked = picked === b.key;
            let bg = "#fff", border = "#D5D8E4", color = "#22243E";
            if (answered) {
              if (isCorrect) { bg = "rgba(48,164,108,.14)"; border = "#30A46C"; color = "#1E7A4D"; }
              else if (isPicked) { bg = "rgba(229,72,77,.10)"; border = "#E5484D"; color = "#C0353A"; }
              else { color = "#9DA0B8"; }
            }
            return (
              <button key={b.key} onClick={() => choose(b.key)} disabled={answered}
                style={{
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  background: bg, border: `1.5px solid ${border}`, borderRadius: 10,
                  padding: "12px 14px", cursor: answered ? "default" : "pointer", color,
                  fontSize: 16, fontWeight: answered && isCorrect ? 800 : 600,
                }}>
                {b.label}
                {answered && isCorrect && <span style={{ marginLeft: "auto", fontSize: 13 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        {answered ? (
          <>
            <div style={{
              borderRadius: 12, padding: "12px 14px", marginBottom: 10,
              background: wasRight ? "rgba(48,164,108,.15)" : "rgba(229,72,77,.15)",
              border: `1.5px solid ${wasRight ? "#30A46C" : "#E5484D"}`,
              color: "#fff", fontSize: 14, lineHeight: 1.6, textAlign: "center",
            }}>
              <b>{wasRight ? "Correct!" : "Not quite."}</b>{" "}
              {res.immune && res.reason && res.reason !== "type"
                ? `No effect — ${defender.nickname || defender.name}'s ${res.reason} absorbs it`
                : rollText}
              {res.eff != null && res.eff !== 1 && !res.immune && (
                <span> · {res.eff > 1 ? `${res.eff}× super effective` : `${res.eff}× resisted`}</span>
              )}
              {correct.length > 1 && !res.immune && (
                <div style={{ fontSize: 12.5, marginTop: 3, opacity: .9 }}>
                  the roll straddles two brackets — either was accepted
                </div>
              )}
            </div>
            <button onClick={next} style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
              fontFamily: "var(--display)", fontWeight: 800, fontSize: 20,
              textTransform: "uppercase", letterSpacing: ".05em",
            }}>
              {wasRight && wins >= target ? "Finish 🏆" : "Next matchup →"}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>
            {hard ? "Hard mode: real EVs, items & abilities in play" : "Base stats only"}
          </div>
        )}
      </div>
    </div>
  );
}

function DuelSummary({ result, onRestart, onAgain }) {
  const { target, attempts, bestStreak } = result;
  const acc = Math.round((target / attempts) * 100);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 18px" }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".14em",
        textTransform: "uppercase", color: "var(--gold)", marginBottom: 8,
      }}>Speed game complete 🏆</div>
      <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 72, color: "#fff", lineHeight: 1 }}>
        {target}<span style={{ fontSize: 30, color: "var(--muted)" }}> wins</span>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: "10px 0 24px", lineHeight: 1.7 }}>
        {attempts} rounds · {acc}% accuracy · best streak {bestStreak} 🔥
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onAgain} style={{
          flex: 1, padding: "14px", borderRadius: 12, border: "none",
          background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
          fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
          textTransform: "uppercase", letterSpacing: ".05em",
        }}>Run it back</button>
        <button onClick={onRestart} style={{
          flex: 1, padding: "14px", borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,.25)", background: "transparent",
          color: "#fff", cursor: "pointer", fontFamily: "var(--display)",
          fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: ".05em",
        }}>New session</button>
      </div>
    </div>
  );
}

/* ----------------------------- summary ----------------------------- */

function SummaryScreen({ session, onRestart, onDrillToughest }) {
  const { done, log, total, mastery } = session;
  const reviews = log.again + log.hard + log.good + log.easy;
  const tough = done.filter(d => d.lapses > 0).sort((a, b) => b.lapses - a.lapses);
  const target = mastery ? SRS.MASTERY_TARGET : SRS.GRADUATE_STEPS;
  const firstTry = done.filter(d => d.lapses === 0 && d.reviews <= target).length;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 18px" }}>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".14em",
        textTransform: "uppercase", color: "var(--gold)", marginBottom: 8,
      }}>{mastery
        ? `Mastery complete — every card correct ${SRS.MASTERY_TARGET}×`
        : "Session complete — all cards cleared"}</div>
      <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 72, color: "#fff", lineHeight: 1 }}>
        {reviews}<span style={{ fontSize: 30, color: "var(--muted)" }}> reviews</span>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 15, margin: "10px 0 24px", lineHeight: 1.6 }}>
        {total} cards {mastery ? "mastered" : "learned"} · {firstTry} cleared without a miss.
        <br />
        <span style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
          <span style={{ color: "#E5484D" }}>{log.again} again</span> ·{" "}
          <span style={{ color: "#E8913A" }}>{log.hard} hard</span> ·{" "}
          <span style={{ color: "#6FCF97" }}>{log.good} good</span> ·{" "}
          <span style={{ color: "#7FB0F0" }}>{log.easy} easy</span>
        </span>
      </p>

      {tough.length > 0 && (
        <div style={{ ...panelStyle }}>
          <div style={panelHeadStyle}><span>Toughest cards</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {tough.slice(0, 10).map((d, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff", fontSize: 14 }}>
                {d.card.mon
                  ? <TypeOrb types={monTypes(d.card.mon)} size={24} text={d.card.mon.name[0]} />
                  : d.card.nature
                    ? <NatureOrb nature={d.card.nature} size={24} />
                    : d.card.type
                      ? <TypeOrb types={[d.card.type]} size={24} text={d.card.type[0].toUpperCase()} />
                      : <StatOrb statKey={d.card.statKey} size={24} />}
                <span style={{ fontWeight: 600 }}>
                  {d.card.mon ? d.card.mon.name
                    : d.card.nature ? d.card.nature.name
                    : d.card.type ? cap(d.card.type)
                    : STAT_LABEL[d.card.statKey]}
                </span>
                <span style={{ color: "var(--muted)", fontSize: 12 }}>
                  {d.card.cat === "stats"
                    ? STAT_LABEL[d.card.statKey]
                    : CAT_SHORT[d.card.cat] || d.card.cat}
                </span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "#E5484D", marginLeft: "auto" }}>
                  ×{d.lapses} again
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        {tough.length > 0 && (
          <button onClick={() => onDrillToughest(tough)} style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: "var(--gold)", color: "#1B1D36", cursor: "pointer",
            fontFamily: "var(--display)", fontWeight: 800, fontSize: 18,
            textTransform: "uppercase", letterSpacing: ".05em",
          }}>Drill toughest</button>
        )}
        <button onClick={onRestart} style={{
          flex: 1, padding: "14px", borderRadius: 12,
          border: "1.5px solid rgba(255,255,255,.25)", background: "transparent",
          color: "#fff", cursor: "pointer", fontFamily: "var(--display)",
          fontWeight: 800, fontSize: 18, textTransform: "uppercase", letterSpacing: ".05em",
        }}>New session</button>
      </div>
    </div>
  );
}

/* ----------------------------- app ----------------------------- */

function App() {
  const [data, setData] = useState(FALLBACK);
  const [live, setLive] = useState(false);
  const [screen, setScreen] = useState("config");
  const [session, setSession] = useState(null);
  const [queue, setQueue] = useState([]);
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(0);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    fetch("data.json")
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => { if (d && d.formats && d.formats.length) { setData(d); setLive(true); } })
      .catch(() => {});
  }, []);

  /* Persist the imported team where storage is available. The chat-artifact
     sandbox blocks it, so every access is guarded and failure is a no-op. */
  const TEAM_KEY = "vgcMetaBlitz.team";
  const safeStore = {
    get() { try { return window.localStorage.getItem(TEAM_KEY); } catch { return null; } },
    set(v) { try { window.localStorage.setItem(TEAM_KEY, v); } catch { /* ignore */ } },
    del() { try { window.localStorage.removeItem(TEAM_KEY); } catch { /* ignore */ } },
  };

  useEffect(() => {
    const saved = safeStore.get();
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.mons && parsed.mons.length) setTeam(parsed);
    } catch { /* corrupt payload — ignore */ }
  }, []);

  const importTeam = async (parsedSets) => {
    const known = {};
    (data.formats || []).forEach(f => Object.assign(known, f.moveData || {}));
    const res = await hydrateTeam(parsedSets, known);
    if (res.mons.length) {
      const next = { mons: res.mons, moveData: res.moveData };
      setTeam(next);
      safeStore.set(JSON.stringify(next));
    }
    return res;
  };
  const clearTeam = () => { setTeam(null); safeStore.del(); };

  const start = (cfg) => {
    setSession(cfg);
    setResult(null);
    setSessionId(s => s + 1);
    if (cfg.type === "flash") {
      setQueue(buildDeck(cfg.deckCfg));
      setScreen("quiz");
    } else if (cfg.type === "damage") {
      setScreen("damage");
    } else {
      setScreen("duel");
    }
  };

  const drillToughest = (tough) => {
    setQueue(shuffle(tough.map(t => ({ ...t, step: 0, lapses: 0, reviews: 0, correct: 0 }))));
    setResult(null);
    setSessionId(s => s + 1);
    setScreen("quiz");
  };

  const duelAgain = () => {
    setResult(null);
    setSessionId(s => s + 1);
    setScreen("duel");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(1200px 600px at 50% -10%, #262A52 0%, #16182E 55%, #101124 100%)",
      fontFamily: "var(--body)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap');
        :root {
          --display: 'Barlow Condensed', 'Arial Narrow', system-ui, sans-serif;
          --body: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
          --mono: ui-monospace, 'SF Mono', Menlo, monospace;
          --gold: #FFCB05;
          --muted: rgba(255,255,255,.55);
        }
        button:focus-visible, [role="button"]:focus-visible {
          outline: 2px solid #FFCB05; outline-offset: 2px;
        }
        input[type="range"] { height: 22px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      {screen === "config" && (
        <ConfigScreen
          formats={data.formats}
          generated={data.generated}
          live={live}
          team={team}
          onImportTeam={importTeam}
          onClearTeam={clearTeam}
          onStart={start}
        />
      )}
      {screen === "quiz" && session && (
        <QuizScreen
          key={sessionId}
          initialQueue={queue}
          pool={session.pool}
          reg={session.reg}
          mastery={!!session.mastery}
          onQuit={() => setScreen("config")}
          onDone={(res) => { setResult(res); setScreen("done"); }}
        />
      )}
      {screen === "duel" && session && (
        session.duelCfg.variant === "order" ? (
          <TurnOrderScreen
            key={sessionId}
            pool={session.pool}
            target={session.duelCfg.target}
            hard={session.duelCfg.hard}
            buildStyle={session.duelCfg.buildStyle}
            onQuit={() => setScreen("config")}
            onDone={(res) => { setResult(res); setScreen("duelDone"); }}
          />
        ) : session.duelCfg.variant === "scarf" ? (
          <ScarfHuntScreen
            key={sessionId}
            pool={session.pool}
            target={session.duelCfg.target}
            hard={session.duelCfg.hard}
            buildStyle={session.duelCfg.buildStyle}
            onQuit={() => setScreen("config")}
            onDone={(res) => { setResult(res); setScreen("duelDone"); }}
          />
        ) : (
          <DuelScreen
            key={sessionId}
            pool={session.pool}
            target={session.duelCfg.target}
            onQuit={() => setScreen("config")}
            onDone={(res) => { setResult(res); setScreen("duelDone"); }}
          />
        )
      )}
      {screen === "damage" && session && (
        <DamageScreen
          key={sessionId}
          pool={session.pool}
          defPool={session.defPool}
          moveData={session.moveData}
          target={session.dmgCfg.target}
          hard={session.dmgCfg.hard}
          onQuit={() => setScreen("config")}
          onDone={(res) => { setResult(res); setScreen("duelDone"); }}
        />
      )}
      {screen === "done" && result && (
        <SummaryScreen
          session={result}
          onRestart={() => setScreen("config")}
          onDrillToughest={drillToughest}
        />
      )}
      {screen === "duelDone" && result && (
        <DuelSummary
          result={result}
          onRestart={() => setScreen("config")}
          onAgain={duelAgain}
        />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
