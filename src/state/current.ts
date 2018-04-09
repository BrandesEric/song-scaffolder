import { ApplicationState } from "./application-state";
import { deviceActive } from "./device-active";
import { getTempo } from "./tempo";
import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";
import { SnareTrack } from "./snare-track";
import { HihatTrack } from "./hihat-track";
import { BassTrack } from "./bass-track";
import * as AbletonJs from "ableton-js";
import { MelodyTrack } from "./melody-track";

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

var bassTrack = new BassTrack();
bassTrack.sourceTrack = "Chords";
state.bassTracks.push(bassTrack);

var melodyTrack = new MelodyTrack();
melodyTrack.sourceTrack = "Chords";
state.melodyTracks.push(melodyTrack);

export async function currentState(): Promise<ApplicationState> {

    state.deviceActive = await deviceActive();
    let tracks = await AbletonJs.getTracks();
    state.existingTracks = tracks.filter(x => x.isMidi).map(x => x.name);

    if(state.deviceActive){
        state.tempo = await getTempo(); 
    }
    else {
        state.tempo = null;
    }

    return state;
}