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


export class ChordTrack {
    id: string = uuid();
    name: string = "Unspecified";
    kind: TrackKind = TrackKind.Chord;
    startOctave: number = 3;

    public static fromFormPost(form): ChordTrack {
        var track = new ChordTrack();
        track.id = form.id;
        track.name = form.name;
        track.startOctave = form.startOctave;

        return track;
    }
}


export enum TrackKind {
    Unspecified,
    Chord
}