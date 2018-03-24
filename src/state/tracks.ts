import * as AbletonJs from "ableton-js";
import * as uuid from "uuid/v4";
import { ApplicationState } from "./application-state";
import { ChordGenerator } from "../generators/chord-generator";
import { ChordOptions } from "../music/chord";

export function addChords(state: ApplicationState) {
    state.chordTracks.push(new ChordTrack());
}

export async function generateChords(chordTrack: ChordTrack, state: ApplicationState): Promise<boolean> {
    var chordGenerator = new ChordGenerator(chordTrack);
    await chordGenerator.generate();
    state.updateChordTrack(chordTrack);

    return true;
}


export class ChordTrack {
    id: string = uuid();
    name: string = "Chords";
    kind: TrackKind = TrackKind.Chord;
    numClips: number = 10;
    startOctave: number = 3;
    includeBasicChords: boolean = true;
    clearClips: boolean = true;
    includeBassNote: boolean = true;
    includeTwoOctaveBassNote: boolean = false;
    

    public static fromFormPost(form): ChordTrack {
        var track = new ChordTrack();
        track.id = form.id;
        track.name = form.name;
        track.startOctave = form.startOctave;
        track.numClips = form.numClips;
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.includeBasicChords = !!form.includeBasicChords && form.includeBasicChords === "true";
        track.includeBassNote = !!form.includeBassNote && form.includeBassNote === "true";
        track.includeTwoOctaveBassNote = !!form.includeTwoOctaveBassNote && form.includeTwoOctaveBassNote === "true";

        return track;
    }
}


export enum TrackKind {
    Unspecified,
    Chord
}