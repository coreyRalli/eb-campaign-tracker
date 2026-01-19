import { Dexie } from "dexie"
import { generateDefaultNotes } from "../data";

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
export const ADD_EVENT = async (campaignId, note) => { await db.events.add({ campaignId, note }) };
export const UPDATE_EVENT = async (id, note) => { await db.events.update(id, { note }) };
export const REMOVE_EVENT = async (id) => { await db.events.delete(id) }
export const INCREMENT_DAY = async (id, day) => { await db.campaigns.update(id, { day: day + 1 }) };
export const DECREMENT_DAY = async (id, day) => { await db.campaigns.update(id, { day: day - 1 }) };
export const CHANGE_LOCATION = async (id, location) => { await db.campaigns.update(id, { location }) };
export const CHANGE_TERRAIN = async (id, terrain) => { await db.campaigns.update(id, { terrain }) };
export const CHANGE_CAMPAIGN = async (id, campaign) => {
    // Clear out campaign guide entries from previous campaign
    // TODO: Clear out notable events and missions when changing as well (if player wants)
    await db.campaigns.update(id, { campaign });

    // There should always be 45 entries for a campaign. 
    // TODO: Add some extra logic to check this, and in the right order.
    const notes = await db.notes.where("campaignId").equals(id).primaryKeys();
    const generatedNotes = generateDefaultNotes(campaign)
        .map((n, i) => ({ key: notes[i], changes: { note: n.note } }))

    await db.notes.bulkUpdate(generatedNotes);
};
export const CHANGE_NOTE = async (id, note) => { await db.notes.update(id, { note }) };

export default db;