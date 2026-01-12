import { CAMPAIGNS, generateDefaultNotes } from "../data";

export const initialState = {
    location: "",
    terrain: "",
    day: 1,
    rangers: [],
    events: [],
    missions: [],
    rewards: [],
    notes: generateDefaultNotes(),
    campaign: CAMPAIGNS[0]
}

const reducer = (state, action) => {
    switch (action.type) {
        case "add_ranger":
            const newRanger = { id: crypto.randomUUID(), name: action.payload.name };
            return { ...state, rangers: [...state.rangers, newRanger] };
        case "remove_ranger":
            const filteredRangerList = structuredClone(state.rangers).filter(r => r.id !== action.payload.id);
            return { ...state, rangers: filteredRangerList };
        case "add_event":
            const newEvent = { id: crypto.randomUUID(), name: action.payload.name };
            return { ...state, events: [...state.events, newEvent] };
        case "update_event":
            const updateEventList = structuredClone(state.events);
            const eventToUpdateIndex = updateEventList.findIndex(e => e.id === action.payload.id);

            if (eventToUpdateIndex !== -1)
                updateEventList[eventToUpdateIndex].name = action.payload.newName;

            return { ...state, events: updateEventList };
        case "remove_event":
            const filteredEventList = structuredClone(state.events).filter(e => e.id !== action.payload.id);
            return { ...state, events: filteredEventList };
        case "update_mission":
            const updateMissionList = structuredClone(state.missions);
            const missionToUpdateIndex = updateMissionList.findIndex(m => m.id === action.payload.id);

            if (missionToUpdateIndex !== -1)
                updateMissionList[missionToUpdateIndex].name = action.payload.newName;

            return { ...state, missions: updateMissionList };
        case "add_mission":
            const newMission = { id: crypto.randomUUID(), name: action.payload.name, day: state.day, progress: action.payload.progress };
            return { ...state, missions: [...state.missions, newMission] };
        case "remove_mission":
            const filteredMissionList = structuredClone(state.missions).filter(m => m.id !== action.payload.id);
            return { ...state, missions: filteredMissionList };
        case "increment_mission_progress":
            const incMissionArr = structuredClone(state.missions);
            const incMissionIndex = incMissionArr.map(m => m.id).indexOf(action.payload.id);

            if (incMissionIndex !== -1)
                incMissionArr[incMissionIndex].progress = incMissionArr[incMissionIndex].progress + 1;

            return { ...state, missions: incMissionArr }
        case "decrement_mission_progress":
            const decMissionArr = structuredClone(state.missions);
            const decMissionIndex = decMissionArr.map(m => m.id).indexOf(action.payload.id);

            if (decMissionIndex !== -1) {
                decMissionArr[decMissionIndex].progress = decMissionArr[decMissionIndex].progress - 1;
            }

            return { ...state, missions: decMissionArr };
        case "add_rewards":
            const newReward = { id: crypto.randomUUID(), name: action.payload.name };
            return { ...state, rewards: [...state.rewards, newReward] };
        case "update_rewards":
            const updateRewardsList = structuredClone(state.rewards);
            const rewardToUpdateIndex = updateRewardsList.findIndex(m => m.id === action.payload.id);

            if (rewardToUpdateIndex !== -1)
                updateRewardsList[rewardToUpdateIndex].name = action.payload.newName;

            return { ...state, rewards: updateRewardsList };
        case "remove_rewards":
            const filteredRewardsList = structuredClone(state.rewards).filter(r => r.id !== action.payload.id);
            return { ...state, rewards: filteredRewardsList };
        case "change_location":
            return { ...state, location: action.payload.location };
        case "change_terrain":
            return { ...state, terrain: action.payload.terrain };
        case "increment_day":
            return { ...state, day: state.day + 1 };
        case "decrement_day":
            return { ...state, day: state.day - 1 };
        case "update_day_note":
            const notes = structuredClone(state.notes);
            const noteIndex = notes.findIndex(n => state.day === n.day);

            if (noteIndex !== -1)
                notes[noteIndex].note = action.payload.note;

            return { ...state, notes };
        case "update_campaign":
            let newNotes = [...state.notes];
            let newLocation = state.location;
        
            // Handling Changing Campaigns
            if (state.campaign !== action.payload.name) {
                newNotes = generateDefaultNotes(action.payload.name);
                newLocation = "";
            }
            return { ...state, campaign: action.payload.name, notes: newNotes, location: newLocation, day: (action.payload.name !== "Lure Of The Valley" && state.day > 30) ? 30 : state.day }
        case "hydrate":
            return { ...action.payload.data }
        default:
            return { ...state }
    }
}

export default reducer; 