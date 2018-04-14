import { orderBy } from "lodash";
import { MidiNote } from "./midi-note";
import * as AbletonJs from "ableton-js"
import { Chord } from "./chord";


export class Phrase {

    private _notes: MidiNote[] = [];

    public bars: number;

    public name: string;

    public get numberOfBeats(): number {
        return this.bars * 4;
    }

    public get lastBeatPlayed(): number {
        if(this._notes.length === 0) {
            return -1;
        }
        
        return orderBy(this._notes, "timeStartInBeats", ["desc"])[0].timeStartInBeats;
    }


    constructor(bars: number, name: string = null) {
        this.bars = bars;
        this.name = name;
    }

    get notes(): MidiNote[] {
        return this._notes;
    }

    addMidiNote(note: MidiNote) {
        if(!note.duration.isRest) {
            this._notes.push(note);
        }
    }

    addMidiNotes(notes: MidiNote[]) {
        notes = notes.filter(x => !x.duration.isRest);
        this._notes = this._notes.concat(notes);
    }

    addNotesFromChords(chords: Chord[]){
        var timeStartInBeats = 0;
        chords.forEach(chord => {
            if(!chord.duration.isRest) {
                var notes = chord.getMidiNotes(timeStartInBeats);
                this.addMidiNotes(notes);
            }
            timeStartInBeats += chord.duration.lengthInBeats;
        });
    }

    toString(): string {
        return this._notes.map(x => `${x.name}_${x.timeStartInBeats}_${x.duration}`).join("  ");
    }

    toMidiClip(): AbletonJs.MidiClip {
        var clip = new AbletonJs.MidiClip();
        clip.lengthInBeats = this.numberOfBeats;
        clip.name = this.name;
        clip.notes = this._notes.map(x => new AbletonJs.MidiNote(x.pitch, x.timeStartInBeats, x.durationInBeats, x.velocity))
        
        return clip;
    }

    double(): Phrase {
        var beats = this.numberOfBeats;
        var phrase = new Phrase(this.bars * 2, this.name);
        var newNotes = [].concat(this._notes);
        newNotes = newNotes.concat(this._notes.map(note => {
            var newNote = note.clone();
            newNote.timeStartInBeats = this.numberOfBeats + note.timeStartInBeats;
            return newNote;
        }));

        phrase.addMidiNotes(newNotes);

        return phrase;
    }

    concat(phrase: Phrase): Phrase {
        var newLengthInBars = this.bars + phrase.bars;
        var newPhrase = new Phrase(newLengthInBars, this.name);
        var newNotes = [].concat(this._notes.map(x => x.clone()));
        newNotes = newNotes.concat(phrase.notes.map(note => {
            var newNote = note.clone();
            newNote.timeStartInBeats = this.numberOfBeats + note.timeStartInBeats;
            return newNote;
        }));

        newPhrase.addMidiNotes(newNotes);

        return phrase;
    }
}