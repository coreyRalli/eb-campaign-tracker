import { Dexie } from "dexie"

const db = new Dexie("tracker");
db.version(1).stores({
    campaigns: "++id",
    rangers: "++id,campaignId",
    events: "++id,campaignId",
    missions: "++id,campaignId",
    rewards: "++id,campaignId"
})

export default db;