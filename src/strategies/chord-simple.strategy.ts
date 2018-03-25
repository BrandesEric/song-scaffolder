import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration, TimePosition } from "../music/note";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { SongConfig } from "../config/song.config";
import { Chord } from "../music/chord";
import { ChordTrack } from "../state/tracks";

export class SimpleChordStrategy {

    private scale;
    private chords;
    private chordTrack: ChordTrack;

    private progressions = [
        [1, 5, 6, 4],
        [1, 4, 6, 5],
        [1, 6, 4, 5],
        [1, 5, 4, 5],
        [4, 1, 5, 6],
        [5, 6, 4, 1],
        [6, 5, 4, 5],
        [6, 4, 1, 5],
    ]

    numberOfClips: number = this.progressions.length;

    constructor(chordTrack: ChordTrack) {
        this.chordTrack = chordTrack;
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName).map(x => x.replace("Maj7", "M").replace("m7", "m").replace("7", ""));
    }
    generateAll(): Phrase[] {
        var phrases = [];
        for (var i = 0; i < this.progressions.length; i++) {
            var progression = this.progressions[i];
            var chordNames = progression.map(chordNumber => this.chords[chordNumber - 1]);
            var chords = chordNames.map(chordName => new Chord(chordName, NoteDuration.Whole, this.chordTrack));
            var phrase = new Phrase(progression.length, progression.toString());
            phrase.addNotesFromChords(chords);
            phrases.push(phrase);
        }

        return phrases;
    }
} 