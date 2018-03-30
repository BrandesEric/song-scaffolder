import * as AbletonJs from "ableton-js";
import * as uuid from "uuid/v4";
import { ApplicationState } from "./application-state";
import { ChordGenerator } from "../generators/chord-generator";
import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";
import { KickDrumGenerator } from "../generators/kick-drum.generator";

export function addChords(state: ApplicationState) {
    state.chordTracks.push(new ChordTrack());
}

export async function generateChords(chordTrack: ChordTrack, state: ApplicationState): Promise<boolean> {
    var chordGenerator = new ChordGenerator(chordTrack);
    await chordGenerator.generate();
    state.updateChordTrack(chordTrack);

    return true;
}

export function addKick(state: ApplicationState) {
    state.kickTracks.push(new KickTrack());
}

export async function generateKick(kickTrack: KickTrack, state: ApplicationState): Promise<boolean> {
    var kickGenerator = new KickDrumGenerator(kickTrack);
    await kickGenerator.generate();
    state.updateKickTrack(kickTrack);

    return true;
}



export enum TrackKind {
    Unspecified,
    Chord,
    Kick
}