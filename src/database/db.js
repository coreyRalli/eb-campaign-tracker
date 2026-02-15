import { Dexie } from "dexie"
import { CAMPAIGNS, defaultCampaign, generateDefaultNotes } from "../data";

const db = new Dexie("tracker");
db.version(2).stores({
    campaigns: "++id,day",
    rangers: "++id,campaignId",
    events: "++id,campaignId, campaign",
    missions: "++id,campaignId, campaign",
    rewards: "++id,campaignId",
    notes: "++id,[campaignId+day]"
})

// Campaign options
export const ADD_RANGER = async (campaignId, name) => { await db.rangers.add({ campaignId, name }) };
export const UPDATE_RANGER = async (id, name) => { await db.rangers.update(id, { name }) };
export const REMOVE_RANGER = async (id) => { await db.rangers.delete(id); }
export const ADD_EVENT = async (campaignId, note, campaign = CAMPAIGNS[0]) => { await db.events.add({ campaignId, note, campaign }) };
export const UPDATE_EVENT = async (id, note) => { await db.events.update(id, { note }) };
export const REMOVE_EVENT = async (id) => { await db.events.delete(id) }
export const INCREMENT_DAY = async (id, day) => { await db.campaigns.update(id, { day: day + 1 }) };
export const DECREMENT_DAY = async (id, day) => { await db.campaigns.update(id, { day: day - 1 }) };
export const CHANGE_LOCATION = async (id, location) => { await db.campaigns.update(id, { location }) };
export const CHANGE_TERRAIN = async (id, terrain) => { await db.campaigns.update(id, { terrain }) };
export const ADD_REWARDS = async (campaignId, name) => { await db.rewards.add({ campaignId, name }) };
export const UPDATE_REWARDS = async (id, name) => { await db.rewards.update(id, { name }) };
export const REMOVE_REWARDS = async (id) => { await db.rewards.delete(id); }
export const ADD_MISSION = async (campaignId, name, progress, day, campaign = CAMPAIGNS[0]) => { await db.missions.add({ campaignId, name, progress, day, campaign, completed: false }) };
export const UPDATE_MISSION = async (id, name) => { await db.missions.update(id, { name }) };
export const SET_MISSION_COMPLETE = async (id, complete) => { await db.missions.update(id, { complete }) };
export const INCREMENT_MISSION_PROGRESS = async (id, progress) => { await db.missions.update(id, { progress: progress + 1 }) }
export const DECREMENT_MISSION_PROGRESS = async (id, progress) => { await db.missions.update(id, { progress: progress - 1 }) }
export const REMOVE_MISSION = async (id) => { await db.missions.delete(id); }
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

export const createOrFetchInitalData = async () => {
    // Getting the last campaign is a stopgap solution until multiple campaign selection is added.
    const campaigns = await db.campaigns.toArray();

    if (campaigns.length > 0) {
        const orderedCampaigns = campaigns.sort((a,b) => b.id - a.id);
        return orderedCampaigns[0].id;
    }
    const newCampaign = await db.campaigns.add(defaultCampaign);

    // Create Notes
    await db.notes.bulkAdd(generateDefaultNotes(CAMPAIGNS[0]).map(n => ({ ...n, campaignId: newCampaign })));

    return newCampaign;
}

export const importFromLocalStorage = async (state, olderSchema = true) => {
    const stateObj = JSON.parse(state);

    const campaign = {
        day: stateObj.day,
        campaign: stateObj.campaign,
        location: stateObj.location,
        terrain: stateObj.terrain
    };

    const campaignId = await db.campaigns.add(campaign);

    const rangers = stateObj.rangers.map(({ name }) => ({ name, campaignId }));
    const missions = stateObj.missions.map(({ name, day, progress, complete }) => ({ name, day, progress, complete, campaignId }));
    const events =  (olderSchema) ? stateObj.events.map(({ name }) => ({ note: name, campaignId })) : stateObj.events.map(({ note }) => ({ note, campaignId }));
    const rewards = stateObj.rewards.map(({ name }) => ({ name, campaignId }));
    const notes = stateObj.notes.map(({ day, note }) => ({ day, note, campaignId }));

    await db.transaction('rw', [db.rangers, db.missions, db.events, db.rewards, db.notes], () => {
        db.rangers.bulkAdd(rangers);
        db.missions.bulkAdd(missions);
        db.events.bulkAdd(events);
        db.rewards.bulkAdd(rewards);
        db.notes.bulkAdd(notes);
    });

    // Delete campaign state
    localStorage.removeItem("campaign-state");

    return campaignId;
}

const idExtractor = (obj) => {
    const {id, ...newObj} = obj;
    return newObj;
}

export const generateExportFileForCampaign = async (campaign) => {
    // Get all items
    const results = await Promise.all(
        ['rangers', 'missions', 'events', 'rewards', 'notes']
            .map((table) => db[table].where("campaignId").equals(campaign.id).toArray())
    )

    const [rangers, missions, events, rewards, notes] = results.map((result) => result.map(obj => idExtractor(obj)));

    return JSON.stringify({
        campaign: idExtractor(campaign),
        rangers,
        missions,
        events,
        rewards,
        notes
    });
}

export const importFromFile = async (campaignStr) => {
    const obj = JSON.parse(campaignStr);

    // Check to see if it's the using new or old version
    const oldVersion = (typeof obj.day !== "undefined");

    const cId = await importFromLocalStorage(campaignStr, oldVersion);
    return cId;
}

export default db;