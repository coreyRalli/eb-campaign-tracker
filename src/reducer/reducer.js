// Create some fake items
const generateFakeitems = () => {
    const items = [];
    
    for (var i = 0; i <= 200; i++) {
        items.push({ name: `Item ${i + 1}`, id: i });
    }

    return items;
}

export const initialState = {
    location: "",
    terrain: "",
    day: 1,
    rangers: [],
    events: [],
    missions: [],
    rewards: []
}

const reducer = (state, action) => {
    switch (action.type) {
        case "add_ranger":
            const newRanger = { id: crypto.randomUUID(), name: action.payload.name };
            return { ...state, rangers: [...state.rangers, newRanger] };
        case "remove_ranger":
            const filteredRangerList = [...state.rangers].filter(r => r.id !== action.payload.id);
            return { ...state, rangers: filteredRangerList };
        case "add_event":
            const newEvent = { id: crypto.randomUUID(), name: action.payload.name };
            return { ...state, events: [...state.events, newEvent] };
        case "update_event":
            return {...state};
        case "remove_event":
            const filteredEventList = [...state.events].filter(e => e.id !== action.payload.id);
            return { ...state, events: filteredEventList };
        case "update_mission":
            return {...state};
        case "add_mission":
            const newMission = { id: crypto.randomUUID(), name: action.payload.name, day: state.day, progress: action.payload.progress };
            return { ...state, missions: [...state.missions, newMission] };
        case "remove_mission":
            const filteredMissionList = [...state.missions].filter(m => m.id !== action.payload.id);
            return { ...state, missions: filteredMissionList };
        case "increment_mission_progress":
            const incMissionArr = [...state.missions];
            const incMissionIndex = incMissionArr.map(m => m.id).indexOf(action.payload.id);

            if (incMissionIndex !== -1)
                incMissionArr[incMissionIndex].progress = incMissionArr[incMissionIndex].progress + 1;

            return { ...state, missions: incMissionArr }
        case "decrement_mission_progress":
            const decMissionArr = [...state.missions];
            const decMissionIndex = decMissionArr.map(m => m.id).indexOf(action.payload.id);

            if (decMissionIndex !== -1) {
                decMissionArr[decMissionIndex].progress = decMissionArr[decMissionIndex].progress - 1;
            }

            return { ...state, missions: decMissionArr };
        case "add_rewards":
            const newReward = { id: crypto.randomUUID(), name: action.payload.name };
            return {...state, rewards: [...state.rewards, newReward]};
        case "update_rewards":
            return {...state}
        case "remove_rewards":
            const filteredRewardsList = [...state.rewards].filter(r => r.id !== action.payload.id);
            return { ...state, rewards: filteredRewardsList };
        case "change_location":
            return { ...state, location: action.payload.location }
        case "change_terrain":
            return { ...state, terrain: action.payload.terrain }
        case "increment_day":
            return { ...state, day: state.day + 1 }
        case "decrement_day":
            return { ...state, day: state.day - 1 }
        case "hydrate":
            return { ...action.payload.data}
        default:
            return { ...state }
    }
}

export default reducer; 