import { ApplicationState } from "./application-state";
import { deviceActive } from "./device-active";
import { getTempo } from "./tempo";
import { ChordTrack } from "./tracks";

var state = new ApplicationState();

// TEMPORARY FOR TESTING
var chordTrack = new ChordTrack();
state.chordTracks.push(chordTrack);

export async function currentState(): Promise<ApplicationState> {

    state.deviceActive = await deviceActive();
    
    if(state.deviceActive){
        state.tempo = await getTempo(); 
    }
    else {
        state.tempo = null;
    }

    return state;
}