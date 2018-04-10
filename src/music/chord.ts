import { MidiNote } from "./midi-note";
import * as Tonal from "tonal";
import { ChordTrack } from "../state/chord-track";
import { ChordGenerator } from "../generators/chord-generator";
import { NoteLength } from "./note-length";
import { Note } from "./note";
import { orderBy } from "lodash";

export class Chord {
    name: string;
    duration: NoteLength = NoteLength.Whole;
    chordTrack: ChordTrack;

    constructor(name: string, duration: NoteLength, chordTrack: ChordTrack) {
        this.name = name;
        this.duration = duration;
        this.chordTrack = chordTrack;
        this.noteNamesInChord = Tonal.Chord.notes(name);

        var rootNoteWithOctave = this.noteNamesInChord[0] + this.chordTrack.startOctave;
        this.rootNote = Note.fromString(rootNoteWithOctave);
        this.intervals = this.getIntervals(this.rootNote, this.noteNamesInChord);
        this.chordNotes = this.getNotesInChord(this.rootNote, this.intervals);
    }

    private rootNote: Note;
    private chordNotes: Note[];
    private intervals: string[];
    private noteNamesInChord: string[];
    private velocity = 100;

    private getIntervals(rootNote: Note, notesInChord: string[]): string[]{ 
        var intervals = notesInChord.map(x => Tonal.Distance.interval(rootNote.noteName, x));
        return intervals;
    }

    public getMidiNotes(timeStartInBeats: number): MidiNote[] {
        if(this.chordTrack.isArpeggiated) {
            let notes: Note[];
            if(this.chordTrack.arpeggiatorDirection === "up") {
                notes = orderBy(this.chordNotes, (x) => x.toMidi(), ["asc"]);
            }
            else if(this.chordTrack.arpeggiatorDirection === "down") {
                notes = orderBy(this.chordNotes, (x) => x.toMidi(), ["desc"]);
            }
            else {
                var upNotes = orderBy(this.chordNotes, (x) => x.toMidi(), ["asc"]);
                var downNotes = orderBy(this.chordNotes, (x) => x.toMidi(), ["desc"]);
                upNotes.pop();
                downNotes.pop();
                notes = upNotes.concat(downNotes);
            }
            var currentIndex = 0;
            var currentLengthInBeats = 0;
            var midiNotes = [];
            var length = this.chordTrack.arpeggiatorLength;
            while(currentLengthInBeats < this.duration.lengthInBeats) {
                var note = notes[currentIndex % notes.length];
                if(length.lengthInBeats + currentLengthInBeats > this.duration.lengthInBeats) {
                    length = NoteLength.fromBeats(this.duration.lengthInBeats - currentLengthInBeats);
                }
                midiNotes.push(MidiNote.fromNoteName(note.fullName, timeStartInBeats + currentLengthInBeats, length));
                currentLengthInBeats += length.lengthInBeats;
                currentIndex++;
            }

            return midiNotes;
        }
        else {
            let midiNotes = this.chordNotes.map(chordNote => {
                var note = MidiNote.fromNoteName(chordNote.fullName, timeStartInBeats, this.duration,  this.velocity);

                return note;
            });

            return midiNotes;
        }
    }
    
    private getNotesInChord(rootNote: Note, intervals: string[]): Note[] {
        var chordNotes = intervals.map(interval => {
            var note = Tonal.Distance.transpose(rootNote.fullName, interval);

            return Note.fromString(note);
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