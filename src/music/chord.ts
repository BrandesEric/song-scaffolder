import { NoteDuration, Note } from "./note";
import * as Tonal from "tonal";
import { ChordTrack } from "../state/tracks";

export class Chord {
    name: string;
    duration: NoteDuration = NoteDuration.Whole;
    chordTrack: ChordTrack;

    constructor(name: string, duration: NoteDuration, chordTrack: ChordTrack) {
        this.name = name;
        this.duration = duration;
        this.chordTrack = chordTrack;
        var notesInChord = Tonal.Chord.notes(name);
        this.rootNote = notesInChord[0];
        this.rootNoteWithOctave = notesInChord[0] + this.chordTrack.startOctave; // C2, Ab2 etc
        this.intervals = this.getIntervals(this.rootNote, notesInChord);
        this.noteNamesWithOctave = this.getNoteNamesWithOctave(this.rootNoteWithOctave, this.intervals);
    }

    private rootNote: string;
    private rootNoteWithOctave: string;
    private noteNamesWithOctave: string[];
    private intervals: string[];
    private velocity = 100;

    private getIntervals(rootNote: string, notesInChord: string[]): string[]{ 
        var intervals = notesInChord.map(x => Tonal.Distance.interval(rootNote, x));
        if(this.chordTrack.includeBassNote){
            intervals.push("-8P");
        }
        if(this.chordTrack.includeTwoOctaveBassNote){
            intervals.push("-15P");
        }
        return intervals;
    }

    public getNotes(timeStartInBeats: number): Note[] {
        var notes = this.noteNamesWithOctave.map(noteName => {
            var note = Note.fromNoteName(noteName, timeStartInBeats, this.duration,  this.velocity);

            return note;
        });

        return notes;
    }
    
    private getNoteNamesWithOctave(rootNoteWithOctave: string, intervals: string[]): string[] {
        var noteNamesWithOctave = intervals.map(interval => {
            var noteWithOctave = Tonal.Distance.transpose(rootNoteWithOctave, interval);

            return noteWithOctave;
        });

        return noteNamesWithOctave;
    }
}

export class ChordOptions {
    startOctave = 3;
    includeBassNote: boolean = true;
}