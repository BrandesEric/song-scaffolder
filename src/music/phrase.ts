import { orderBy } from "lodash";
import { Note } from "./note";
import * as AbletonJs from "ableton-js"


export class Phrase {

    private _notes: Note[] = [];

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

    addNote(note: Note) {
        this._notes.push(note);
    }

    addNotes(notes: Note[]) {
        this._notes = this._notes.concat(notes);
    }

    toString(): string {
        return this._notes.map(x => `${x.name}_${x.timeStartInBeats}_${x.duration}`).join("  ");
    }

    toMidiClip(): AbletonJs.MidiClip {
        var clip = new AbletonJs.MidiClip();
        clip.lengthInBeats = this.numberOfBeats;
        clip.name = this.name;
        clip.notes = this._notes.map(x => new AbletonJs.Note(x.pitch, x.timeStartInBeats, x.durationInBeats))
        
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

        phrase.addNotes(newNotes);

        return phrase;
    }
}