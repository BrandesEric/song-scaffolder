import * as AbletonJs from "ableton-js";
import * as uuid from "uuid/v4";
import { ApplicationState } from "./application-state";
import { ChordGenerator } from "../generators/chord-generator";

export function addChords(state: ApplicationState) {
    state.chordTracks.push(new ChordTrack());
}

export async function generateChords(chordTrack: ChordTrack, state: ApplicationState): Promise<boolean> {
    var chordGenerator = new ChordGenerator(chordTrack);
    await chordGenerator.generate();
    state.updateChordTrack(chordTrack);

    return true;
}

export type ChordVoicing = "normal" | "open" | "firstInversion" | "secondInversion";

export class ChordTrack {
    id: string = uuid();
    name: string = "Chords";
    
    kind: TrackKind = TrackKind.Chord;
    
    numClips: number = 10;
    clipLengthInBars: number = 4;
    startOctave: number = 3;
    quarterNoteChance: number = 0;
    halfNoteChance: number = 0;
    wholeNoteChance: number = 1;
    twoWholeNoteChance: number = 0;
    percentRepeatChance: number = 0;

    includeBasicChords: boolean = true;
    clearClips: boolean = true;
    includeBassNote: boolean = true;
    includeTwoOctaveBassNote: boolean = false;
    randomizeChordDuration: boolean = false;

    voicing: ChordVoicing = "normal";
    

    public static fromFormPost(form): ChordTrack {
        var track = new ChordTrack();
        track.id = form.id;
        track.name = form.name;
        
        track.startOctave = form.startOctave;
        track.numClips = form.numClips;
        track.clipLengthInBars = parseInt(form.clipLengthInBars || 4);
        track.quarterNoteChance = parseInt(form.quarterNoteChance || 0);
        track.halfNoteChance = parseInt(form.halfNoteChance || 0);
        track.wholeNoteChance = parseInt(form.wholeNoteChance || 0);
        track.twoWholeNoteChance = parseInt(form.twoWholeNoteChance || 0);
        track.percentRepeatChance = parseInt(form.percentRepeatChance || 0);
        
        track.clearClips = form.clearClips && form.clearClips === "true";
        track.includeBasicChords = !!form.includeBasicChords && form.includeBasicChords === "true";
        track.includeBassNote = !!form.includeBassNote && form.includeBassNote === "true";
        track.includeTwoOctaveBassNote = !!form.includeTwoOctaveBassNote && form.includeTwoOctaveBassNote === "true";
        track.randomizeChordDuration = !!form.randomizeChordDuration && form.randomizeChordDuration === "true";
        
        track.voicing = form.voicing;

        return track;
    }
}


export enum TrackKind {
    Unspecified,
    Chord
}