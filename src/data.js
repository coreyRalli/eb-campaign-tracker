export const LOCATIONS = [
  "Lone Tree Station",
  "Atrox Mountain",
  "Northen Outpost",
  "Golden Shore",
  "Mount Nim",
  "White Sky",
  "Boulder Field",
  "The Fractured Wall",
  "The Philosopher's Garden",
  "Spire",
  "Spire - Silverfin Docks",
  "Spire - Brookside",
  "Spire - Spire Crossing",
  "Ancestor's Grove",
  "Kobo's Market",
  "Branch",
  "Crossroads Station",
  "The High Basin",
  "Biological Outpost",
  "The Furrow",
  "Terravore",
  "Mound of The Navigator",
  "Stoneweaver Bridge",
  "Meadow",
  "Greenbriar Knoll",
  "Headwaters Station",
  "The Plummet",
  "Concordant Ziggurats",
  "Rings of The Moon",
  "Archaeological Outpost",
  "Alluvial Ruins",
  "Bowl of The Sun",
  "The Frowning Gate",
  "Tumbledown",
  "Watcher's Rock",
  "Marsh of Rebirth",
  "Sunken Outpost",
  "The Cyrpress Citadel",
  "Michael's Bog",
  "The Greenbridge",
];

export const LOCATIONS_LOTA = [
  "The Chimney",
  "Oasis Of Sunlight",
  "Drenching Chamber",
  "Scuttler Network",
  "Desert Of Endless Night",
  "Orlin's Vault",
  "Severed Artery",
  "Branching Artery",
  "Terminal Artery",
  "Silent Dormitories",
  "Mycelial Conclave",
  "Cerulean Curtain",
  "The Cistern",
  "Carbonforged Maze",
  "Inverted Forest",
  "Arboretum Of Memory",
  "The Verdant Sphere",
  "The Rootway",
  "Talid's Squeeze",
  "The Cage"
]

export const CAMPAIGNS = [
  "Lure Of The Valley",
  "Legacy Of The Ancestors"
]

export const BACKGROUNDS = [
  "Artisan",
  "Forager",
  "Shepherd",
  "Traveler",
  "Talespinner"
]

export const SPECIALITIES = [
  "Artificer",
  "Conciliator",
  "Explorer",
  "Shaper",
  "Spirit Speaker"
]

export const PERSONALITIES_AWA = [
  
]

export const PERSONALITIES_SPI = [
  
]

export const PERSONALITIES_FIT = [
  
]

export const PERSONALITIES_FOC = [
  
]

export const generateDefaultNotes = (campaign = "Lure Of The Valley") => {
  const dayNotes = [];

  for (var i = 0; i < 45; i++) {
    dayNotes.push({ day: i + 1, note: "" });
  }

  if (campaign === "Lure Of The Valley") {
    dayNotes[0].note = "Campaign Guide - 1";
    dayNotes[3].note = "Campaign Guide - 1.04";
  }
  else if (campaign === "Legacy Of The Ancestors") {
    dayNotes[0].note = "Campaign Guide - 1";
    dayNotes[3].note = "Campaign Guide - 199.2";
  }

  return dayNotes;
}

export const PATHS = [
  "Old-growth",
  "Mountain Pass",
  "Woods",
  "Lakeshore",
  "Grassland",
  "Ravine",
  "Swamp",
  "River",
  "Thoroughfare (Spire In Bloom)"];

export const PATHS_LOTA = [
  "Ancient Ruins",
  "Flooded Ruins",
  "Deep Roots",
  "Fungal Forest",
  "Cave Systems"
]

export const generateWeather = (day, campaign = "Lure Of The Valley") => {
  if (campaign === "Legacy Of The Ancestors") {
    if (day <= 3)
      return "Downpour";
    else if (day <= 6)
      return "A Pefect Day";
    else if (day <= 8)
      return "Howling Wind";
    else if (day <= 12)
      return "Downpour";
    else if (day <= 15)
      return "A Perfect Day";
    else if (day <= 18)
      return "Downpour";
    else if (day <= 21)
      return "A Perfect Day";
    else if (day <= 23)
      return "Howling Wind";
    else if (day <= 27)
      return "Downpour";
    else if (day <= 30)
      return "A Perfect Day";
    else
      return "Unknown";
  }

  if (day <= 3)
    return "A Pefect Day";
  else if (day <= 7)
    return "Downpour";
  else if (day <= 9)
    return "A Perfect Day";
  else if (day <= 12)
    return "Downpour";
  else if (day <= 14)
    return "Howling Winds";
  else if (day <= 17)
    return "Downpour";
  else if (day <= 20)
    return "Howling Winds";
  else if (day <= 22)
    return "A Perfect Day"
  else if (day <= 25)
    return "Downpour";
  else if (day <= 28)
    return "Howling Winds";
  else if (day <= 30)
    return "A Perfect Day";
  else if (day <= 33)
    return "Downpour";
  else if (day <= 35)
    return "A Perfect Day";
  else if (day <= 39)
    return "Howling Wind";
  else if (day <= 42)
    return "Downpour";
  else if (day <= 45)
    return "A Perfect Day"
  else
    return "Unknown";
}

export const generateArcologyWeather = (day) => {
  if (day <= 3)
    return "Enveloping Silence";
  else if (day <= 6)
    return "Glitterain";
  else if (day <= 8)
    return "Shimmering Runoff";
  else if (day <= 12)
    return "Enveloping Silence";
  else if (day <= 15)
    return "Glitterain";
  else if (day <= 18)
    return "Enveloping Silence";
  else if (day <= 21)
    return "Glitterain";
  else if (day <= 23)
    return "Shimmering Runoff";
  else if (day <= 27)
    return "Enveloping Silence";
  else if (day <= 30)
    return "Glitterain";
  else
    return "Unknown";
}