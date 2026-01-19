import { Dexie } from "dexie"

const db = new Dexie("tracker");
db.version(1).stores({
    campaigns: "++id,day",
    rangers: "++id,campaignId",
    events: "++id,campaignId",
    missions: "++id,campaignId",
    rewards: "++id,campaignId",
    notes: "++id,[campaignId+day]"
})

// Campaign options
export const INCREMENT_DAY = async (id, day) => { await db.campaigns.update(id, { day: day + 1 }) };
export const DECREMENT_DAY = async (id, day) => { await db.campaigns.update(id, { day: day - 1 }) };
export const CHANGE_LOCATION = async (id, location) => { await db.campaigns.update(id, { location }) };
export const CHANGE_TERRAIN = async (id, terrain) => { await db.campaigns.update(id, { terrain }) };
export const CHANGE_CAMPAIGN = async (id, campaign) => { await db.campaigns.update(id, { campaign })};
export const CHANGE_NOTE = async(id, note) => { await db.notes.update(id, { note }) };

export default db;