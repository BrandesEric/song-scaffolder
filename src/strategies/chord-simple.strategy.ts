import { IClipGenerationStrategy } from "./iclip-generation-strategy";
import { Phrase } from "../music/phrase";
import { Pattern } from "../music/pattern";
import { Note, NoteDuration, TimePosition } from "../music/note";
import { Scale, Chord } from "tonal";
import * as Key from "tonal-key";
import { SongConfig } from "../config/song.config";

export class SimpleChordStrategy implements IClipGenerationStrategy {
    numberOfClips: number = 1;

    private scale;
    private chords;
    private startOctave: number;
    private currentProgression = 0;

    private progressions = [
        [1, 5, 6, 4],
        [6, 5, 4, 5],
        [1, 6, 4, 5],
        [1, 4, 6, 5],
        [1, 5, 4, 5]
    ]

    constructor(startOctave = 3) {
        var scaleName = `${SongConfig.key} ${SongConfig.mode}`;
        this.scale = Scale.notes(scaleName);
        this.chords = Key.chords(scaleName);
        this.startOctave = startOctave;
    }
    generate(): Phrase {
        var progression = this.progressions[this.currentProgression];
        var phrase = new Phrase(progression.length, progression.toString());
        for(var i = 0; i < progression.length; i++){
            var chordName = this.chords[progression[i] - 1];
            var notes = this.convertChordToNotes(chordName);
        }
        return phrase.double();
    }

    convertChordToNotes(chordName: string): Note[] {
        var chordNotes = Chord.notes(chordName);
        var notes = [];
        for(var j = 0; j < chordNotes.length; j++) {
            var noteName = chordNotes[j];
            noteName += this.startOctave;
            var note = Note.fromNoteName(noteName, TimePosition.timeInBeats(i), NoteDuration.Whole, 100);
            notes.push(note);
        }

        return notes;
    }


} 