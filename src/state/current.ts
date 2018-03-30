import { ApplicationState } from "./application-state";
import { deviceActive } from "./device-active";
import { getTempo } from "./tempo";
import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";

var state = new ApplicationState();

// TEMPORARY FOR TESTING
var chordTrack = new ChordTrack();
state.chordTracks.push(chordTrack);
var kickTrack = new KickTrack();
state.kickTracks.push(kickTrack);

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