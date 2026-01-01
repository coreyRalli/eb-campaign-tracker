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
    "The Greenbridge"
];

export const PATHS = [
        "Old-growth", 
        "Mountain Pass", 
        "Woods", 
        "Lakeshore", 
        "Grassland", 
        "Ravine", 
        "Swamp", 
        "River"];

export const generateWeather = (day) => {
  switch (day) {
    case 1:
    case 2:
    case 3:
    case 8:
    case 9:
    case 21:
    case 22:
    case 29:
    case 30:
      return "A Perfect Day";
    case 4:
    case 5:
    case 6:
    case 7:
    case 10:
    case 11:
    case 12:
    case 15:
    case 16:
    case 17:
    case 23:
    case 24:
    case 25:
      return "Downpour";
    case 13:
    case 14:
    case 18:
    case 19:
    case 20:
    case 26:
    case 27:
    case 28:
      return "Howling Winds"
    default:
      return "Unknown";
  }
}

const generateCampaignLogEntry = (day) => {
  switch (day) {
    case 1:
      return "1"
    case 3:
      return "94.1"
    case 4:
      return "1.04"
    default:
      return "";
  }
}