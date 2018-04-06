import { Phrase } from "../music/phrase";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { Note, NoteLength, TimePosition } from "../music/note";
import * as AbletonJs from "ableton-js";
import { MidiTrack } from "ableton-js";
import { Chord } from "../music/chord";
import { SongConfig } from "../config/song.config";
import { ChordTrack } from "../state/chord-track";
import { RhythmPattern } from "../music/rhythm";
import { BassTrack } from "../state/bass-track";

export class BassGenerator {

    public bassTrack: BassTrack;
    private scale;
    private chords;

    constructor(bassTrack: BassTrack) {
        this.bassTrack = bassTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName).map(x => x.replace("Maj7", "M").replace("m7", "m").replace("7", ""));
    }

    async generate() {
    }
}