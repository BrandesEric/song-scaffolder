import { ApplicationState } from "./application-state";
import { deviceActive } from "./device-active";
import { getTempo } from "./tempo";
import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";
import { SnareTrack } from "./snare-track";
import { HihatTrack } from "./hihat-track";

var state = new ApplicationState();

// TEMPORARY FOR TESTING
var chordTrack = new ChordTrack();
state.chordTracks.push(chordTrack);
var kickTrack = new KickTrack();
state.kickTracks.push(kickTrack);
var snareTrack = new SnareTrack();
state.snareTracks.push(snareTrack);
var hihatTrack = new HihatTrack();
state.hihatTracks.push(hihatTrack);

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