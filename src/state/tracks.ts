import * as AbletonJs from "ableton-js";
import * as uuid from "uuid/v4";
import { ApplicationState } from "./application-state";
import { ChordGenerator } from "../generators/chord-generator";
import { ChordTrack } from "./chord-track";
import { KickTrack } from "./kick-track";
import { KickDrumGenerator } from "../generators/kick-drum.generator";
import { SnareTrack } from "./snare-track";
import { SnareDrumGenerator } from "../generators/snare-drum.generator";
import { HihatTrack } from "./hihat-track";
import { HihatGenerator } from "../generators/hihat.generator";
import { BassTrack } from "./bass-track";
import { BassGenerator } from "../generators/bass-generator";

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

export function addSnare(state: ApplicationState) {
    state.snareTracks.push(new SnareTrack());
}

export async function generateSnare(snareTrack: SnareTrack, state: ApplicationState): Promise<boolean> {
    var snareGenerator = new SnareDrumGenerator(snareTrack);
    await snareGenerator.generate();
    state.updateSnareTrack(snareTrack);

    return true;
}

export function addHihat(state: ApplicationState) {
    state.hihatTracks.push(new HihatTrack());
}

export async function generateHihat(hihatTrack: HihatTrack, state: ApplicationState): Promise<boolean> {
    var hihatGenerator = new HihatGenerator(hihatTrack);
    await hihatGenerator.generate();
    state.updateHihatTrack(hihatTrack);

    return true;
}

export async function generateBass(bassTrack: BassTrack, state: ApplicationState): Promise<boolean> {
    var bassGenerator = new BassGenerator(bassTrack);
    await bassGenerator.generate();
    state.updateBassTrack(bassTrack);

    return true;
}



export enum TrackKind {
    Unspecified,
    Chord,
    Kick,
    Snare,
    Hihat,
    Bass
}