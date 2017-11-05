import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration, TimePosition } from "../music/note";
import * as Tonal from "tonal";
import * as Key from "tonal-key";
import { SongConfig } from "../config/song.config";
import { Chord } from "../music/chord";

export class SimpleChordStrategy implements IClipGenerationStrategy {

    private scale;
    private chords;
    private startOctave: number;
    private currentProgression = 0;

    private progressions = [
        [1, 5, 6, 4],
        [6, 5, 4, 5],
        [1, 6, 4, 5],
        [1, 4, 6, 5],
        [1, 5, 4, 5],
        [1, 5, 6],
        [1, 3, 4, 1],
        [1, 2, 5, 1],
        [1, 4, 5, 1],
        [6,5,4,1]
    ]

    numberOfClips: number = this.progressions.length;

    constructor(startOctave = 2) {
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Tonal.Scale.notes(scaleName);
        this.chords = Key.chords(scaleName);
        this.startOctave = startOctave;
    }
    generate(): Phrase {
        var progression = this.progressions[this.currentProgression];
        var chordNames = progression.map(chordNumber => this.chords[chordNumber - 1]);
        var chords = chordNames.map(chordName => new Chord(chordName, NoteDuration.Whole, this.startOctave));
        var phrase = new Phrase(progression.length, progression.toString());
        phrase.addNotesFromChords(chords);
        this.currentProgression++;

        return phrase; 
    }
} 