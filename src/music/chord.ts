import { NoteDuration, Note } from "./note";
import * as Tonal from "tonal";
import { ChordTrack } from "../state/tracks";
import { ChordGenerator } from "../generators/chord-generator";

export class Chord {
    name: string;
    duration: NoteDuration = NoteDuration.Whole;
    chordTrack: ChordTrack;

    constructor(name: string, duration: NoteDuration, chordTrack: ChordTrack) {
        this.name = name;
        this.duration = duration;
        this.chordTrack = chordTrack;
        this.noteNamesInChord = Tonal.Chord.notes(name);

        var rootNoteWithOctave = this.noteNamesInChord[0] + this.chordTrack.startOctave;
        this.rootNote = ChordNote.fromNote(rootNoteWithOctave);
        this.intervals = this.getIntervals(this.rootNote, this.noteNamesInChord);
        this.chordNotes = this.getChordNotes(this.rootNote, this.intervals);
    }

    private rootNote: ChordNote;
    private chordNotes: ChordNote[];
    private intervals: string[];
    private noteNamesInChord: string[];
    private velocity = 100;

    private getIntervals(rootNote: ChordNote, notesInChord: string[]): string[]{ 
        var intervals = notesInChord.map(x => Tonal.Distance.interval(rootNote.noteName, x));
        return intervals;
    }

    public getNotes(timeStartInBeats: number): Note[] {
        var notes = this.chordNotes.map(chordNote => {
            var note = Note.fromNoteName(chordNote.noteAndOctave, timeStartInBeats, this.duration,  this.velocity);

            return note;
        });

        return notes;
    }
    
    private getChordNotes(rootNote: ChordNote, intervals: string[]): ChordNote[] {
        var chordNotes = intervals.map(interval => {
            var noteWithOctave = Tonal.Distance.transpose(rootNote.noteAndOctave, interval);

            return ChordNote.fromNote(noteWithOctave);
        });

        if(this.chordTrack.voicing === "open") {
            chordNotes[1] = chordNotes[1].addOctave();
        }
        else if(this.chordTrack.voicing === "firstInversion") {
            chordNotes[1] = chordNotes[1].subtractOctave();
        }
        else if(this.chordTrack.voicing === "secondInversion") {
            chordNotes[2] = this.rootNote.clone().transposeBy("-4P");
        }

        if(this.chordTrack.includeBassNote){
            chordNotes = [this.rootNote.clone().subtractOctave()].concat(chordNotes);
        }
        if(this.chordTrack.includeTwoOctaveBassNote) {
            chordNotes = [this.rootNote.clone().subtractOctave().subtractOctave()].concat(chordNotes);
        }

        return chordNotes;
    }
}

export class ChordNote {
    noteName: string;
    octave: number;

    get noteAndOctave(): string {
        return this.noteName + this.octave;
    }

    addOctave(): ChordNote{
        return this.transposeBy("8P");
    }

    subtractOctave(): ChordNote {
        return this.transposeBy("-8P");
    }

    transposeBy(interval: string): ChordNote { 
        var newNoteNameAndOctave = Tonal.Distance.transpose(this.noteAndOctave, interval);

        return ChordNote.fromNote(newNoteNameAndOctave);
    }

    distancefrom(chordNote: ChordNote): string {
        return Tonal.Distance.interval(chordNote.noteAndOctave, this.noteAndOctave);
    }

    distanceTo(chordNote: ChordNote): string {
        return Tonal.Distance.interval(this.noteAndOctave, chordNote.noteAndOctave);
    }
    
    clone(): ChordNote {
        var chordNote = new ChordNote();
        chordNote.noteName = this.noteName;
        chordNote.octave = this.octave;

        return chordNote;
    }

    static fromNote(note: string): ChordNote{
        var tokens = Tonal.Note.tokenize(note);
        var chordNote = new ChordNote();
        chordNote.noteName = tokens[0];
        chordNote.octave = parseInt(tokens[2]);
        
        return chordNote;
    }
}